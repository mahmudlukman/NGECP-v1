import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useGetAllGeneratorsQuery } from "../../redux/features/generator/generatorApi";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Modal from "../../components/Modal";

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

// Status color mapping — ink/mint brand palette, with amber and rose
// kept for "in progress" and "non-compliant" states respectively.
const statusColors: Record<string, string> = {
  active: "#16785A", // Mint (brand accent)
  inactive: "#9CA3AF", // Neutral grey
  underinspection: "#F59E0B", // Amber
  compliant: "#7FD1AE", // Light mint
  noncompliant: "#E11D48", // Rose
  unknown: "#64748B", // Slate (fallback)
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
        .filter(
          (gen) =>
            gen.location?.coordinates?.latitude &&
            gen.location?.coordinates?.longitude,
        )
        .map(
          (gen) =>
            [
              gen.location.coordinates!.latitude,
              gen.location.coordinates!.longitude,
            ] as [number, number],
        );

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [generators, map]);

  return null;
}

const GeneratorsMapView = () => {
  const navigate = useNavigate();
  const [page] = useState(1);
  const [pageSize] = useState(1000); // Load all generators for map
  const [selectedGenerator, setSelectedGenerator] = useState<Generator | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useGetAllGeneratorsQuery({
    page,
    pageSize,
  });

  const generators: Generator[] = useMemo(() => {
    return data?.generators || [];
  }, [data?.generators]);

  // Group generators by coordinates to count multiple generators at the same location
  const groupedGenerators = useMemo(() => {
    const map = new Map<string, Generator[]>();
    generators.forEach((gen) => {
      if (
        gen.location?.coordinates?.latitude &&
        gen.location?.coordinates?.longitude
      ) {
        const key = `${gen.location.coordinates.latitude},${gen.location.coordinates.longitude}`;
        const existing = map.get(key) || [];
        map.set(key, [...existing, gen]);
      }
    });
    return map;
  }, [generators]);

  const handleViewDetails = (generatorId: string) => {
    navigate(`/admin/generator/${generatorId}`);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="my-5 rounded-2xl bg-white p-6 shadow-md">
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#16785A]" />
              <p className="text-[#0B1F1A]/55">Loading generators map...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <p className="text-rose-600">Failed to load generators.</p>
        </div>
      </DashboardLayout>
    );
  }

  const validGenerators = generators.filter(
    (gen) =>
      gen.location?.coordinates?.latitude &&
      gen.location?.coordinates?.longitude &&
      gen.location.coordinates.latitude !== 0 &&
      gen.location.coordinates.longitude !== 0,
  );

  return (
    <DashboardLayout>
      <div className="my-5 font-[Figtree,ui-sans-serif,system-ui,sans-serif]">
        {/* Header */}
        <div className="rounded-t-2xl border-b border-[#0B1F1A]/10 bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-[Newsreader,Georgia,serif] text-2xl font-normal text-[#0B1F1A]/70">
                Generators{" "}
                <span className="font-medium text-[#0B1F1A]">Map View</span>
              </h1>
              <p className="mt-1 text-sm text-[#0B1F1A]/50">
                Showing {validGenerators.length} of {generators.length}{" "}
                generators with valid locations
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/admin/manage-generators")}
                className="rounded-lg bg-[#0B1F1A]/[0.04] px-4 py-2 text-[#0B1F1A]/75 transition hover:scale-[1.03] hover:bg-[#0B1F1A]/[0.08] active:scale-95"
              >
                List View
              </button>
              <button
                onClick={() => navigate("/admin/register-generator")}
                className="rounded-lg bg-[#0B1F1A] px-4 py-2 text-[#F3F1EA] transition hover:scale-[1.03] hover:bg-[#12332b] active:scale-95"
              >
                + Add Generator
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#0B1F1A]/70">
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: statusColors.active }}
              />
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: statusColors.inactive }}
              />
              <span>Inactive</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: statusColors.underinspection }}
              />
              <span>Under Inspection</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: statusColors.compliant }}
              />
              <span>Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: statusColors.noncompliant }}
              />
              <span>Non-Compliant</span>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="overflow-hidden rounded-b-2xl bg-white shadow-md">
          {validGenerators.length === 0 ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <p className="mb-4 text-lg text-[#0B1F1A]/60">
                  No generators with valid locations found
                </p>
                <button
                  onClick={() => navigate("/admin/register-generator")}
                  className="rounded-lg bg-[#0B1F1A] px-6 py-2 text-[#F3F1EA] transition hover:scale-[1.03] active:scale-95"
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
            <div className="w-[90vw] p-6 md:w-[400px]">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0B1F1A]/70">
                    Capacity
                  </label>
                  <p className="text-sm text-[#0B1F1A]/60">
                    {selectedGenerator.capacity} KVA
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0B1F1A]/70">
                    Serial Number
                  </label>
                  <p className="text-sm text-[#0B1F1A]/60">
                    {selectedGenerator.serialNumber}
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0B1F1A]/70">
                    Fuel Type
                  </label>
                  <p className="text-sm capitalize text-[#0B1F1A]/60">
                    {selectedGenerator.fuelType}
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0B1F1A]/70">
                    Year of Manufacture
                  </label>
                  <p className="text-sm text-[#0B1F1A]/60">
                    {selectedGenerator.yearOfManufacture}
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0B1F1A]/70">
                    Status
                  </label>
                  <p
                    className="inline-block rounded px-2 py-0.5 text-sm capitalize text-white"
                    style={{
                      backgroundColor:
                        statusColors[
                          normalizeStatus(selectedGenerator.status)
                        ] || statusColors.unknown,
                    }}
                  >
                    {selectedGenerator.status?.replace("_", " ") || "Unknown"}
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0B1F1A]/70">
                    Location
                  </label>
                  <p className="text-sm text-[#0B1F1A]/60">
                    {selectedGenerator.location.address}
                  </p>
                  <p className="text-sm text-[#0B1F1A]/60">
                    {selectedGenerator.location.lga},{" "}
                    {selectedGenerator.location.state}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(selectedGenerator._id)}
                    className="flex-1 rounded-lg bg-[#0B1F1A] py-2 text-[#F3F1EA] transition hover:bg-[#12332b]"
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

export default GeneratorsMapView;
