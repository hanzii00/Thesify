import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import GeneratorPage from "@/pages/GeneratorPage";
import { AnimatePresence, motion } from "framer-motion";

const Index = () => {
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!showGenerator ? (
        <motion.div key="hero" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
          <HeroSection onGetStarted={() => setShowGenerator(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="generator"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GeneratorPage onBack={() => setShowGenerator(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;