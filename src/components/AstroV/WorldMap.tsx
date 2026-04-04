import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair } from 'lucide-react';
import { useSimulation } from '../../contexts/SimulationContext';

export default function WorldMap() {
  const {
    impactLocation,
    setImpactLocation,
    params,
    results,
    simulationPhase,
  } = useSimulation();

  const locationType = params.locationType;
  const affectedRadius = results?.affectedAreaRadius ?? 0;
  const fireballRadius = results?.fireball ?? 0;
  const thermalRadius = results?.thermalRadiation ?? 0;

  const handleLocationSelect = (lat: number, lng: number) => {
    setImpactLocation({ lat, lng });
  };

  const handleLocationTypeChange = (type: 'land' | 'water') => {
    // Note: This would need setParams to be added to context if we want to update locationType
    // For now, we'll use the params from context
  };
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{
    circles: L.Circle[];
    marker: L.Marker | null;
  }>({ circles: [], marker: null });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [impactLocation.lat, impactLocation.lng],
      zoom: 4,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      handleLocationSelect(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.circles.forEach(circle => circle.remove());
    if (markersRef.current.marker) {
      markersRef.current.marker.remove();
    }

    // Only add impact visuals if phase is 'impact', 'analyzing' or 'finished'
    if (mapRef.current && (simulationPhase === 'impact' || simulationPhase === 'analyzing' || simulationPhase === 'finished')) {
      if (locationType === 'land') {
        const fireballCircle = L.circle([impactLocation.lat, impactLocation.lng], {
          radius: fireballRadius,
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.5,
          weight: 2,
        }).addTo(mapRef.current);

        const thermalCircle = L.circle([impactLocation.lat, impactLocation.lng], {
          radius: thermalRadius,
          color: '#f97316',
          fillColor: '#f97316',
          fillOpacity: 0.3,
          weight: 2,
        }).addTo(mapRef.current!);

        const affectedCircle = L.circle([impactLocation.lat, impactLocation.lng], {
          radius: affectedRadius * 1000,
          color: '#eab308',
          fillColor: '#eab308',
          fillOpacity: 0.15,
          weight: 2,
        }).addTo(mapRef.current!);

        markersRef.current.circles = [fireballCircle, thermalCircle, affectedCircle];
      } else { // water
        const tsunamiCircles = Array.from({ length: 3 }).map((_, i) =>
          L.circle([impactLocation.lat, impactLocation.lng], {
            radius: (affectedRadius * 1000) * (1 + i * 0.5),
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            dashArray: '5, 10',
            weight: 2,
          }).addTo(mapRef.current!)
        );
        markersRef.current.circles = tsunamiCircles;
      }

      const customIcon = L.divIcon({
        html: `<div style="color: #ef4444; filter: drop-shadow(0 0 4px rgba(0,0,0,0.8));">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([impactLocation.lat, impactLocation.lng], {
        icon: customIcon,
      })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div style="font-family: sans-serif;">
            <strong>Impact Site</strong><br/>
            Lat: ${impactLocation.lat.toFixed(4)}<br/>
            Lng: ${impactLocation.lng.toFixed(4)}
          </div>
        `);
      markersRef.current.marker = marker;
    }

    mapRef.current.setView([impactLocation.lat, impactLocation.lng], mapRef.current.getZoom());
  }, [impactLocation, affectedRadius, fireballRadius, thermalRadius, locationType, simulationPhase]);

  return (
    <div className="relative w-full h-full group overflow-hidden">
      <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden z-0" />

      <div className="absolute bottom-4 left-4 z-20 flex gap-2">
        <div className="flex bg-gray-900/90 backdrop-blur-md p-1 rounded-xl border border-white/5">
          {(['land', 'water'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleLocationTypeChange(type)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                locationType === type 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-gray-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl max-w-xs border border-white/10 z-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Crosshair size={20} className="text-blue-400" />
          </div>
          <h3 className="font-bold text-lg">Target Selection</h3>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Latitude:</span>
            <span className="font-mono text-white">{impactLocation.lat.toFixed(4)}°</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Longitude:</span>
            <span className="font-mono text-white">{impactLocation.lng.toFixed(4)}°</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Type:</span>
            <span className={`font-bold uppercase ${locationType === 'land' ? 'text-orange-400' : 'text-blue-400'}`}>
              {locationType}
            </span>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-3 mb-4">
          <p className="text-xs text-blue-300 leading-relaxed">
            Click anywhere on the map to set impact coordinates. Toggle between land and water impact scenarios.
          </p>
        </div>

        {(simulationPhase === 'impact' || simulationPhase === 'analyzing' || simulationPhase === 'finished') && (
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-300">Fireball: {(fireballRadius / 1000).toFixed(1)} km</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-gray-300">Thermal: {(thermalRadius / 1000).toFixed(1)} km</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-gray-300">Affected: {affectedRadius.toFixed(1)} km</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
