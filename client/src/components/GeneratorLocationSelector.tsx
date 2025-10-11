import React, { useEffect, useState, useRef} from "react";
import naijaStates from "naija-state-local-government";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import toast from "react-hot-toast";

interface GeneratorLocationSelectorProps {
  onLocationSelect: (location: {
    address: string;
    state: string;
    lga: string;
    coordinates?: { latitude: number; longitude: number };
  }) => void;
  initialLocation?: {
    address: string;
    state: string;
    lga: string;
    coordinates: { latitude: number; longitude: number };
  };
}

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function DraggableMarker({
  position,
  onPositionChange,
}: {
  position: [number, number];
  onPositionChange: (pos: [number, number]) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        onPositionChange([newPos.lat, newPos.lng]);
      }
    },
  };

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={markerIcon}
    />
  );
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function ChangeMapView({
  coords,
  zoom,
}: {
  coords: [number, number];
  zoom: number;
}) {
  const map = useMapEvents({});

  useEffect(() => {
    map.setView(coords, zoom);
  }, [coords, zoom, map]);

  return null;
}

const GeneratorLocationSelector: React.FC<GeneratorLocationSelectorProps> = ({
  onLocationSelect,
  initialLocation,
}) => {
  const [selectedState, setSelectedState] = useState(
    initialLocation?.state || ""
  );
  const [selectedLGA, setSelectedLGA] = useState(initialLocation?.lga || "");
  const [address, setAddress] = useState(initialLocation?.address || "");
  const [coordinates, setCoordinates] = useState<[number, number]>([
    initialLocation?.coordinates?.latitude || 9.082,
    initialLocation?.coordinates?.longitude || 8.6753,
  ]);
  const [zoom, setZoom] = useState(
    initialLocation?.coordinates?.latitude ? 15 : 6
  );
  const [locationFound, setLocationFound] = useState(
    !!initialLocation?.coordinates?.latitude
  );

  // Reset form when initialLocation changes (useful for edit mode)
  useEffect(() => {
    if (initialLocation) {
      setSelectedState(initialLocation.state || "");
      setSelectedLGA(initialLocation.lga || "");
      setAddress(initialLocation.address || "");
      setCoordinates([
        initialLocation.coordinates?.latitude || 9.082,
        initialLocation.coordinates?.longitude || 8.6753,
      ]);
      setZoom(initialLocation.coordinates?.latitude ? 15 : 6);
      setLocationFound(!!initialLocation.coordinates?.latitude);
    }
  }, [initialLocation]);

  // Auto-update parent whenever location data changes
  // Use useRef to prevent infinite loops
  const prevLocationRef = useRef({
    state: "",
    lga: "",
    address: "",
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    // Only update if values actually changed
    const hasChanged =
      prevLocationRef.current.state !== selectedState ||
      prevLocationRef.current.lga !== selectedLGA ||
      prevLocationRef.current.address !== address ||
      prevLocationRef.current.lat !== coordinates[0] ||
      prevLocationRef.current.lng !== coordinates[1];

    if (hasChanged && selectedState && selectedLGA) {
      prevLocationRef.current = {
        state: selectedState,
        lga: selectedLGA,
        address,
        lat: coordinates[0],
        lng: coordinates[1],
      };

      onLocationSelect({
        address,
        state: selectedState,
        lga: selectedLGA,
        coordinates: { latitude: coordinates[0], longitude: coordinates[1] },
      });
    }
  }, [selectedState, selectedLGA, address, coordinates, onLocationSelect]);

  const handleGetCoordinates = async () => {
    if (!selectedState || !selectedLGA) return;

    const query = address
      ? `${address}, ${selectedLGA}, ${selectedState}, Nigeria`
      : `${selectedLGA}, ${selectedState}, Nigeria`;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data && data[0]) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setCoordinates([lat, lon]);
        setZoom(15);
        setLocationFound(true);
      } else {
        toast.error(
          "Location not found. You can click on the map or drag the marker to set your location manually."
        );
        setLocationFound(false);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      toast.error(
        "Failed to fetch location. You can click on the map or drag the marker to set your location manually."
      );
    }
  };

  const handleMarkerDrag = (newPos: [number, number]) => {
    setCoordinates(newPos);
    setLocationFound(true);
  };

  const handleMapClick = (newPos: [number, number]) => {
    setCoordinates(newPos);
    setLocationFound(true);
    if (zoom < 13) {
      setZoom(15);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            State <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedLGA("");
            }}
          >
            <option value="">Select a state</option>
            {naijaStates.states().map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            LGA <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2"
            value={selectedLGA}
            onChange={(e) => setSelectedLGA(e.target.value)}
            disabled={!selectedState}
          >
            <option value="">Select LGA</option>
            {selectedState &&
              naijaStates.lgas(selectedState)?.lgas?.map((lga: string) => (
                <option key={lga} value={lga}>
                  {lga}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Address<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., No. 10, Ado Bayero Road"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleGetCoordinates}
        disabled={!selectedState || !selectedLGA}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Find Location on Map
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <p className="font-semibold mb-1">💡 How to set your location:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Click "Find Location on Map" to auto-detect coordinates</li>
          <li>Drag the marker to adjust the exact position</li>
          <li>Or click anywhere on the map to place the marker</li>
          <li>
            Location updates automatically - just click "Register Generator"
            when done
          </li>
        </ul>
      </div>

      <div className="w-full h-96 rounded-lg overflow-hidden mt-4 shadow border-2 border-gray-300">
        <MapContainer
          center={coordinates}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <DraggableMarker
            position={coordinates}
            onPositionChange={handleMarkerDrag}
          />
          <MapClickHandler onMapClick={handleMapClick} />
          <ChangeMapView coords={coordinates} zoom={zoom} />
        </MapContainer>
      </div>

      {locationFound && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
          <p>
            <span className="font-semibold">✓ Location Set:</span> Lat:{" "}
            {coordinates[0].toFixed(6)}, Lng: {coordinates[1].toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};

export default GeneratorLocationSelector;