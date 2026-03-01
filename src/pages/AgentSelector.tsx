
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import agentsData from '../data/agents.json';
import tacticsData from '../data/tactics.json';
import { AgentData, MapTierList } from '../types';
import { clsx } from 'clsx';

export const AgentSelector: React.FC = () => {
  const { selectedMap, setAgent } = useStore();

  const tierList = useMemo(() => {
    if (!selectedMap) return null;
    const mapTactics = (tacticsData as any)[selectedMap.displayName] as MapTierList | undefined;
    return mapTactics?.tiers || null;
  }, [selectedMap]);

  // Helper to find agent data by name
  const getAgentByName = (name: string) => {
    return agentsData.find(a => a.displayName === name);
  };

  const tiers = ['S', 'A', 'B', 'C'];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  if (!selectedMap) return <div>Please select a map first.</div>;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold uppercase tracking-tighter">Select Agent</h1>
        <p className="text-slate-400">
          Recommended picks for <span className="text-red-500 font-bold">{selectedMap.displayName}</span> (Gold/Silver Meta)
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {tierList ? (
          tiers.map((tier) => {
            const agentsInTier = tierList[tier];
            if (!agentsInTier) return null;

            return (
              <div key={tier} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className={clsx(
                    "w-12 h-12 flex items-center justify-center rounded text-2xl font-bold border-2",
                    tier === 'S' ? "bg-yellow-500/20 border-yellow-500 text-yellow-500" :
                    tier === 'A' ? "bg-red-500/20 border-red-500 text-red-500" :
                    tier === 'B' ? "bg-blue-500/20 border-blue-500 text-blue-400" :
                    "bg-slate-500/20 border-slate-500 text-slate-400"
                  )}>
                    {tier}
                  </div>
                  <div className="h-px bg-white/10 flex-grow" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {agentsInTier.map((tierAgent) => {
                    const agentData = getAgentByName(tierAgent.agentName);
                    if (!agentData) return null;

                    return (
                      <motion.button
                        key={agentData.uuid}
                        variants={item}
                        onClick={() => setAgent(agentData as AgentData)}
                        className="group relative flex flex-col items-center bg-slate-900 border border-white/10 rounded-lg overflow-hidden hover:border-red-500 transition-colors p-4"
                      >
                        <div className="relative w-24 h-24 mb-2">
                          <img 
                            src={agentData.displayIcon} 
                            alt={agentData.displayName}
                            className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-lg uppercase">{agentData.displayName}</h3>
                          {agentData.role && (
                            <div className="flex items-center justify-center space-x-1 text-xs text-slate-400">
                              <img src={agentData.role.displayIcon} className="w-3 h-3" alt="" />
                              <span>{agentData.role.displayName}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Tooltip-like reason */}
                        <div className="absolute inset-0 bg-slate-950/90 p-4 flex items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <p className="text-sm text-slate-300 italic">"{tierAgent.reason}"</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 text-slate-500">
            <p>No tier list data available for this map yet.</p>
            <p className="text-sm">Try selecting Pearl for the full demo experience.</p>
            
            {/* Fallback to showing all agents if no tier list */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
               {agentsData.slice(0, 12).map((agent: any) => (
                 <button
                    key={agent.uuid}
                    onClick={() => setAgent(agent as AgentData)}
                    className="bg-slate-900 p-4 rounded border border-white/10 hover:border-red-500"
                 >
                   <img src={agent.displayIcon} className="w-16 h-16 mx-auto mb-2" />
                   <div className="font-bold">{agent.displayName}</div>
                 </button>
               ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
