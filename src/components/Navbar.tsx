import { useState } from "react";
import { ArrowLeft, BarChart2, Info, MessageSquare, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export type NavbarVariant = "hero" | "generator" | "analytics" | "reviews";

interface NavbarProps {
  variant: NavbarVariant;
  onAbout?: () => void;
  onBack?: () => void;
}

const serifFont = { fontFamily: "'DM Serif Display', serif" };

const Badge = ({ label }: { label: string }) => (
  <span className="text-xs font-medium text-stone-500 bg-white border border-stone-200 px-3 py-1 rounded-full shadow-sm dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400">
    {label}
  </span>
);

const sharedHeaderClass =
  "shrink-0 border-b border-stone-200/80 bg-[#F7F6F3]/90 backdrop-blur-md z-50 dark:bg-stone-900/90 dark:border-stone-800";
const backLinkClass =
  "flex items-center gap-2 font-medium transition-colors group text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100";
const arrowClass = "group-hover:-translate-x-0.5 transition-transform";
const navLinkClass =
  "flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors dark:text-stone-400 dark:hover:text-stone-200";
const mobileNavLinkClass =
  "flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors py-2.5 border-b border-stone-100 dark:text-stone-400 dark:hover:text-stone-100 dark:border-stone-800";

const Navbar = ({ variant, onAbout, onBack }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  if (variant === "generator") {
    return (
      <header className={sharedHeaderClass}>
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <button onClick={onBack} className={backLinkClass}>
            <ArrowLeft className={`${arrowClass} h-3.5 w-3.5`} />
            <span style={serifFont} className="text-base">Thesify</span>
          </button>
          <Badge label="Idea Generator" />
        </div>
      </header>
    );
  }

  if (variant === "hero") {
    return (
      <header className="border-b border-stone-200/80 bg-[#F7F6F3] dark:bg-stone-900 dark:border-stone-800 relative z-50">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <span style={serifFont} className="text-base text-stone-900 dark:text-stone-100">
            Thesify
          </span>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/analytics" className={navLinkClass}>
              <BarChart2 className="h-3.5 w-3.5" />
              Analytics
            </Link>
            <Link to="/reviews" className={navLinkClass}>
              <MessageSquare className="h-3.5 w-3.5" />
              Reviews
            </Link>
            <button onClick={onAbout} className={navLinkClass}>
              <Info className="h-3.5 w-3.5" />
              About
            </button>
            <Badge label="Beta" />
          </div>

          {/* Mobile: badge + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <Badge label="Beta" />
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden overflow-hidden bg-[#F7F6F3] dark:bg-stone-900 px-4 pb-2"
            >
              <Link
                to="/analytics"
                className={mobileNavLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                <BarChart2 className="h-4 w-4" />
                Analytics
              </Link>
              <Link
                to="/reviews"
                className={mobileNavLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                <MessageSquare className="h-4 w-4" />
                Reviews
              </Link>
              <button
                onClick={() => { onAbout?.(); setMenuOpen(false); }}
                className={`${mobileNavLinkClass} w-full text-left border-b-0`}
              >
                <Info className="h-4 w-4" />
                About
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    );
  }

  if (variant === "analytics") {
    return (
      <header className={`${sharedHeaderClass} relative`}>
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <Link to="/" className={`${backLinkClass} text-xs sm:text-sm`}>
            <ArrowLeft className={`${arrowClass} h-3 w-3 sm:h-3.5 sm:w-3.5`} />
            <span style={serifFont} className="text-sm sm:text-base">Thesify</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop */}
            <Link to="/reviews" className={`${navLinkClass} hidden sm:flex`}>
              <MessageSquare className="h-3.5 w-3.5" />
              Reviews
            </Link>
            <Badge label="Analytics" />
            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="sm:hidden p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden overflow-hidden bg-[#F7F6F3]/90 dark:bg-stone-900 px-4 pb-2"
            >
              <Link
                to="/reviews"
                className={mobileNavLinkClass + " border-b-0"}
                onClick={() => setMenuOpen(false)}
              >
                <MessageSquare className="h-4 w-4" />
                Reviews
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    );
  }

  // reviews variant
  return (
    <header className={`${sharedHeaderClass} relative`}>
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link to="/" className={`${backLinkClass} text-xs sm:text-sm`}>
          <ArrowLeft className={`${arrowClass} h-3 w-3 sm:h-3.5 sm:w-3.5`} />
          <span style={serifFont} className="text-sm sm:text-base">Thesify</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop */}
          <Link to="/analytics" className={`${navLinkClass} hidden sm:flex`}>
            <BarChart2 className="h-3.5 w-3.5" />
            Analytics
          </Link>
          <Badge label="Reviews" />
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="sm:hidden p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden overflow-hidden bg-[#F7F6F3]/90 dark:bg-stone-900 px-4 pb-2"
          >
            <Link
              to="/analytics"
              className={mobileNavLinkClass + " border-b-0"}
              onClick={() => setMenuOpen(false)}
            >
              <BarChart2 className="h-4 w-4" />
              Analytics
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;