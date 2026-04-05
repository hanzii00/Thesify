import { useState } from "react";

export interface GeneratorFormData {
  course: string;
  difficulty: string;
  interests: string | string[];
  timeframe?: string;
  budget?: string;
  notes?: string;
}

interface GeneratorFormProps {
  onSubmit: (data: GeneratorFormData) => void;
  isLoading: boolean;
}

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const TIMEFRAMES = ["1 month", "2–3 months", "4–6 months", "6–12 months"];
const BUDGETS = ["Free / No budget", "Under ₱5,000", "₱5,000–₱20,000", "₱20,000+"];

const Field = ({ label, children, optional }: { label: string; children: React.ReactNode; optional?: boolean }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-1.5">
      <label className="text-[11px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase">
        {label}
      </label>
      {optional && (
        <span className="text-[10px] text-stone-300 dark:text-stone-600 font-medium">optional</span>
      )}
    </div>
    {children}
  </div>
);

const PillGroup = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-wrap gap-1.5 sm:gap-2">
    {options.map((opt) => (
      <button
        key={opt}
        type="button"
        onClick={() => onChange(opt)}
        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium border transition-all ${
          value === opt
            ? "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100"
            : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700 dark:hover:border-stone-500 dark:hover:bg-stone-700"
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const inputClass =
  "w-full rounded-lg sm:rounded-xl border border-stone-200 bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-stone-800 placeholder-stone-400 font-light outline-none transition-all hover:border-stone-300 focus:border-stone-400 focus:ring-2 focus:ring-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500 dark:hover:border-stone-600 dark:focus:border-stone-500 dark:focus:ring-stone-700";

const GeneratorForm = ({ onSubmit, isLoading }: GeneratorFormProps) => {
  const [course, setCourse] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [interests, setInterests] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ course, difficulty, interests, timeframe, budget, notes });
  };

  const isValid = course.trim() && interests.trim();

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden dark:border-stone-700 dark:bg-stone-900"
    >
      {/* Pinned header */}
      <div className="shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-b border-stone-100 bg-stone-50 dark:border-stone-800 dark:bg-stone-800/60">
        <p className="text-[11px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase mb-0.5">
          Project Details
        </p>
        <p className="text-xs text-stone-400 dark:text-stone-500 font-light">
          Tell us what you're working with
        </p>
      </div>

      {/* Scrollable fields */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4">
        <Field label="Course / Discipline">
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="e.g. Information Technology, Nursing, Architecture..."
            className={inputClass}
            autoComplete="off"
          />
        </Field>

        <Field label="Difficulty Level">
          <PillGroup options={DIFFICULTIES} value={difficulty} onChange={setDifficulty} />
        </Field>

        <Field label="Interests / Topics">
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g. machine learning, health, education..."
            className={inputClass}
          />
        </Field>

        <Field label="Timeframe" optional>
          <PillGroup
            options={TIMEFRAMES}
            value={timeframe}
            onChange={(v) => setTimeframe(v === timeframe ? "" : v)}
          />
        </Field>

        <Field label="Budget" optional>
          <PillGroup
            options={BUDGETS}
            value={budget}
            onChange={(v) => setBudget(v === budget ? "" : v)}
          />
        </Field>

        <Field label="Additional Notes" optional>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific requirements or constraints..."
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      {/* Pinned footer */}
      <div className="shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-t border-stone-100 bg-stone-50 dark:border-stone-800 dark:bg-stone-800/60">
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-stone-900 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin dark:border-stone-900/30 dark:border-t-stone-900" />
              Generating...
            </>
          ) : (
            "Generate Proposal"
          )}
        </button>
      </div>
    </form>
  );
};

export default GeneratorForm;