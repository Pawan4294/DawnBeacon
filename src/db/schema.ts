import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

// Stores only consented lead submissions from Check My Fit form
// No phone number field per privacy policy
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  propertyType: text("property_type").notNull(),
  rooftopAccess: boolean("rooftop_access").notNull().default(false),
  nearbyDensity: text("nearby_density").notNull(),
  interest: text("interest").notNull(),
  recommendation: text("recommendation"),
  consentTimestamp: timestamp("consent_timestamp").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
