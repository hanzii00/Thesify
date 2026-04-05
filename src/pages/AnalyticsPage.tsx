import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle, XCircle, Clock, BarChart2, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ─── Types ────────────────────────────────────────────────────────────────────
interface CourseCount {
  course: string;
  count: number;
}

interface DifficultyCount {
  difficulty: string;
  count: number;
}

interface AnalyticsStats {
  totalGenerations: number;
  successfulGenerations: number;
  failedGenerations: number;
  successRate: number;
  topCourses: CourseCount[];
  difficultyDistribution: DifficultyCount[];
  generationsLast7Days: number;
  generatedAt: string;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="rounded-lg sm:rounded-2xl border border-stone-200 dark:border-stone-700 
    bg-white dark:bg-stone-800 p-3.5 sm:p-5 shadow-sm flex flex-col gap-2 sm:gap-3"
  >
    <div className="flex items-center justify-between">
      <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest 
      text-stone-400 dark:text-stone-500 uppercase">
        {label}
      </span>

      <span className="h-6 sm:h-7 w-6 sm:w-7 rounded-lg 
      bg-stone-100 dark:bg-stone-700 flex items-center justify-center">
        <Icon className="h-3.5 w-3.5 text-stone-500 dark:text-stone-300" />
      </span>
    </div>

    <div>
      <p className="text-2xl sm:text-3xl font-light text-stone-900 dark:text-white"
        style={{ fontFamily: "'DM Serif Display', serif" }}>
        {value}
      </p>

      {sub && (
        <p className="text-[10px] sm:text-xs text-stone-400 dark:text-stone-500 font-light mt-0.5">
          {sub}
        </p>
      )}
    </div>
  </motion.div>
);

// ─── Bar Chart ────────────────────────────────────────────────────────────────
const BarGroup = ({ items, max }: any) => (
  <div className="space-y-2">
    {items.map((item: any, i: number) => (
      <motion.div
        key={item.label}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: 0.05 * i }}
        className="flex items-center gap-2 sm:gap-3"
      >
        <span className="text-xs text-stone-500 dark:text-stone-400 font-light w-24 sm:w-36 truncate">
          {item.label}
        </span>

        <div className="flex-1 h-2 rounded-full bg-stone-100 dark:bg-stone-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max((item.count / max) * 100, 4)}%` }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full bg-stone-800 dark:bg-white"
          />
        </div>

        <span className="text-xs text-stone-400 dark:text-stone-500 w-6 text-right">
          {item.count}
        </span>
      </motion.div>
    ))}
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ title, icon: Icon, children, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="rounded-lg sm:rounded-2xl border border-stone-200 dark:border-stone-700 
    bg-white dark:bg-stone-800 shadow-sm overflow-hidden"
  >
    <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-700 
    bg-stone-50 dark:bg-stone-900 flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
      <span className="text-xs font-semibold tracking-widest 
      text-stone-400 dark:text-stone-500 uppercase">
        {title}
      </span>
    </div>

    <div className="p-4">{children}</div>
  </motion.div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i}
          className="rounded-2xl border border-stone-200 dark:border-stone-700 
          bg-white dark:bg-stone-800 h-28 animate-pulse"
        />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {[...Array(2)].map((_, i) => (
        <div key={i}
          className="rounded-2xl border border-stone-200 dark:border-stone-700 
          bg-white dark:bg-stone-800 h-48 animate-pulse"
        />
      ))}
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const AnalyticsPage = () => {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/analytics/stats`)
      .then((res) => res.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-screen flex flex-col 
    bg-[#F7F6F3] dark:bg-stone-900 overflow-hidden">

      <Navbar variant="analytics" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-6">

          <h2 className="text-2xl sm:text-3xl text-stone-900 dark:text-white mb-6"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Analytics
          </h2>

          {loading && <Skeleton />}

          {stats && !loading && (
            <div className="space-y-4">

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard label="Total" value={stats.totalGenerations} icon={TrendingUp} />
                <StatCard label="Success" value={stats.successfulGenerations} icon={CheckCircle} />
                <StatCard label="Failed" value={stats.failedGenerations} icon={XCircle} />
                <StatCard label="7 Days" value={stats.generationsLast7Days} icon={Clock} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <SectionCard title="Top Courses" icon={BookOpen}>
                  <BarGroup items={stats.topCourses.map(c => ({ label: c.course, count: c.count }))} max={10} />
                </SectionCard>

                <SectionCard title="Difficulty" icon={BarChart2}>
                  <BarGroup items={stats.difficultyDistribution.map(d => ({ label: d.difficulty, count: d.count }))} max={10} />
                </SectionCard>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;