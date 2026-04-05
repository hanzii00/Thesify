import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, X, Github } from "lucide-react";
import Navbar from "@/components/Navbar";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const serifFont = { fontFamily: "'DM Serif Display', serif" };

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F7F6F3] dark:bg-stone-900"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');`}</style>

      <Navbar variant="hero" onAbout={() => setShowAbout(true)} />

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
            onClick={() => setShowAbout(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl border border-stone-200 shadow-xl w-full max-w-sm p-6 relative dark:bg-stone-900 dark:border-stone-700"
            >
              <button
                onClick={() => setShowAbout(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors dark:hover:text-stone-200"
              >
                <X className="h-4 w-4" />
              </button>
              <h2 style={serifFont} className="text-xl text-stone-900 dark:text-stone-100 mb-1">
                About Thesify
              </h2>
              <p className="text-xs text-stone-400 font-light mb-6">
                An AI-powered capstone idea generator built for students.
              </p>
              <div className="border-t border-stone-100 dark:border-stone-800 pt-5">
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-3">
                  Developer
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200 font-mono">
                      .... .- -. --.. / -.-. .... . ... - . .-. / -... .- -.-. ..- ...
                    </p>
                    <p className="text-xs text-stone-400 font-light mt-0.5">Creator & Developer</p>
                  </div>
                  <a
                    href="https://github.com/hanzii00"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 border border-stone-200 hover:border-stone-400 rounded-lg px-3 py-1.5 transition-all dark:text-stone-400 dark:hover:text-stone-100 dark:border-stone-700 dark:hover:border-stone-500"
                  >
                    <Github className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero body */}
      <section className="flex-1 flex items-center justify-center">
        <div className="container px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-medium text-stone-500 mb-8 shadow-sm dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
          >
            <Sparkles className="h-3.5 w-3.5 text-stone-400" />
            AI-Powered Capstone Generator
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={serifFont}
            className="text-3xl sm:text-4xl lg:text-5xl tracking-tight text-stone-900 dark:text-stone-100 leading-tight"
          >
            Find your perfect{" "}
            <span className="italic text-stone-500 dark:text-stone-400">capstone idea</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-5 text-base text-stone-500 dark:text-stone-400 max-w-xl leading-relaxed font-light"
          >
            Tell us your course and interests. We'll generate a tailored capstone project idea
            with features, tech stack, and methodology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          >
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-stone-800 transition-colors group dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
            >
              Get Started
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-10 sm:mt-16 grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-lg"
          >
            {[
              { value: "10+", label: "Courses supported" },
              { value: "AI", label: "Powered" },
              { value: "Free", label: "No sign-up needed" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span style={serifFont} className="text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
                  {stat.value}
                </span>
                <span className="text-[10px] sm:text-xs text-stone-400 font-light text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;