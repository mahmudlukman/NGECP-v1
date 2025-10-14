// utils/generatorHelpers.ts

import L from "leaflet";

/**
 * Get the color code for a generator status
 * @param status - The generator status (case-insensitive)
 * @returns Hex color code
 */
export const getStatusColor = (status?: string): string => {
  switch (status?.toLowerCase().replace(/[-_\s]/g, "")) {
    case "active":
      return "#875CF5"; // Purple
    case "inactive":
      return "#FA2C37"; // Red
    case "underinspection":
      return "#06B6D4"; // Cyan
    case "compliant":
      return "#4fbf8b"; // Green
    case "noncompliant":
      return "#c40477ff"; // Pink/Magenta
    default:
      return "#9CA3AF"; // Gray for unknown
  }
};

/**
 * Get the background and text color classes for a status badge
 * @param status - The generator status
 * @returns Object with background and text color
 */
export const getStatusBadgeStyle = (status?: string) => {
  const bgColor = getStatusColor(status);
  return {
    backgroundColor: bgColor,
    color: "#ffffff", // White text for all statuses
  };
};

/**
 * Get human-readable status label
 * @param status - The generator status
 * @returns Formatted status label
 */
export const getStatusLabel = (status?: string): string => {
  if (!status) return "Unknown";

  // Convert to title case and handle special cases
  const normalized = status.toLowerCase().replace(/[-_]/g, " ");
  return normalized
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Create a custom Leaflet marker icon based on generator status
 * @param status - The generator status
 * @returns L.DivIcon for use with Leaflet markers
 */
export const createGeneratorMarkerIcon = (status?: string): L.DivIcon => {
  const color = getStatusColor(status);

  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 16px;
          font-weight: bold;
        ">⚡</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

/**
 * Format generator capacity with unit
 * @param capacity - The capacity in KVA
 * @returns Formatted capacity string
 */
export const formatCapacity = (capacity: number): string => {
  return `${capacity.toLocaleString()} KVA`;
};

/**
 * Get status icon emoji
 * @param status - The generator status
 * @returns Emoji representing the status
 */
export const getStatusIcon = (status?: string): string => {
  switch (status?.toLowerCase().replace(/[-_\s]/g, "")) {
    case "active":
      return "✅";
    case "inactive":
      return "❌";
    case "underinspection":
      return "🔍";
    case "compliant":
      return "✔️";
    case "noncompliant":
      return "⚠️";
    default:
      return "❓";
  }
};

/**
 * All available generator statuses
 */
export const GENERATOR_STATUSES = [
  { value: "active", label: "Active", color: "#875CF5" },
  { value: "inactive", label: "Inactive", color: "#FA2C37" },
  { value: "under_inspection", label: "Under Inspection", color: "#06B6D4" },
  { value: "compliant", label: "Compliant", color: "#4fbf8b" },
  { value: "non_compliant", label: "Non-Compliant", color: "#c40477ff" },
] as const;

/**
 * Validate if coordinates are valid (not 0,0 and within reasonable bounds)
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Boolean indicating if coordinates are valid
 */
export const isValidCoordinates = (
  latitude?: number,
  longitude?: number
): boolean => {
  if (!latitude || !longitude) return false;
  if (latitude === 0 && longitude === 0) return false;

  // Check if within reasonable bounds (roughly world boundaries)
  if (latitude < -90 || latitude > 90) return false;
  if (longitude < -180 || longitude > 180) return false;

  return true;
};

/**
 * Format location address
 * @param address - Street address
 * @param lga - Local Government Area
 * @param state - State
 * @returns Formatted address string
 */
export const formatLocation = (
  address?: string,
  lga?: string,
  state?: string
): string => {
  const parts = [address, lga, state].filter(Boolean);
  return parts.join(", ");
};
