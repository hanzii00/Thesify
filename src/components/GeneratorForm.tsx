import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Plus, X } from "lucide-react";

const COURSES = [
  // Technology
  "Computer Science", "Information Technology", "Information Systems",
  "Data Science", "Cybersecurity", "Software Engineering",
  "Artificial Intelligence", "Computer Engineering", "Network Engineering",
  "Database Administration", "Web Development", "Game Development",
  "Embedded Systems", "Robotics Engineering",
  // Business
  "Business Administration", "Accountancy", "Marketing Management",
  "Financial Management", "Human Resource Management", "Entrepreneurship",
  "Operations Management", "Supply Chain Management", "International Business",
  "Economics", "Public Administration",
  // Engineering
  "Civil Engineering", "Mechanical Engineering", "Electrical Engineering",
  "Electronics Engineering", "Chemical Engineering", "Industrial Engineering",
  "Environmental Engineering", "Aerospace Engineering", "Biomedical Engineering",
  "Petroleum Engineering", "Agricultural Engineering",
  // Health & Sciences
  "Health Sciences", "Nursing", "Medicine", "Pharmacy",
  "Physical Therapy", "Medical Technology", "Nutrition and Dietetics",
  "Public Health", "Biology", "Chemistry", "Physics", "Mathematics",
  "Environmental Science", "Marine Science", "Forensic Science",
  // Education & Humanities
  "Education", "Psychology", "Sociology", "Political Science",
  "Communication", "Journalism", "Social Work", "Philosophy",
  "History", "Literature", "Linguistics",
  // Arts & Design
  "Architecture", "Fine Arts", "Graphic Design", "Interior Design",
  "Fashion Design", "Film and Media Arts", "Music Technology",
  "Multimedia Arts", "Animation",
  // Hospitality & Others
  "Tourism and Hospitality Management", "Culinary Arts",
  "Aviation", "Criminology", "Library Science",
];

const INTEREST_OPTIONS = [
  "Web Development", "Mobile App", "Machine Learning", "IoT",
  "Blockchain", "Cloud Computing", "Game Development", "Data Analytics",
  "E-commerce", "Social Media", "Healthcare", "Education Tech",
];

export interface GeneratorFormData {
  course: string;
  difficulty: string;
  interests: string[];
  timeframe: string;
  budget: string;
  notes: string;
}

interface GeneratorFormProps {
  onSubmit: (data: GeneratorFormData) => void;
  isLoading: boolean;
}

const GeneratorForm = ({ onSubmit, isLoading }: GeneratorFormProps) => {
  const [course, setCourse] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [interests, setInterests] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState("3 months");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [customInterest, setCustomInterest] = useState("");

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests((prev) => [...prev, trimmed]);
    }
    setCustomInterest("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomInterest();
    }
  };

  const removeInterest = (interest: string) => {
    setInterests((prev) => prev.filter((i) => i !== interest));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ course, difficulty, interests, timeframe, budget, notes });
  };

  // Custom interests are ones not in the default list
  const customInterests = interests.filter((i) => !INTEREST_OPTIONS.includes(i));

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Course */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          🎓 Course / Program
        </label>
        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
          className="w-full h-12 rounded-xl border border-input bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        >
          <option value="">Select your course...</option>
          {COURSES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Difficulty */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          📊 Difficulty
        </label>
        <div className="flex gap-3">
          {["Easy", "Medium", "Hard"].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`flex-1 h-11 rounded-xl text-sm font-medium transition-all duration-200 border ${
                difficulty === d
                  ? "bg-primary text-primary-foreground border-primary shadow-button"
                  : "bg-card text-foreground border-input hover:border-primary/40"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          💡 Interests
        </label>

        {/* Preset chips */}
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border ${
                interests.includes(interest)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-input hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>

        {/* Custom interest tags */}
        {customInterests.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {customInterests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-200"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="hover:text-indigo-900 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Custom interest input */}
        <div className="flex gap-2 pt-1">
          <input
            type="text"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add your own interest..."
            className="flex-1 h-10 rounded-xl border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          <button
            type="button"
            onClick={addCustomInterest}
            disabled={!customInterest.trim()}
            className="h-10 px-4 rounded-xl border border-input bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Timeframe */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          ⏳ Timeframe
        </label>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="w-full h-12 rounded-xl border border-input bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        >
          <option value="1 month">1 month</option>
          <option value="2 months">2 months</option>
          <option value="3 months">3 months</option>
          <option value="4 months">4 months</option>
          <option value="6 months">6 months</option>
          <option value="1 year">1 year</option>
        </select>
      </div>

      {/* Budget */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          💰 Budget <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="e.g. $500, Free, Low budget..."
          className="w-full h-12 rounded-xl border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          📝 Extra Notes <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Any specific requirements, technologies, or ideas you have in mind..."
          className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
        />
      </div>

      <Button
        type="submit"
        variant="hero"
        size="xl"
        disabled={isLoading || !course}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating with AI...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Generate Capstone
          </>
        )}
      </Button>
    </motion.form>
  );
};

export default GeneratorForm;