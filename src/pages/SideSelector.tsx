
import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Sword, Shield } from 'lucide-react';
import { clsx } from 'clsx';

export const SideSelector: React.FC = () => {
  const { setSide, selectedAgent } = useStore();

  if (!selectedAgent) return <div>Please select an agent first.</div>;

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold uppercase tracking-tighter">Choose Side</h1>
        <p className="text-slate-400">Are you attacking or defending?</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl px-4">
        {/* Attack Button */}
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setSide('Attack')}
          className="group flex-1 bg-slate-900/50 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center space-y-6 hover:bg-red-500/10 hover:border-red-500 transition-all duration-300"
        >
          <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors text-slate-400">
            <Sword size={48} />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold uppercase tracking-widest group-hover:text-red-500 transition-colors">Attack</h2>
            <p className="text-slate-500 mt-2">Execute site takes and plant the spike</p>
          </div>
        </motion.button>

        {/* Defence Button */}
        <motion.button
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setSide('Defence')}
          className="group flex-1 bg-slate-900/50 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center space-y-6 hover:bg-cyan-500/10 hover:border-cyan-500 transition-all duration-300"
        >
          <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-colors text-slate-400">
            <Shield size={48} />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold uppercase tracking-widest group-hover:text-cyan-500 transition-colors">Defence</h2>
            <p className="text-slate-500 mt-2">Hold sites and defuse the spike</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
};
