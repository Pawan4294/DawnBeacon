"use client";

import { useEffect, useRef } from "react";
import type { MapPin } from "@/tabs/OpportunityMap";

interface LeafletMapProps {
  pins: MapPin[];
  onMapClick: (lat: number, lng: number) => void;
  onPinSelect: (id: string | null) => void;
  selectedPinId: string | null;
}

export default function LeafletMap({ pins, onMapClick, onPinSelect, selectedPinId }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Dynamically import Leaflet
    import("leaflet").then((L) => {
      // Fix default icon path issue in Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });

      leafletMapRef.current = map;
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when pins change
  useEffect(() => {
    if (!leafletMapRef.current) return;

    import("leaflet").then((L) => {
      const map = leafletMapRef.current;
      if (!map) return;

      // Add new markers
      pins.forEach((pin) => {
        if (!markersRef.current.has(pin.id)) {
          // Custom orange marker icon
          const customIcon = L.divIcon({
            className: "",
            html: `<div style="
              width: 28px; height: 28px;
              background: linear-gradient(135deg, #E96C38, #c4541d);
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 2px solid white;
              box-shadow: 0 4px 15px rgba(233,108,56,0.5);
            "></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 28],
          });

          const marker = L.marker([pin.lat, pin.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: Inter, sans-serif; color: white; min-width: 160px;">
                <p style="font-weight: 600; font-size: 13px; margin: 0 0 4px; color: #E96C38;">${pin.locationName}</p>
                <p style="font-size: 11px; color: rgba(255,255,255,0.5); margin: 0;">${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}</p>
                <p style="font-size: 11px; margin: 6px 0 0; color: rgba(255,255,255,0.7);">
                  ${pin.loading ? "Loading data..." : pin.fitResult.matchResult.recommendation}
                </p>
              </div>
            `)
            .on("click", () => onPinSelect(pin.id));

          markersRef.current.set(pin.id, marker);
          map.flyTo([pin.lat, pin.lng], Math.max(map.getZoom(), 13), { animate: true, duration: 1.2 });
        }
      });

      // Remove markers for deleted pins
      markersRef.current.forEach((marker, id) => {
        if (!pins.find((p) => p.id === id)) {
          marker.remove();
          markersRef.current.delete(id);
        }
      });
    });
  }, [pins, onPinSelect]);

  // Pan to selected pin
  useEffect(() => {
    if (!leafletMapRef.current || !selectedPinId) return;
    const pin = pins.find((p) => p.id === selectedPinId);
    if (pin) {
      leafletMapRef.current.flyTo([pin.lat, pin.lng], Math.max(leafletMapRef.current.getZoom(), 14), {
        animate: true,
        duration: 0.8,
      });
    }
  }, [selectedPinId, pins]);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ height: "100%", width: "100%", borderRadius: "12px" }} />
    </>
  );
}
