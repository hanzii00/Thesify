import { motion } from "framer-motion";

const SkeletonLoader = () => {
  return (
    <div className="w-full">
      <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm overflow-hidden">
        
        {/* Header skeleton */}
        <div className="px-6 py-5 border-b border-stone-100 dark:border-stone-700 bg-stone-50 dark:bg-stone-900">
          <div className="h-2.5 w-24 rounded-full bg-stone-200 dark:bg-stone-700 animate-pulse mb-2" />
          <div className="h-5 w-3/4 rounded-lg bg-stone-200 dark:bg-stone-700 animate-pulse" />
        </div>

        <div className="p-6 space-y-6">
          
          {/* Description */}
          <div className="space-y-2">
            <div className="h-2 w-20 rounded-full bg-stone-200 dark:bg-stone-700 animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-full rounded-md bg-stone-100 dark:bg-stone-700 animate-pulse" />
              <div className="h-3.5 w-5/6 rounded-md bg-stone-100 dark:bg-stone-700 animate-pulse" />
              <div className="h-3.5 w-4/6 rounded-md bg-stone-100 dark:bg-stone-700 animate-pulse" />
            </div>
          </div>

          <div className="h-px bg-stone-100 dark:bg-stone-700" />

          {/* Features */}
          <div className="space-y-2">
            <div className="h-2 w-24 rounded-full bg-stone-200 dark:bg-stone-700 animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-stone-200 dark:bg-stone-600 shrink-0" />
                  <div
                    className="h-3 rounded-md bg-stone-100 dark:bg-stone-700 animate-pulse"
                    style={{ width: `${70 + i * 8}%`, animationDelay: `${i * 100}ms` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-stone-100 dark:bg-stone-700" />

          {/* Tech stack */}
          <div className="space-y-2">
            <div className="h-2 w-16 rounded-full bg-stone-200 dark:bg-stone-700 animate-pulse" />
            <div className="flex flex-wrap gap-1.5">
              {[80, 64, 96, 72].map((w, i) => (
                <div
                  key={i}
                  className="h-6 rounded-md bg-stone-100 dark:bg-stone-700 animate-pulse"
                  style={{ width: `${w}px`, animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="px-6 py-4 border-t border-stone-100 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 flex gap-2">
          {[100, 72, 120, 140].map((w, i) => (
            <div
              key={i}
              className="h-8 rounded-lg bg-stone-200 dark:bg-stone-700 animate-pulse"
              style={{ width: `${w}px`, animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-center text-xs text-stone-400 dark:text-stone-500 font-light mt-5 tracking-wide"
      >
        Generating your proposal...
      </motion.p>
    </div>
  );
};

export default SkeletonLoader;