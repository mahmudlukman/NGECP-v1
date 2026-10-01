import React, { useEffect, useState, useRef } from "react";
import naijaStates from "naija-state-local-government";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import toast from "react-hot-toast";
import { Search, Navigation, Info, CheckCircle, Loader2 } from "lucide-react";

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

// Fix standard Leaflet default marker icons issue in React
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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
    initialLocation?.state || "",
  );
  const [selectedLGA, setSelectedLGA] = useState(initialLocation?.lga || "");
  const [address, setAddress] = useState(initialLocation?.address || "");
  const [coordinates, setCoordinates] = useState<[number, number]>([
    initialLocation?.coordinates?.latitude || 9.082,
    initialLocation?.coordinates?.longitude || 8.6753,
  ]);
  const [zoom, setZoom] = useState(
    initialLocation?.coordinates?.latitude ? 15 : 6,
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [locationFound, setLocationFound] = useState(
    !!initialLocation?.coordinates?.latitude,
  );

  // Sync initial location changes
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

  // Prevent redundant trigger loop to parent
  const prevLocationRef = useRef({
    state: "",
    lga: "",
    address: "",
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
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

    setIsSearching(true);
    const query = address
      ? `${address}, ${selectedLGA}, ${selectedState}, Nigeria`
      : `${selectedLGA}, ${selectedState}, Nigeria`;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query,
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
        toast.success("Location pinned on map!");
      } else {
        toast.error(
          "Address not found automatically. Drag the marker or click on the map to set location manually.",
        );
        setLocationFound(false);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error("Failed to connect to location service.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoordinates([lat, lng]);
        setZoom(16);
        setLocationFound(true);
        setIsLocatingUser(false);
        toast.success("Current location captured!");
      },
      (err) => {
        console.error("GPS error:", err);
        toast.error("Unable to access current device GPS position.");
        setIsLocatingUser(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleMarkerDrag = (newPos: [number, number]) => {
    setCoordinates(newPos);
    setLocationFound(true);
  };

  const handleMapClick = (newPos: [number, number]) => {
    setCoordinates(newPos);
    setLocationFound(true);
    if (zoom < 13) setZoom(15);
  };

  return (
    <div className="space-y-5 font-[Figtree,ui-sans-serif,system-ui,sans-serif]">
      {/* Location Input Controls */}
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#0B1F1A]/10 bg-[#F7F6F1] p-4 md:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#0B1F1A]/70">
            State <span className="text-rose-500">*</span>
          </label>
          <select
            className="w-full rounded-xl border border-[#0B1F1A]/15 bg-white p-2.5 text-sm text-[#0B1F1A] outline-none transition-all focus:border-[#16785A] focus:ring-2 focus:ring-[#16785A]/20"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedLGA("");
            }}
          >
            <option value="">Select State</option>
            {naijaStates.states().map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#0B1F1A]/70">
            LGA <span className="text-rose-500">*</span>
          </label>
          <select
            className="w-full rounded-xl border border-[#0B1F1A]/15 bg-white p-2.5 text-sm text-[#0B1F1A] outline-none transition-all focus:border-[#16785A] focus:ring-2 focus:ring-[#16785A]/20 disabled:bg-[#0B1F1A]/[0.04] disabled:text-[#0B1F1A]/35"
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
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#0B1F1A]/70">
            Street Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Plot 12, Commercial Layout"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-[#0B1F1A]/15 bg-white p-2.5 text-sm text-[#0B1F1A] outline-none transition-all placeholder:text-[#0B1F1A]/35 focus:border-[#16785A] focus:ring-2 focus:ring-[#16785A]/20"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleGetCoordinates}
          disabled={!selectedState || !selectedLGA || isSearching}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0B1F1A] px-4 py-2.5 text-xs font-semibold text-[#F3F1EA] shadow-sm transition-all hover:bg-[#12332b] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:text-sm"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span>Search Map Location</span>
        </button>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLocatingUser}
          className="inline-flex items-center gap-2 rounded-xl border border-[#16785A]/20 bg-[#16785A]/[0.08] px-4 py-2.5 text-xs font-semibold text-[#16785A] shadow-sm transition-all hover:bg-[#16785A]/[0.14] active:scale-[0.98] disabled:opacity-50 sm:text-sm"
        >
          {isLocatingUser ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          <span>Use Current GPS Location</span>
        </button>
      </div>

      {/* Helper Callout Box */}
      <div className="flex items-start gap-3 rounded-xl border border-[#16785A]/20 bg-[#16785A]/[0.06] p-3.5 text-xs text-[#0B1F1A]/75 sm:text-sm">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#16785A]" />
        <p className="leading-relaxed">
          <span className="font-bold text-[#0B1F1A]">
            Tips for positioning:
          </span>{" "}
          Drag the red pin or tap directly on the map to fine-tune the exact
          generator placement coordinates.
        </p>
      </div>

      {/* Map Display Container */}
      <div className="relative z-0 h-80 w-full overflow-hidden rounded-2xl border border-[#0B1F1A]/10 shadow-md sm:h-96">
        <MapContainer
          center={coordinates}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <DraggableMarker
            position={coordinates}
            onPositionChange={handleMarkerDrag}
          />
          <MapClickHandler onMapClick={handleMapClick} />
          <ChangeMapView coords={coordinates} zoom={zoom} />
        </MapContainer>

        {/* Live Coordinate Badge Overlay */}
        {locationFound && (
          <div className="absolute bottom-3 left-3 z-[400] flex items-center gap-2 rounded-xl border border-white/10 bg-[#0B1F1A]/90 px-3.5 py-2 font-mono text-xs text-[#F3F1EA] shadow-lg backdrop-blur-md">
            <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-[#7FD1AE]" />
            <span>
              Lat: {coordinates[0].toFixed(5)}, Lng: {coordinates[1].toFixed(5)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratorLocationSelector;
