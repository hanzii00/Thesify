import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";

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

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "#f1f0ff",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.9rem",
  padding: "0.75rem 1rem",
  outline: "none",
  transition: "border-color 0.2s, background 0.2s",
  appearance: "none" as const,
  WebkitAppearance: "none" as const,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: "0.62rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  color: "rgba(255,255,255,0.35)",
  marginBottom: "0.6rem",
  display: "block",
};

const GeneratorForm = ({ onSubmit, isLoading }: GeneratorFormProps) => {
  const [course, setCourse] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [interests, setInterests] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState("3 months");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ course, difficulty, interests, timeframe, budget, notes });
  };

  const focusedStyle = (field: string): React.CSSProperties => ({
    ...inputBase,
    borderColor: focusedField === field ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)",
    background: focusedField === field ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.04)",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        select option { background: #141420; color: #f1f0ff; }
        textarea { resize: none; line-height: 1.65; }
        select { cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='rgba(255,255,255,0.3)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important; background-repeat: no-repeat !important; background-position: right 1rem center !important; padding-right: 2.5rem !important; }
      `}</style>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "640px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.75rem" }}
      >

        {/* Course */}
        <div>
          <label style={labelStyle}>Course / Programme</label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
            onFocus={() => setFocusedField("course")}
            onBlur={() => setFocusedField(null)}
            style={focusedStyle("course")}
          >
            <option value="">Select your course…</option>
            {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label style={labelStyle}>Project Difficulty</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["Easy", "Medium", "Hard"].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                style={{
                  flex: 1,
                  padding: "0.65rem",
                  borderRadius: "10px",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: difficulty === d ? "1px solid rgba(99,102,241,0.6)" : "1px solid rgba(255,255,255,0.08)",
                  background: difficulty === d ? "rgba(99,102,241,0.14)" : "rgba(255,255,255,0.03)",
                  color: difficulty === d ? "#a5b4fc" : "rgba(255,255,255,0.35)",
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label style={labelStyle}>Areas of Interest</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                style={{
                  padding: "0.35rem 0.8rem",
                  borderRadius: "6px",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  border: interests.includes(interest)
                    ? "1px solid rgba(99,102,241,0.55)"
                    : "1px solid rgba(255,255,255,0.07)",
                  background: interests.includes(interest)
                    ? "rgba(99,102,241,0.12)"
                    : "rgba(255,255,255,0.02)",
                  color: interests.includes(interest)
                    ? "#a5b4fc"
                    : "rgba(255,255,255,0.3)",
                }}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Timeframe */}
        <div>
          <label style={labelStyle}>Timeframe</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            onFocus={() => setFocusedField("timeframe")}
            onBlur={() => setFocusedField(null)}
            style={focusedStyle("timeframe")}
          >
            {["1 month", "2 months", "3 months", "4 months", "6 months", "1 year"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div>
          <label style={{ ...labelStyle }}>
            Budget{" "}
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.58rem" }}>— optional</span>
          </label>
          <input
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. $500, Free, Low budget…"
            onFocus={() => setFocusedField("budget")}
            onBlur={() => setFocusedField(null)}
            style={{
              ...focusedStyle("budget"),
              "::placeholder": { color: "rgba(255,255,255,0.18)" },
            } as React.CSSProperties}
          />
        </div>

        {/* Notes */}
        <div>
          <label style={labelStyle}>
            Extra Notes{" "}
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.58rem" }}>— optional</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Any specific requirements, technologies, or ideas…"
            onFocus={() => setFocusedField("notes")}
            onBlur={() => setFocusedField(null)}
            style={focusedStyle("notes")}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !course}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
            width: "100%",
            padding: "0.9rem",
            borderRadius: "12px",
            border: "none",
            background: isLoading || !course
              ? "rgba(99,102,241,0.3)"
              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.92rem",
            fontWeight: 500,
            cursor: isLoading || !course ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            boxShadow: isLoading || !course ? "none" : "0 0 30px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {isLoading ? (
            <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Generating with AI…</>
          ) : (
            <><Sparkles size={16} /> Generate Capstone</>
          )}
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </motion.form>
    </>
  );
};

export default GeneratorForm;