import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useGetMyGeneratorsQuery } from "../../redux/features/generator/generatorApi";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";

// Define Generator type
interface Generator {
  _id: string;
  brand: string;
  model: string;
  serialNumber: string;
  capacity: number | string; // Allow string due to "45 KVA" in data
  yearOfManufacture: number;
  fuelType: string;
  status?: string;
  location: {
    address: string;
    state: string;
    lga: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}

// Status color mapping based on legend
const statusColors: Record<string, string> = {
  active: "#875CF5", // Purple
  inactive: "#FA2C37", // Red
  underinspection: "#06B6D4", // Cyan
  compliant: "#4fbf8b", // Green
  noncompliant: "#c40477ff", // Pink
  unknown: "#6B7280", // Gray (fallback)
};

// Normalize status for consistency
const normalizeStatus = (status?: string): string => {
  if (!status) return "unknown";
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === "under_inspection") return "underinspection";
  return lowerStatus.replace("_", "");
};

// Custom marker icon with status color and number for multiple generators
const createMarkerIcon = (status: string = "unknown", count: number = 1) => {
  const normalizedStatus = normalizeStatus(status);
  const color = statusColors[normalizedStatus] || statusColors.unknown;

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
          font-size: ${count > 1 ? "12px" : "16px"};
          font-weight: bold;
        ">
          ${count > 1 ? count : "⚡"}
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// Component to fit map bounds to all markers
function FitBounds({ generators }: { generators: Generator[] }) {
  const map = useMap();

  useEffect(() => {
    if (generators.length > 0) {
      const bounds = generators
        .filter((gen) => gen.location?.coordinates?.latitude && gen.location?.coordinates?.longitude)
        .map(
          (gen) =>
            [
              gen.location.coordinates!.latitude,
              gen.location.coordinates!.longitude,
            ] as [number, number]
        );

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [generators, map]);

  return null;
}

const MyGeneratorsMapView = () => {
  const navigate = useNavigate();
  const [page] = useState(1);
  const [pageSize] = useState(1000); // Load all generators for map
  const [selectedGenerator, setSelectedGenerator] = useState<Generator | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useGetMyGeneratorsQuery({
    page,
    pageSize,
  });

  const generators: Generator[] = data?.generators || [];

  useEffect(() => {
    if (error) {
      toast.error("Failed to load generators");
    }
  }, [error]);

  // Group generators by coordinates to count multiple generators at the same location
  const groupedGenerators = useMemo(() => {
    const map = new Map<string, Generator[]>();
    generators.forEach((gen) => {
      if (gen.location?.coordinates?.latitude && gen.location?.coordinates?.longitude) {
        const key = `${gen.location.coordinates.latitude},${gen.location.coordinates.longitude}`;
        const existing = map.get(key) || [];
        map.set(key, [...existing, gen]);
      }
    });
    return map;
  }, [generators]);

  const handleViewDetails = (generatorId: string) => {
    navigate(`/admin/generator-details/${generatorId}`);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout activeMenu="Manage Generators">
        <div className="my-5 bg-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading generators map...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const validGenerators = generators.filter(
    (gen) =>
      gen.location?.coordinates?.latitude &&
      gen.location?.coordinates?.longitude &&
      gen.location.coordinates.latitude !== 0 &&
      gen.location.coordinates.longitude !== 0
  );

  return (
    <DashboardLayout activeMenu="Generators Map View">
      <div className="my-5">
        {/* Header */}
        <div className="bg-white p-6 rounded-t-2xl shadow-md border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-slate-600 font-semibold">
                Generators{" "}
                <span className="text-slate-800 font-bold">Map View</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Showing {validGenerators.length} of {generators.length}{" "}
                generators with valid locations
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/admin/manage-generators")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 hover:scale-103 active:scale-95 transition"
              >
                List View
              </button>
              <button
                onClick={() => navigate("/admin/register-generator")}
                className="px-4 py-2 text-white rounded-lg bg-primary hover:scale-103 active:scale-95 transition"
              >
                + Add Generator
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#875CF5]"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FA2C37]"></div>
              <span>Inactive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#06B6D4]"></div>
              <span>Under Inspection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#4fbf8b]"></div>
              <span>Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#c40477ff]"></div>
              <span>Non-Compliant</span>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-b-2xl shadow-md overflow-hidden">
          {validGenerators.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-4">
                  No generators with valid locations found
                </p>
                <button
                  onClick={() => navigate("/admin/register-generator")}
                  className="px-6 py-2 text-white rounded-lg bg-primary hover:scale-103 active:scale-95 transition"
                >
                  Register Your First Generator
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[calc(100vh-250px)] min-h-[500px]">
              <MapContainer
                center={[9.082, 8.6753]} // Nigeria center
                zoom={6}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {Array.from(groupedGenerators.entries()).map(([key, gens]) => {
                  const [latitude, longitude] = key.split(",").map(Number);
                  const representativeGen = gens[0]; // Use first generator for status
                  const count = gens.length;

                  return (
                    <Marker
                      key={key}
                      position={[latitude, longitude]}
                      icon={createMarkerIcon(representativeGen.status, count)}
                      eventHandlers={{
                        click: () => {
                          if (gens.length === 1) {
                            setSelectedGenerator(gens[0]);
                            setIsModalOpen(true);
                          } else {
                            setSelectedGenerator(gens[0]); // Select first generator
                            setIsModalOpen(true);
                          }
                        },
                      }}
                    />
                  );
                })}

                <FitBounds generators={validGenerators} />
              </MapContainer>
            </div>
          )}
        </div>

        {/* Custom Modal for Generator Details */}
        {selectedGenerator && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedGenerator(null);
            }}
            title={`${selectedGenerator.brand} ${selectedGenerator.model}`}
          >
            <div className="p-6 w-[90vw] md:w-[400px]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <p className="text-sm text-gray-600">{selectedGenerator.capacity} KVA</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number
                  </label>
                  <p className="text-sm text-gray-600">{selectedGenerator.serialNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel Type
                  </label>
                  <p className="text-sm text-gray-600 capitalize">{selectedGenerator.fuelType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Manufacture
                  </label>
                  <p className="text-sm text-gray-600">{selectedGenerator.yearOfManufacture}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <p
                    className={`text-sm capitalize px-2 py-0.5 rounded inline-block ${
                      normalizeStatus(selectedGenerator.status) === "active"
                        ? "bg-[#875CF5] text-white"
                        : normalizeStatus(selectedGenerator.status) === "inactive"
                        ? "bg-[#FA2C37] text-white"
                        : normalizeStatus(selectedGenerator.status) === "underinspection"
                        ? "bg-[#06B6D4] text-white"
                        : normalizeStatus(selectedGenerator.status) === "compliant"
                        ? "bg-[#4fbf8b] text-white"
                        : normalizeStatus(selectedGenerator.status) === "noncompliant"
                        ? "bg-[#c40477ff] text-white"
                        : "bg-[#6B7280] text-white"
                    }`}
                  >
                    {selectedGenerator.status?.replace("_", " ") || "Unknown"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <p className="text-sm text-gray-600">{selectedGenerator.location.address}</p>
                  <p className="text-sm text-gray-600">
                    {selectedGenerator.location.lga}, {selectedGenerator.location.state}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(selectedGenerator._id)}
                    className="flex-1 bg-primary text-white py-2 rounded-lg hover:opacity-90 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyGeneratorsMapView;