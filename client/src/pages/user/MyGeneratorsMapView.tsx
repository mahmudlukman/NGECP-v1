import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useGetMyGeneratorsQuery } from "../../redux/features/generator/generatorApi";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import toast from "react-hot-toast";

// Define Generator type
interface Generator {
  _id: string;
  brand: string;
  model: string;
  serialNumber: string;
  capacity: number;
  yearOfManufacture: number;
  fuelType: string;
  status?: string;
  location: {
    address: string;
    state: string;
    lga: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
}

// Custom marker icons based on status
const createMarkerIcon = (status?: string) => {
  const color =
    status === "active" ? "green" : status === "inactive" ? "red" : "blue";

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

// Component to fit map bounds to all markers
function FitBounds({ generators }: { generators: Generator[] }) {
  const map = useMap();

  useEffect(() => {
    if (generators.length > 0) {
      const bounds = generators
        .filter((gen) => gen.location?.coordinates?.latitude)
        .map(
          (gen) =>
            [
              gen.location.coordinates.latitude,
              gen.location.coordinates.longitude,
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
  const [selectedGenerator, setSelectedGenerator] = useState<Generator | null>(
    null
  );

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

  const handleViewDetails = (generatorId: string) => {
    navigate(`/admin/generator-details/${generatorId}`);
  };

   const handleEditGenerator = (generatorId: string) => {
    navigate(`/user/update-generator/${generatorId}`);
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
                onClick={() => navigate("/user/generators")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 hover:scale-103 active:scale-95 transition"
              >
                List View
              </button>
              <button
                onClick={() => navigate("/user/register-generator")}
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

                {validGenerators.map((generator) => (
                  <Marker
                    key={generator._id}
                    position={[
                      generator.location.coordinates.latitude,
                      generator.location.coordinates.longitude,
                    ]}
                    icon={createMarkerIcon(generator.status)}
                    eventHandlers={{
                      click: () => setSelectedGenerator(generator),
                    }}
                  >
                    <Popup>
                      <div className="p-2 min-w-[250px] z-index-10">
                        <h3 className="font-bold text-lg mb-2 text-gray-800">
                          {generator.brand} {generator.model}
                        </h3>

                        <div className="space-y-1 text-sm mb-3">
                          <p>
                            <span className="font-semibold">Capacity:</span>{" "}
                            {generator.capacity} KVA
                          </p>
                          <p>
                            <span className="font-semibold">Serial:</span>{" "}
                            {generator.serialNumber}
                          </p>
                          <p>
                            <span className="font-semibold">Fuel:</span>{" "}
                            <span className="capitalize">
                              {generator.fuelType}
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold">Year:</span>{" "}
                            {generator.yearOfManufacture}
                          </p>
                          <p>
                            <span className="font-semibold">Status:</span>{" "}
                            <span
                              className={`capitalize px-2 py-0.5 rounded text-xs ${
                                generator.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : generator.status === "inactive"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {generator.status || "Unknown"}
                            </span>
                          </p>
                        </div>

                        <div className="border-t pt-2 mb-2">
                          <p className="text-sm">
                            <span className="font-semibold">Location:</span>
                          </p>
                          <p className="text-xs text-gray-600">
                            {generator.location.address}
                          </p>
                          <p className="text-xs text-gray-600">
                            {generator.location.lga}, {generator.location.state}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(generator._id)}
                            className="flex-1 px-3 py-1.5 text-white text-sm rounded bg-primary hover:scale-103 active:scale-95 transition"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleEditGenerator(generator._id)}
                            className="flex-1 px-3 py-1.5 text-white text-sm rounded bg-slate-600 hover:scale-103 active:scale-95 transition"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                <FitBounds generators={validGenerators} />
              </MapContainer>
            </div>
          )}
        </div>

        {/* Selected Generator Info Card (Optional - shows below map) */}
        {selectedGenerator && (
          <div className="mt-4 bg-white p-4 rounded-xl shadow-md border-l-4 border-primary">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {selectedGenerator.brand} {selectedGenerator.model}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedGenerator.location.lga},{" "}
                  {selectedGenerator.location.state}
                </p>
              </div>
              <button
                onClick={() => setSelectedGenerator(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleViewDetails(selectedGenerator._id)}
                className="px-4 py-2 bg-primary hover:scale-103 active:scale-95 transition text-white text-sm rounded-lg"
              >
                View Generator Details
              </button>
              <button
                onClick={() => handleEditGenerator(selectedGenerator._id)}
                className="px-4 py-2 text-white text-sm rounded-lg bg-slate-600 hover:scale-103 active:scale-95 transition"
              >
                Edit Generator
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyGeneratorsMapView;
