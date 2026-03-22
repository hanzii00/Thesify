import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="container px-6 py-20 flex flex-col items-center text-center max-w-3xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-500 mb-8 shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          AI-Powered Capstone Generator
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight"
        >
          Find your perfect{" "}
          <span className="text-indigo-600">capstone idea</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-5 text-base text-slate-500 max-w-xl leading-relaxed"
        >
          Tell us your course and interests. We'll generate a tailored capstone project idea with features, tech stack, and methodology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={onGetStarted}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-6 w-full max-w-lg"
        >
          {[
            { value: "10+", label: "Courses supported" },
            { value: "AI", label: "Llama 3.3 powered" },
            { value: "Free", label: "No sign-up needed" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-xl font-bold text-slate-900">{stat.value}</span>
              <span className="text-xs text-slate-400">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;