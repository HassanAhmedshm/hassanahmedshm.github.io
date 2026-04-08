import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, ChevronUp, ChevronDown, Hand } from 'lucide-react';
import { useSimulation } from '../../contexts/SimulationContext';

export default function WorldMap() {
  const {
    impactLocation,
    setImpactLocation,
    params,
    results,
    simulationPhase,
  } = useSimulation();

  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const [mapInteractionEnabled, setMapInteractionEnabled] = useState(false);

  const locationType = params.locationType;
  const affectedRadius = results?.affectedAreaRadius ?? 0;
  const fireballRadius = results?.fireball ?? 0;
  const thermalRadius = results?.thermalRadiation ?? 0;

  const handleLocationSelect = (lat: number, lng: number) => {
    setImpactLocation({ lat, lng });
  };

  const handleLocationTypeChange = (_type: 'land' | 'water') => {
    // Note: This would need setParams to be added to context if we want to update locationType
    // For now, we'll use the params from context
  };
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{
    circles: L.Circle[];
    marker: L.Marker | null;
  }>({ circles: [], marker: null });

  // Check if mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [impactLocation.lat, impactLocation.lng],
      zoom: 4,
      zoomControl: true,
      dragging: !isMobile || mapInteractionEnabled,
      scrollWheelZoom: !isMobile || mapInteractionEnabled,
      touchZoom: !isMobile || mapInteractionEnabled,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (!isMobile || mapInteractionEnabled) {
        handleLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map interaction state
  useEffect(() => {
    if (!mapRef.current) return;
    
    if (isMobile) {
      if (mapInteractionEnabled) {
        mapRef.current.dragging.enable();
        mapRef.current.touchZoom.enable();
        mapRef.current.scrollWheelZoom.enable();
      } else {
        mapRef.current.dragging.disable();
        mapRef.current.touchZoom.disable();
        mapRef.current.scrollWheelZoom.disable();
      }
    }
  }, [mapInteractionEnabled, isMobile]);

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

      {/* Mobile: Tap to interact overlay */}
      {isMobile && !mapInteractionEnabled && (
        <button
          onClick={() => setMapInteractionEnabled(true)}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[1px]"
        >
          <div className="bg-gray-900/95 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 flex items-center gap-3">
            <Hand size={24} className="text-blue-400" />
            <span className="text-white font-medium">Tap to interact with map</span>
          </div>
        </button>
      )}

      {/* Mobile: Lock map button when interaction is enabled */}
      {isMobile && mapInteractionEnabled && (
        <button
          onClick={() => setMapInteractionEnabled(false)}
          className="absolute top-4 left-4 z-20 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Hand size={14} />
          Lock Map
        </button>
      )}

      <div className="absolute bottom-4 left-4 z-20 flex gap-2">
        <div className="flex bg-gray-900/90 backdrop-blur-md p-1 rounded-xl border border-white/5">
          {(['land', 'water'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleLocationTypeChange(type)}
              className={`px-3 md:px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
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

      {/* Target Selection Panel - Collapsible on mobile */}
      <div className={`absolute top-4 right-4 bg-gray-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/10 z-20 transition-all ${
        isPanelExpanded ? 'max-w-xs' : 'max-w-[200px]'
      }`}>
        <button 
          onClick={() => setIsPanelExpanded(!isPanelExpanded)}
          className="w-full flex items-center justify-between gap-3 p-4 md:p-5 md:cursor-default"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 md:p-2 bg-blue-600/20 rounded-lg">
              <Crosshair size={16} className="md:w-5 md:h-5 text-blue-400" />
            </div>
            <h3 className="font-bold text-sm md:text-lg">Target Selection</h3>
          </div>
          <div className="md:hidden">
            {isPanelExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>
        
        <div className={`overflow-hidden transition-all ${isPanelExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 md:max-h-[500px] md:opacity-100'}`}>
          <div className="px-4 md:px-5 pb-4 md:pb-5 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-400">Latitude:</span>
                <span className="font-mono text-white">{impactLocation.lat.toFixed(4)}°</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-400">Longitude:</span>
                <span className="font-mono text-white">{impactLocation.lng.toFixed(4)}°</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-400">Type:</span>
                <span className={`font-bold uppercase ${locationType === 'land' ? 'text-orange-400' : 'text-blue-400'}`}>
                  {locationType}
                </span>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-2.5 md:p-3">
              <p className="text-[10px] md:text-xs text-blue-300 leading-relaxed">
                {isMobile ? 'Tap the map to set impact coordinates.' : 'Click anywhere on the map to set impact coordinates. Toggle between land and water impact scenarios.'}
              </p>
            </div>

            {(simulationPhase === 'impact' || simulationPhase === 'analyzing' || simulationPhase === 'finished') && (
              <div className="space-y-1.5 md:space-y-2 text-[10px] md:text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500" />
                  <span className="text-gray-300">Fireball: {(fireballRadius / 1000).toFixed(1)} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-orange-500" />
                  <span className="text-gray-300">Thermal: {(thermalRadius / 1000).toFixed(1)} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500" />
                  <span className="text-gray-300">Affected: {affectedRadius.toFixed(1)} km</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
