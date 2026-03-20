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
    headers: {
      "Content-Type": "application/json",
    },
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

  // Map backend snake_case to frontend camelCase
  return {
    title: result.title,
    description: result.description,
    features: result.features,
    techStack: result.tech_Stack ?? result.tech_stack ?? [],
    methodology: result.methodology,
  };
};

// ─── Page Component ───────────────────────────────────────────────────────────
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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16 px-4">
          <a href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-display font-bold text-lg">ThesisGenie</span>
          </a>
        </div>
      </header>

      <main className="container px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Describe Your Capstone
          </h2>
          <p className="mt-2 text-muted-foreground">
            Fill in the details and let AI do the rest.
          </p>
        </motion.div>

        <GeneratorForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm text-center"
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Result / Loader */}
        <div ref={resultRef} className="mt-12">
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