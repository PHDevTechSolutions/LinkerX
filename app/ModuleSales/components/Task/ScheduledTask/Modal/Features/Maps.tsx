import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useMapEvent } from "react-leaflet";

// Dynamic imports for Next.js SSR compatibility
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

interface MapsProps {
  location: { lat: number; lng: number };
  locationAddress: string;
  setLocation: (coords: { lat: number; lng: number }) => void;
  setActivityRemarks: (remarks: string) => void;
  setLocationAddress: (address: string) => void;
  multipleLocations?: { lat: number; lng: number }[];
  setMultipleLocations?: (locs: { lat: number; lng: number }[]) => void;
}

// Helper component to capture the map instance
const SetMapRef: React.FC<{ mapRef: React.MutableRefObject<any> }> = ({
  mapRef,
}) => {
  useMapEvent("load", (event) => {
    if (!mapRef.current) {
      mapRef.current = event.target;
    }
  });
  return null;
};

const Maps: React.FC<MapsProps> = ({
  location,
  locationAddress,
  setLocation,
  setActivityRemarks,
  setLocationAddress,
  multipleLocations = [],
  setMultipleLocations,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [loadingTiles, setLoadingTiles] = useState(true);
  const [customIcon, setCustomIcon] = useState<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);

    // Dynamically import leaflet here so no SSR issues
    import("leaflet").then((L) => {
      const icon = new L.Icon({
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setCustomIcon(icon);
    });
  }, []);

  const handleTileLoad = () => {
    setLoadingTiles(false);
  };

  if (!isMounted || !location.lat || !location.lng || !customIcon) return null;

  return (
    <div
      className="rounded overflow-hidden border mt-2"
      style={{ height: 300, width: "100%" }}
    >
      {loadingTiles && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10"></div>
          <style>{`
            .loader {
              border-top-color: #3498db;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg);}
              100% { transform: rotate(360deg);}
            }
          `}</style>
        </div>
      )}

      <MapContainer
        center={[location.lat, location.lng]}
        zoom={17}
        style={{ height: "100%", width: "100%" }}
        dragging={false}
        touchZoom={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        keyboard={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          eventHandlers={{ load: handleTileLoad }}
        />

        <SetMapRef mapRef={mapRef} />

        {!setMultipleLocations && (
          <Marker position={[location.lat, location.lng]} icon={customIcon} draggable={false}>
            <Popup>
              {locationAddress ? (
                <>
                  <strong>Current Address:</strong>
                  <br />
                  {locationAddress}
                </>
              ) : (
                `${location.lat}, ${location.lng}`
              )}
            </Popup>
          </Marker>
        )}

        {setMultipleLocations &&
          multipleLocations.map((loc, i) => (
            <Marker
              key={`marker-${i}`}
              position={[loc.lat, loc.lng]}
              icon={customIcon}
              draggable={false}
            >
              <Popup>
                Marker {i + 1}: {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
              </Popup>
            </Marker>
          ))}

        {setMultipleLocations && multipleLocations.length > 1 && (
          <Polyline positions={multipleLocations} color="blue" />
        )}
      </MapContainer>
    </div>
  );
};

export default Maps;
