import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BarChart2 } from "lucide-react";
import GeneratorForm, { type GeneratorFormData } from "@/components/GeneratorForm";
import ResultCard, { type CapstoneResult } from "@/components/ResultCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import Navbar from "@/components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const generateCapstone = async (data: GeneratorFormData): Promise<CapstoneResult> => {
  const response = await fetch(`${API_BASE_URL}/api/capstone/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      course: data.course,
      difficulty: data.difficulty,
      interests: Array.isArray(data.interests)
        ? data.interests
        : typeof data.interests === "string"
        ? (data.interests as string).split(",").map((i) => i.trim())
        : [],
      timeframe: data.timeframe ?? "",
      budget: data.budget ?? "",
      notes: data.notes ?? "",
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error ?? `Request failed with status ${response.status}`);
  }

  const result = await response.json();
  return {
    title: result.title,
    description: result.description,
    features: result.features,
    techStack: result.tech_Stack ?? result.tech_stack ?? [],
    methodology: result.methodology,
  };
};

const GeneratorPage = () => {
  const [result, setResult] = useState<CapstoneResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<GeneratorFormData | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (data: GeneratorFormData) => {
    setIsLoading(true);
    setHasSubmitted(true);
    setResult(null);
    setError(null);
    setFormData(data);
    try {
      const res = await generateCapstone(data);
      setResult(res);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!formData) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await generateCapstone(formData);
      setResult(res);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Lock the whole page to the viewport — no page scroll
    <div className="h-screen flex flex-col bg-[#F7F6F3] dark:bg-[#0F0F0F] overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
      `}</style>

     <Navbar variant="generator" />

      {/* Main — scrollable on mobile, fixed on desktop */}
      <main className="flex-1 overflow-y-auto lg:overflow-hidden max-w-screen-xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col">

        {/* Page heading — shrink-0 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="shrink-0 mb-5"
        >
          <h2
            style={{ fontFamily: "'DM Serif Display', serif" }}
            className="text-xl sm:text-2xl lg:text-3xl text-stone-900 dark:text-white leading-tight"
          >
            Describe your project
          </h2>
          <p className="mt-1 text-[11px] sm:text-xs text-stone-500 font-light">
            Fill in the details below and we'll generate a tailored capstone proposal.
          </p>
        </motion.div>

        {/* Two-column row — flex-1 on desktop, auto on mobile */}
        <div className="lg:flex-1 lg:overflow-hidden flex flex-col lg:flex-row gap-3 sm:gap-6 lg:min-h-0">

          {/* Form column — fixed width when split, centered when alone */}
          <motion.div
            layout
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className={`lg:min-h-0 flex flex-col ${hasSubmitted ? "hidden lg:flex" : ""}`}
            style={{
              width: "100%",
              maxWidth: hasSubmitted ? "480px" : "672px",
              marginLeft: hasSubmitted ? 0 : "auto",
              marginRight: hasSubmitted ? 0 : "auto",
              flexShrink: 0,
            }}
          >
            {/* Form fills column height */}
            <div className="flex-1 min-h-0">
              <GeneratorForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="shrink-0 mt-2 sm:mt-3 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-red-200 bg-red-50 text-red-600 text-[11px] sm:text-xs font-light"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Result column — slides in, scrollable internally */}
          <AnimatePresence>
            {hasSubmitted && (
              <motion.div
                ref={resultRef}
                key="result-panel"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                className="flex-1 min-w-0 min-h-0 hidden lg:flex flex-col overflow-y-auto"
              >
                <AnimatePresence mode="wait">
                  {isLoading && (
                    <motion.div key="loader" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                      <SkeletonLoader />
                    </motion.div>
                  )}
                  {result && !isLoading && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <ResultCard result={result} onRegenerate={handleRegenerate} isLoading={isLoading} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile: result below form */}
        {hasSubmitted && (
          <div className="shrink-0 mt-4 sm:mt-6 lg:hidden w-full">
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div key="loader-sm" exit={{ opacity: 0 }}>
                  <SkeletonLoader />
                </motion.div>
              )}
              {result && !isLoading && (
                <motion.div
                  key="result-sm"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <ResultCard result={result} onRegenerate={handleRegenerate} isLoading={isLoading} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default GeneratorPage;