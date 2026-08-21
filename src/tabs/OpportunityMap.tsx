"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map as MapIcon, Search, MapPin, AlertTriangle, CheckCircle, XCircle,
  Trash2, ExternalLink, Loader2
} from "lucide-react";
import dynamic from "next/dynamic";
import { getRecommendation } from "@/logic/matchEngine";
import { evaluateHardwareFactors } from "@/logic/hardwareFactors";
import { checkRegion } from "@/logic/regionCheck";
import { DAWN_LINKS, DISCLAIMERS } from "@/data/dawnFacts";
import DataDisclaimer from "@/components/DataDisclaimer";
import type { FitResult } from "@/types/fitResult";
import type { TabId } from "@/app/page";

// Dynamically import Leaflet map to avoid SSR issues
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center"
      style={{ background: "rgba(10,10,10,0.8)", borderRadius: "12px" }}>
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[rgba(233,108,56,0.3)] border-t-[#E96C38] rounded-full animate-spin mx-auto" />
        <p className="text-sm text-white/40">Loading map...</p>
      </div>
    </div>
  ),
});

interface OpportunityMapProps {
  onTabChange: (tab: TabId) => void;
  onResult: (result: FitResult) => void;
}

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  locationName: string;
  country: string;
  region?: string;
  overpassData: OverpassData | null;
  fitResult: FitResult;
  loading: boolean;
  error?: string;
  dataQuality: "good" | "limited" | "none";
}

import { nominatimSearch, reverseGeocode, queryOverpass, inferDensity } from "@/logic/locationLookup";
import type { NominatimResult, OverpassData } from "@/logic/locationLookup";
export type { OverpassData };

export default function OpportunityMapTab({ onTabChange, onResult }: OpportunityMapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [pins, setPins] = useState<MapPin[]>([]);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError("");
    setSearchResults([]);
    try {
      const results = await nominatimSearch(searchQuery);
      setSearchResults(results);
      if (results.length === 0) setSearchError("No locations found. Try a different search term.");
    } catch {
      setSearchError("Search failed — please try again.");
    }
    setSearching(false);
  }, [searchQuery]);

  const addPin = useCallback(async (lat: number, lng: number, locationName: string, country: string, region?: string) => {
    const id = `pin-${Date.now()}`;

    // Create initial pin with loading state
    const tempPin: MapPin = {
      id, lat, lng, locationName, country, region,
      overpassData: null,
      loading: true,
      dataQuality: "none",
      fitResult: {
        propertyType: "commercial",
        rooftopAccess: false,
        nearbyDensity: "few",
        interest: "not sure",
        matchResult: getRecommendation({ rooftopAccess: false, propertyType: "commercial", nearbyDensity: "few", interest: "not sure" }, evaluateHardwareFactors({ rooftopAccess: false, propertyType: "commercial", nearbyDensity: "few", interest: "not sure" })),
        hardwareFactors: evaluateHardwareFactors({ rooftopAccess: false, propertyType: "commercial", nearbyDensity: "few", interest: "not sure" }),
        locationName,
        coordinates: { lat, lng },
        source: "map",
        timestamp: Date.now(),
      },
    };

    setPins((prev) => [...prev, tempPin]);
    setSearchResults([]);
    setSearchQuery("");
    setSelectedPin(id);

    // Fetch real Overpass data
    const overpassData = await queryOverpass(lat, lng);
    const density = inferDensity(overpassData);

    const regionCheck = checkRegion(country, region);
    const hardwareFactors = evaluateHardwareFactors({
      rooftopAccess: false,
      propertyType: "commercial",
      nearbyDensity: density,
      interest: "not sure",
    });
    const matchResult = getRecommendation({
      rooftopAccess: false,
      propertyType: "commercial",
      nearbyDensity: density,
      interest: "not sure",
    }, hardwareFactors);

    const fitResult: FitResult = {
      propertyType: "commercial",
      rooftopAccess: false,
      nearbyDensity: density,
      interest: "not sure",
      matchResult,
      hardwareFactors,
      locationName,
      coordinates: { lat, lng },
      regionStatus: regionCheck.status,
      regionMessage: regionCheck.message,
      source: "map",
      timestamp: Date.now(),
    };

    setPins((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              loading: false,
              overpassData,
              dataQuality: overpassData ? (overpassData.buildingCount > 5 ? "good" : "limited") : "none",
              fitResult,
            }
          : p
      )
    );

    onResult(fitResult);
  }, [onResult]);

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    const geocoded = await reverseGeocode(lat, lng);
    const locationName = geocoded?.display_name?.split(",").slice(0, 3).join(", ") || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    const country = geocoded?.address?.country || "";
    const region = geocoded?.address?.city || geocoded?.address?.town || geocoded?.address?.state;
    await addPin(lat, lng, locationName, country, region);
  }, [addPin]);

  const handleSearchResultClick = useCallback(async (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const locationName = result.display_name.split(",").slice(0, 3).join(", ");
    const country = result.address?.country || "";
    const region = result.address?.city || result.address?.town || result.address?.state;
    await addPin(lat, lng, locationName, country, region);
  }, [addPin]);

  const removePin = useCallback((id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
    if (selectedPin === id) setSelectedPin(null);
  }, [selectedPin]);

  const selectedPinData = pins.find((p) => p.id === selectedPin);

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(233,108,56,0.15)", border: "1px solid rgba(233,108,56,0.3)", color: "#E96C38" }}>
            <MapIcon size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Opportunity Map</h2>
            <p className="text-sm text-white/50">Search any location — real data from OpenStreetMap</p>
          </div>
        </div>
        <DataDisclaimer message={DISCLAIMERS.mapData} />
      </motion.div>

      {/* Search bar */}
      <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search any city, address, or landmark worldwide..."
              className="pl-9"
            />
          </div>
          <motion.button
            onClick={handleSearch}
            disabled={searching || !searchQuery.trim()}
            className="btn-primary px-5 flex items-center gap-2 disabled:opacity-40"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Search
          </motion.button>
        </div>

        {/* Search results dropdown */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl overflow-hidden"
              style={{ background: "rgba(15,15,15,0.98)", border: "1px solid rgba(233,108,56,0.2)", backdropFilter: "blur(20px)" }}
            >
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  onClick={() => handleSearchResultClick(result)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[rgba(233,108,56,0.08)] transition-colors border-b border-[rgba(255,255,255,0.04)] last:border-0"
                >
                  <MapPin size={14} className="text-[#E96C38] flex-shrink-0" />
                  <span className="text-sm text-white/80 truncate">{result.display_name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {searchError && <p className="mt-2 text-sm text-red-400">{searchError}</p>}
      </motion.div>

      <p className="text-xs text-white/40 text-center">
        Click on the map to drop a pin, or search above. Map data © OpenStreetMap contributors. Geocoding: Nominatim.
      </p>

      {/* Map */}
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{ height: "400px", border: "1px solid rgba(233,108,56,0.2)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <LeafletMap pins={pins} onMapClick={handleMapClick} onPinSelect={setSelectedPin} selectedPinId={selectedPin} />
      </motion.div>

      {/* Pin results */}
      <AnimatePresence>
        {pins.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <MapPin size={16} className="text-[#E96C38]" />
                {pins.length} Pin{pins.length !== 1 ? "s" : ""} — Compare Locations
              </h3>
              {pins.length > 1 && (
                <button onClick={() => setPins([])} className="text-xs text-white/40 hover:text-red-400 transition-colors flex items-center gap-1">
                  <Trash2 size={12} /> Clear all
                </button>
              )}
            </div>

            {pins.map((pin) => (
              <motion.div
                key={pin.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`glass-card p-5 cursor-pointer transition-all duration-200 ${selectedPin === pin.id ? "border-[rgba(233,108,56,0.4)]" : ""}`}
                onClick={() => setSelectedPin(pin.id === selectedPin ? null : pin.id)}
                style={{ border: selectedPin === pin.id ? "1px solid rgba(233,108,56,0.4)" : "" }}
              >
                {/* Pin header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <MapPin size={16} className="text-[#E96C38] flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-medium text-white text-sm truncate">{pin.locationName}</p>
                      <p className="text-xs text-white/40">{pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}</p>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removePin(pin.id); }}
                    className="p-1 text-white/30 hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>

                {pin.loading ? (
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <Loader2 size={14} className="animate-spin text-[#E96C38]" />
                    Fetching real map data from Overpass API...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Data quality banner */}
                    {pin.dataQuality === "none" && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                        style={{ background: "rgba(255,150,50,0.1)", border: "1px solid rgba(255,150,50,0.2)" }}>
                        <AlertTriangle size={12} className="text-amber-400" />
                        <span className="text-amber-400/80">Limited data available for this area — treat as rough estimate only</span>
                      </div>
                    )}
                    {pin.dataQuality === "limited" && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                        style={{ background: "rgba(255,150,50,0.08)", border: "1px solid rgba(255,150,50,0.15)" }}>
                        <AlertTriangle size={12} className="text-amber-400/70" />
                        <span className="text-amber-400/60">Partial map data — results are approximate</span>
                      </div>
                    )}

                    {/* Region status */}
                    {pin.fitResult.regionMessage && (
                      <div className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs ${pin.fitResult.regionStatus === "confirmed"
                        ? "bg-[rgba(233,108,56,0.1)] border border-[rgba(233,108,56,0.2)]"
                        : "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]"}`}>
                        {pin.fitResult.regionStatus === "confirmed"
                          ? <CheckCircle size={12} className="text-[#E96C38] flex-shrink-0 mt-0.5" />
                          : <XCircle size={12} className="text-white/30 flex-shrink-0 mt-0.5" />}
                        <span className={pin.fitResult.regionStatus === "confirmed" ? "text-[#E96C38]/80" : "text-white/40"}>
                          {pin.fitResult.regionMessage}
                        </span>
                      </div>
                    )}

                    {/* Overpass data */}
                    {pin.overpassData && (
                      <div className="text-xs text-white/50">
                        <span className="text-white/70">OpenStreetMap data:</span>{" "}
                        {pin.overpassData.buildingCount} features within 500m
                        {pin.overpassData.hasUrbanFeatures && " · Urban features detected"}
                      </div>
                    )}

                    {/* Recommendation */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/40">Suggested fit</p>
                        <p className="font-semibold text-[#E96C38]">{pin.fitResult.matchResult.recommendation}</p>
                        <p className="text-xs text-white/50 mt-0.5">
                          Density: {pin.fitResult.nearbyDensity} • {pin.fitResult.matchResult.confidence} confidence
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <a href={DAWN_LINKS.blackBoxStore} target="_blank" rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                          <ExternalLink size={11} /> Buy Black Box
                        </a>
                        <a href={DAWN_LINKS.deployerForm} target="_blank" rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                          <ExternalLink size={11} /> Apply for Antenna
                        </a>
                      </div>
                    </div>

                    {/* Generate pitch */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onResult(pin.fitResult); onTabChange("pitch"); }}
                      className="w-full text-xs text-[#E96C38] hover:text-white transition-colors py-1.5 border border-[rgba(233,108,56,0.2)] rounded-lg hover:bg-[rgba(233,108,56,0.1)]"
                    >
                      Generate Pitch for This Location →
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {pins.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12 text-white/30"
        >
          <MapPin size={32} className="mx-auto mb-3 text-[rgba(233,108,56,0.3)]" />
          <p className="text-sm">Search a location or click on the map to drop a pin.</p>
          <p className="text-xs mt-1">All data comes from live OpenStreetMap queries — nothing is pre-baked.</p>
        </motion.div>
      )}
    </div>
  );
}