
import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import tacticsData from '../data/tactics.json';
import { MapTactics, TacticPosition, TacticUtility } from '../types';
import { motion } from 'framer-motion';
import { Info, MapPin, Zap, Move } from 'lucide-react';
import { clsx } from 'clsx';

export const TacticalMap: React.FC = () => {
  const { selectedMap, selectedAgent, selectedSide } = useStore();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  const tactics = useMemo(() => {
    if (!selectedMap || !selectedSide) return null;
    const mapData = (tacticsData as any)[selectedMap.displayName];
    return mapData?.tactics?.[selectedSide] as MapTactics | undefined;
  }, [selectedMap, selectedSide]);

  if (!selectedMap || !selectedAgent || !selectedSide) {
    return <div>Missing selection data.</div>;
  }

  // Handle simple zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = Math.min(Math.max(scale - e.deltaY * 0.001, 1), 3);
    setScale(newScale);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 overflow-hidden">
      {/* Map View */}
      <div className="flex-grow bg-slate-900 border border-white/10 rounded-lg overflow-hidden relative group">
        <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur px-3 py-1 rounded text-xs text-slate-300 pointer-events-none">
          Scroll to Zoom • Drag to Pan (Coming Soon)
        </div>

        <div 
          className="w-full h-full relative flex items-center justify-center overflow-hidden cursor-move"
          onWheel={handleWheel}
        >
          <motion.div
            style={{ scale }}
            className="relative aspect-square h-full max-h-full"
          >
            {/* Map Image */}
            <img 
              src={selectedMap.displayIcon} 
              alt={selectedMap.displayName} 
              className="w-full h-full object-contain opacity-80"
            />

            {/* Tactical Overlays */}
            {tactics && (
              <>
                {/* Spawn */}
                {tactics.spawnPosition && (
                  <div 
                    className="absolute w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-125 transition-transform"
                    style={{ left: `${tactics.spawnPosition.x}%`, top: `${tactics.spawnPosition.y}%` }}
                    onClick={() => setSelectedMarker({ type: 'Spawn', ...tactics.spawnPosition })}
                  >
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-bold bg-black/70 px-2 py-0.5 rounded">
                      Spawn
                    </div>
                  </div>
                )}

                {/* Key Positions */}
                {tactics.keyPositions?.map((pos, idx) => (
                  <div 
                    key={idx}
                    className="absolute w-5 h-5 bg-blue-500 rotate-45 border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-125 transition-transform"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    onClick={() => setSelectedMarker({ type: 'Position', ...pos })}
                  >
                     <MapPin size={12} className="text-white -rotate-45 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                ))}

                {/* Utility Spots */}
                {tactics.utility?.map((util, idx) => (
                  <div 
                    key={idx}
                    className="absolute w-5 h-5 bg-yellow-500 rounded-sm border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-125 transition-transform flex items-center justify-center"
                    style={{ left: `${util.x}%`, top: `${util.y}%` }}
                    onClick={() => setSelectedMarker({ type: 'Utility', ...util })}
                  >
                    <Zap size={12} className="text-black" />
                  </div>
                ))}

                {/* Paths (SVG Overlay) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {tactics.paths?.map((path, idx) => (
                    <g key={idx}>
                      <polyline
                        points={path.points.map(p => `${p.x}%,${p.y}%`).join(' ')} // Note: SVG points usually need absolute pixels, but percentages might work in some browsers or need conversion. For standard SVG in HTML, points need coords.
                        // Wait, polyline points attribute doesn't accept percentages directly in standard SVG usually. 
                        // I need to map 0-100 to 0-100 viewbox coordinates.
                      />
                      {/* Let's use path d attribute instead for better control */}
                      <path
                         d={`M ${path.points.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                         fill="none"
                         stroke={selectedSide === 'Attack' ? '#ef4444' : '#06b6d4'}
                         strokeWidth="1"
                         strokeDasharray="4 2"
                         vectorEffect="non-scaling-stroke" // Keeps line width constant on zoom if applied to parent
                         // Note: The viewBox of the svg should be "0 0 100 100" for these coords to work
                      />
                      {/* Arrowhead at the end */}
                      <circle 
                        cx={path.points[path.points.length-1].x} 
                        cy={path.points[path.points.length-1].y} 
                        r="1.5" 
                        fill={selectedSide === 'Attack' ? '#ef4444' : '#06b6d4'} 
                      />
                    </g>
                  ))}
                </svg>
              </>
            )}
            
            {/* SVG Container for paths with viewBox 0-100 for easy percentage mapping */}
            {tactics && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {tactics.paths?.map((path, idx) => (
                        <path
                            key={idx}
                            d={`M ${path.points.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                            fill="none"
                            stroke={selectedSide === 'Attack' ? '#ef4444' : '#06b6d4'}
                            strokeWidth="0.5"
                            strokeDasharray="1 1"
                            className="drop-shadow-md"
                        />
                    ))}
                </svg>
            )}

          </motion.div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="w-full lg:w-96 bg-slate-900 border border-white/10 rounded-lg p-6 flex flex-col space-y-6 overflow-y-auto">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold uppercase tracking-wide mb-1">{selectedMap.displayName}</h2>
          <div className="flex items-center space-x-2 text-sm">
             <span className={clsx("font-bold px-2 py-0.5 rounded", selectedSide === 'Attack' ? "bg-red-500/20 text-red-500" : "bg-cyan-500/20 text-cyan-500")}>
               {selectedSide}
             </span>
             <span className="text-slate-400">•</span>
             <span className="text-slate-300 flex items-center gap-1">
               <img src={selectedAgent.displayIcon} className="w-4 h-4 rounded-full" />
               {selectedAgent.displayName}
             </span>
          </div>
        </div>

        {tactics ? (
          <>
             {/* Dynamic Selection Info */}
             <div className="bg-slate-950/50 rounded-lg p-4 min-h-[100px] border border-white/5">
                {selectedMarker ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 mb-2 text-sm text-slate-400 uppercase tracking-wider font-bold">
                       {selectedMarker.type === 'Utility' && <Zap size={14} />}
                       {selectedMarker.type === 'Position' && <MapPin size={14} />}
                       {selectedMarker.type === 'Spawn' && <Move size={14} />}
                       {selectedMarker.type}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{selectedMarker.label || selectedMarker.agent}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedMarker.description}</p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                    <Info size={24} className="mb-2 opacity-50" />
                    <p className="text-sm">Click on map markers to view details</p>
                  </div>
                )}
             </div>

             {/* General Tips */}
             <div className="space-y-3">
               <h3 className="font-bold text-slate-200 uppercase tracking-wide text-sm">Tactical Tips</h3>
               <ul className="space-y-2">
                 {tactics.tips?.map((tip, idx) => (
                   <li key={idx} className="text-sm text-slate-400 flex gap-2 items-start">
                     <span className="text-red-500 mt-1">•</span>
                     <span>{tip}</span>
                   </li>
                 ))}
               </ul>
             </div>

             {/* Summary */}
             <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded text-sm text-blue-200">
               <p>{tactics.summary}</p>
             </div>
          </>
        ) : (
          <div className="text-center py-10 text-slate-500">
            <p>No tactical data available for this configuration yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
