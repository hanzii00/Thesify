import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

interface GeneratorPageProps {
  onBack?: () => void;
}

const GeneratorPage = ({ onBack }: GeneratorPageProps) => {
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

  const handleStartOver = () => {
    setHasSubmitted(false);
    setResult(null);
    setError(null);
  };

  return (
    <div
      className="h-screen flex flex-col bg-[#F7F6F3] dark:bg-stone-900 overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
      `}</style>

      <Navbar variant="generator" onBack={onBack} />

      {/* ── DESKTOP layout (lg+): side-by-side, unchanged ── */}
      <main className="hidden lg:flex flex-1 overflow-hidden flex-col max-w-screen-xl w-full mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="shrink-0 mb-5"
        >
          <h2
            style={{ fontFamily: "'DM Serif Display', serif" }}
            className="text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 leading-tight"
          >
            Describe your project
          </h2>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 font-light">
            Fill in the details below and we'll generate a tailored capstone proposal.
          </p>
        </motion.div>

        <div className="flex-1 overflow-hidden flex gap-6 min-h-0">
          {/* Form column */}
          <motion.div
            layout
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className="min-h-0 flex flex-col"
            style={{
              width: "100%",
              maxWidth: hasSubmitted ? "480px" : "672px",
              marginLeft: hasSubmitted ? 0 : "auto",
              marginRight: hasSubmitted ? 0 : "auto",
              flexShrink: 0,
            }}
          >
            <div className="flex-1 min-h-0">
              <GeneratorForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="shrink-0 mt-3 p-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-light dark:border-red-900 dark:bg-red-950 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Result column */}
          <AnimatePresence>
            {hasSubmitted && (
              <motion.div
                ref={resultRef}
                key="result-panel"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                className="flex-1 min-w-0 min-h-0 flex flex-col overflow-y-auto"
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
      </main>

      {/* ── MOBILE layout (<lg): full-screen states ── */}
      <main className="flex lg:hidden flex-1 overflow-hidden flex-col">
        <AnimatePresence mode="wait">

          {/* State 1: Form */}
          {!hasSubmitted && (
            <motion.div
              key="mobile-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex-1 overflow-hidden flex flex-col px-4 py-5"
            >
              <div className="shrink-0 mb-4">
                <h2
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                  className="text-2xl text-stone-900 dark:text-stone-100 leading-tight"
                >
                  Describe your project
                </h2>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 font-light">
                  Fill in the details and we'll generate a tailored proposal.
                </p>
              </div>
              <div className="flex-1 min-h-0">
                <GeneratorForm onSubmit={handleSubmit} isLoading={false} />
              </div>
            </motion.div>
          )}

          {/* State 2: Loader */}
          {hasSubmitted && isLoading && (
            <motion.div
              key="mobile-loader"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex items-center justify-center px-4"
            >
              <SkeletonLoader />
            </motion.div>
          )}

          {/* State 3: Result */}
          {hasSubmitted && !isLoading && (result || error) && (
            <motion.div
              key="mobile-result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex-1 overflow-y-auto px-4 py-5"
            >
              {error && (
                <div className="mb-4 p-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-light dark:border-red-900 dark:bg-red-950 dark:text-red-400">
                  {error}
                </div>
              )}
              {result && (
                <ResultCard result={result} onRegenerate={handleRegenerate} isLoading={isLoading} />
              )}
              <button
                onClick={handleStartOver}
                className="mt-4 w-full text-xs text-stone-400 dark:text-stone-600 hover:text-stone-600 dark:hover:text-stone-400 transition-colors font-light py-2"
              >
                ← Start over
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default GeneratorPage;