'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const hazardIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const gemIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface HazardZone {
  id: string;
  name: string;
  hazardType: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  alertMessage: string;
  safeAlternate?: string;
}

export interface DynamicGemItem {
  id: string;
  name: string;
  category?: string;
  latitude: number;
  longitude: number;
  elevation?: string;
  crowdLevel?: string;
  description?: string;
  bestFor?: string;
  distanceKm?: number;
}

export interface HazardMapProps {
  userLocation: { lat: number; lng: number };
  hazardZones: HazardZone[];
  hiddenGems?: DynamicGemItem[];
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export default function HazardMap({ userLocation, hazardZones, hiddenGems = [] }: HazardMapProps) {
  return (
    <div className="h-[520px] w-full rounded-2xl overflow-hidden relative z-0 border border-slate-200 shadow-inner">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />

        {/* Live User Position */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <div className="text-xs font-sans">
              <strong className="text-slate-900 block font-bold">Aapki Live Position</strong>
              <span className="text-slate-600 font-mono">
                {userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E
              </span>
            </div>
          </Popup>
        </Marker>

        {/* Dynamic Hidden Gems Pins */}
        {hiddenGems.map((gem) => (
          <Marker key={gem.id} position={[gem.latitude, gem.longitude]} icon={gemIcon}>
            <Popup>
              <div className="text-xs font-sans space-y-1">
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                  {gem.category || 'SCENIC SPOT'}
                </span>
                <strong className="text-slate-900 block font-bold text-sm">{gem.name}</strong>
                <p className="text-slate-600 text-[11px]">{gem.description}</p>
                {gem.bestFor && (
                  <div className="text-emerald-700 font-semibold text-[11px] pt-1">
                    Best: {gem.bestFor}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Real Hazard Drop Zones */}
        {hazardZones.map((hz) => (
          <React.Fragment key={hz.id}>
            <Marker position={[hz.latitude, hz.longitude]} icon={hazardIcon}>
              <Popup>
                <div className="text-xs font-sans space-y-1">
                  <strong className="text-rose-700 block font-bold uppercase">{hz.hazardType} ALERT</strong>
                  <div className="font-semibold text-slate-900">{hz.name}</div>
                  <p className="text-slate-600 text-[11px]">{hz.alertMessage}</p>
                  {hz.safeAlternate && (
                    <p className="text-emerald-700 text-[10px] font-medium pt-1 border-t border-slate-100">
                      Safe Spot: {hz.safeAlternate}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[hz.latitude, hz.longitude]}
              radius={hz.radiusMeters}
              pathOptions={{
                color: '#E11D48',
                fillColor: '#E11D48',
                fillOpacity: 0.2,
                weight: 2,
              }}
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
}