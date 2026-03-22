import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import GeneratorForm, { type GeneratorFormData } from "@/components/GeneratorForm";
import ResultCard, { type CapstoneResult } from "@/components/ResultCard";
import SkeletonLoader from "@/components/SkeletonLoader";

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
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (data: GeneratorFormData) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setFormData(data);
    try {
      const res = await generateCapstone(data);
      setResult(res);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
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
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-slate-50/80 backdrop-blur-sm">
        <div className="w-full max-w-10xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6">
          <a
            href="/"
            className="flex items-center gap-1.5 text-slate-900 hover:text-indigo-600 transition-colors text-sm font-medium"

          >
            <ArrowLeft className="h-3.5 w-3.5" />
            ThesisGenie
          </a>
          <span className="text-xs font-medium text-indigo-500 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
            Generator
          </span>
        </div>
      </header>

      {/* Main — same max-w as form so they align perfectly */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Describe Your Capstone
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details and let AI do the rest.
          </p>
        </motion.div>

        {/* Remove the form's own max-w centering by wrapping in a full-width div */}
        <div className="w-full">
          <GeneratorForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm"
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Result / Loader */}
        <div ref={resultRef} className="mt-10">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div key="loader" exit={{ opacity: 0, y: -10 }}>
                <SkeletonLoader />
              </motion.div>
            )}
            {result && !isLoading && (
              <motion.div key="result">
                <ResultCard result={result} onRegenerate={handleRegenerate} isLoading={isLoading} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default GeneratorPage;