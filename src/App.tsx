
import React from 'react';
import { Layout } from './components/Layout';
import { MapSelector } from './pages/MapSelector';
import { AgentSelector } from './pages/AgentSelector';
import { SideSelector } from './pages/SideSelector';
import { TacticalMap } from './pages/TacticalMap';
import { useStore } from './store/useStore';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { currentStep } = useStore();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <MapSelector />;
      case 1:
        return <AgentSelector />;
      case 2:
        return <SideSelector />;
      case 3:
        return <TacticalMap />;
      default:
        return <MapSelector />;
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
