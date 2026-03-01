
import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import mapsData from '../data/maps.json';
import { MapData } from '../types';

export const MapSelector: React.FC = () => {
  const { setMap } = useStore();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold uppercase tracking-tighter">Select Map</h1>
        <p className="text-slate-400">Choose a battleground to analyze</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {mapsData.map((map: any) => (
          <motion.button
            key={map.uuid}
            variants={item}
            onClick={() => setMap(map as MapData)}
            className="group relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-slate-900 hover:border-red-500/50 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent z-10" />
            <img 
              src={map.splash} 
              alt={map.displayName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 p-4 z-20 w-full text-left">
              <h3 className="text-2xl font-bold uppercase tracking-wide text-white group-hover:text-red-500 transition-colors">
                {map.displayName}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {map.coordinates}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};
