import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, CheckCircle, XCircle, Clock, BarChart2, BookOpen } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Matches C# camelCase serialization
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
const StatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="rounded-lg sm:rounded-2xl border border-stone-200 bg-white p-3.5 sm:p-5 shadow-sm flex flex-col gap-2 sm:gap-3"
  >
    <div className="flex items-center justify-between">
      <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-stone-400 uppercase">{label}</span>
      <span className="h-6 sm:h-7 w-6 sm:w-7 rounded-lg bg-stone-100 flex items-center justify-center">
        <Icon className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-stone-500" />
      </span>
    </div>
    <div>
      <p className="text-2xl sm:text-3xl font-light text-stone-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
        {value}
      </p>
      {sub && <p className="text-[10px] sm:text-xs text-stone-400 font-light mt-0.5">{sub}</p>}
    </div>
  </motion.div>
);

// ─── Bar Chart (CSS-only) ─────────────────────────────────────────────────────
const BarGroup = ({ items, max }: { items: { label: string; count: number }[]; max: number }) => (
  <div className="space-y-2">
    {items.map((item, i) => (
      <motion.div
        key={item.label}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: 0.05 * i }}
        className="flex items-center gap-2 sm:gap-3"
      >
        <span className="text-[11px] sm:text-xs text-stone-500 font-light w-24 sm:w-36 shrink-0 truncate" title={item.label}>
          {item.label}
        </span>
        <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max((item.count / max) * 100, 4)}%` }}
            transition={{ duration: 0.6, delay: 0.1 + 0.05 * i, ease: "easeOut" }}
            className="h-full rounded-full bg-stone-800"
          />
        </div>
        <span className="text-[10px] sm:text-xs text-stone-400 font-light w-5 sm:w-6 text-right shrink-0">{item.count}</span>
      </motion.div>
    ))}
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({
  title,
  icon: Icon,
  children,
  delay = 0,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="rounded-lg sm:rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden"
  >
    <div className="px-3.5 sm:px-5 py-3 sm:py-4 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
      <Icon className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-stone-400" />
      <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-stone-400 uppercase">{title}</span>
    </div>
    <div className="p-3.5 sm:p-5">{children}</div>
  </motion.div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="space-y-4 sm:space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-lg sm:rounded-2xl border border-stone-200 bg-white p-3.5 sm:p-5 h-24 sm:h-28 animate-pulse" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="rounded-lg sm:rounded-2xl border border-stone-200 bg-white h-40 sm:h-48 animate-pulse" />
      ))}
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const AnalyticsPage = () => {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/analytics/stats`);
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message ?? "Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Safe max computation — handles empty arrays and both casing variants from C#
  const topCourseMax = Math.max(
    ...(stats?.topCourses?.map((c) => c.count ?? (c as any).Count ?? 0) ?? [1]),
    1
  );
  const diffMax = Math.max(
    ...(stats?.difficultyDistribution?.map((d) => d.count ?? (d as any).Count ?? 0) ?? [1]),
    1
  );

  // Normalize in case ASP.NET serializes PascalCase (shouldn't happen with default options, but just in case)
  const topCourses = stats?.topCourses?.map((c) => ({
    label: c.course ?? (c as any).Course ?? "",
    count: c.count ?? (c as any).Count ?? 0,
  })) ?? [];

  const diffDist = stats?.difficultyDistribution?.map((d) => ({
    label: d.difficulty ?? (d as any).Difficulty ?? "",
    count: d.count ?? (d as any).Count ?? 0,
  })) ?? [];

  return (
    <div
      className="h-screen flex flex-col bg-[#F7F6F3] overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
      `}</style>

      {/* Navbar */}
      <header className="shrink-0 border-b border-stone-200/80 bg-[#F7F6F3]/90 backdrop-blur-md z-50">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <a
            href="/"
            className="flex items-center gap-2 text-stone-700 hover:text-stone-900 transition-colors text-xs sm:text-sm font-medium group"
          >
            <ArrowLeft className="h-3 sm:h-3.5 w-3 sm:w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span style={{ fontFamily: "'DM Serif Display', serif" }} className="text-sm sm:text-base">Thesify</span>
          </a>
          <span className="text-xs font-medium text-stone-500 bg-white border border-stone-200 px-3 py-1 rounded-full shadow-sm">
            Analytics
          </span>
        </div>
      </header>

      {/* Main — scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 sm:mb-7"
          >
            <h2
              style={{ fontFamily: "'DM Serif Display', serif" }}
              className="text-2xl sm:text-3xl text-stone-900"
            >
              Analytics
            </h2>
            {stats && (
              <p className="mt-1 text-[10px] sm:text-xs text-stone-400 font-light">
                Last updated {new Date(stats.generatedAt).toLocaleString()}
              </p>
            )}
          </motion.div>

          {loading && <Skeleton />}

          {error && (
            <div className="rounded-lg sm:rounded-xl border border-red-200 bg-red-50 text-red-600 text-[11px] sm:text-sm font-light p-3 sm:p-4">
              {error}
            </div>
          )}

          {stats && !loading && (
            <div className="space-y-4">

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                  label="Total Generations"
                  value={stats.totalGenerations}
                  icon={TrendingUp}
                  delay={0}
                />
                <StatCard
                  label="Successful"
                  value={stats.successfulGenerations}
                  sub={`${stats.successRate.toFixed(1)}% success rate`}
                  icon={CheckCircle}
                  delay={0.05}
                />
                <StatCard
                  label="Failed"
                  value={stats.failedGenerations}
                  icon={XCircle}
                  delay={0.1}
                />
                <StatCard
                  label="Last 7 Days"
                  value={stats.generationsLast7Days}
                  sub="generations"
                  icon={Clock}
                  delay={0.15}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <SectionCard title="Top Courses" icon={BookOpen} delay={0.2}>
                  {topCourses.length ? (
                    <BarGroup items={topCourses} max={topCourseMax} />
                  ) : (
                    <p className="text-xs text-stone-400 font-light">No data yet.</p>
                  )}
                </SectionCard>

                <SectionCard title="Difficulty Distribution" icon={BarChart2} delay={0.25}>
                  {diffDist.length ? (
                    <BarGroup items={diffDist} max={diffMax} />
                  ) : (
                    <p className="text-xs text-stone-400 font-light">No data yet.</p>
                  )}
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