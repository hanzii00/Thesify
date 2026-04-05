import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Review {
  id: number;
  name: string;
  message: string;
  rating: number;
  createdAt: string;
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
const StarRating = ({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  const interactive = !!onChange;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`transition-transform ${interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
        >
          <Star
            className={`h-4 w-4 transition-colors ${
              star <= (hovered || value)
                ? "fill-stone-700 text-stone-700 dark:fill-stone-300 dark:text-stone-300"
                : "fill-stone-200 text-stone-200 dark:fill-stone-700 dark:text-stone-700"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// ─── Review Card ──────────────────────────────────────────────────────────────
const ReviewCard = ({ review, index }: { review: Review; index: number }) => {
  const initials = review.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="flex gap-3 p-4 rounded-2xl border border-stone-200 bg-white shadow-sm dark:bg-stone-800 dark:border-stone-700"
    >
      {/* Avatar */}
      <div className="shrink-0 h-9 w-9 rounded-full bg-stone-900 dark:bg-stone-600 flex items-center justify-center">
        <span className="text-xs font-semibold text-white">{initials}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{review.name}</span>
            <StarRating value={review.rating} />
          </div>
          <span className="text-xs text-stone-400 dark:text-stone-500 font-light shrink-0">{timeAgo(review.createdAt)}</span>
        </div>
        <p className="mt-1.5 text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed">{review.message}</p>
      </div>
    </motion.div>
  );
};

// ─── Submit Form ──────────────────────────────────────────────────────────────
const SubmitForm = ({ onSubmitted }: { onSubmitted: (r: Review) => void }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (rating === 0) { setError("Please select a star rating."); return; }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Anonymous",
          message: message.trim(),
          rating,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit review.");
      const data = await res.json();
      onSubmitted(data);
      setName("");
      setMessage("");
      setRating(0);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-400 font-light outline-none transition-all hover:border-stone-300 focus:border-stone-400 focus:ring-2 focus:ring-stone-200 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 dark:placeholder-stone-500 dark:hover:border-stone-600 dark:focus:border-stone-500 dark:focus:ring-stone-700";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden dark:bg-stone-800 dark:border-stone-700">
      <div className="px-5 py-4 border-b border-stone-100 bg-stone-50 dark:bg-stone-900 dark:border-stone-800">
        <p className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase dark:text-stone-500">Leave a Review</p>
        <p className="text-xs text-stone-400 dark:text-stone-500 font-light mt-0.5">Your name is optional — you can stay anonymous</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Rating */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Rating</label>
          <StarRating value={rating} onChange={setRating} />
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase flex items-center gap-1.5">
            Name <span className="text-[10px] text-stone-300 dark:text-stone-600 font-medium normal-case tracking-normal">optional</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name or leave blank to stay anonymous"
            className={inputClass}
            maxLength={50}
          />
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Review</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your experience with Thesify..."
            rows={3}
            maxLength={500}
            className={`${inputClass} resize-none`}
            required
          />
          <p className="text-right text-[10px] text-stone-300 dark:text-stone-600">{message.length}/500</p>
        </div>

        {error && (
          <p className="text-xs text-red-500 font-light">{error}</p>
        )}
      </div>

      <div className="px-5 py-4 border-t border-stone-100 bg-stone-50 dark:bg-stone-900 dark:border-stone-800">
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          {loading ? (
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin dark:border-stone-900/30 dark:border-t-stone-900" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex gap-3 p-4 rounded-2xl border border-stone-200 bg-white dark:bg-stone-800 dark:border-stone-700">
        <div className="h-9 w-9 rounded-full bg-stone-100 dark:bg-stone-700 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded-full bg-stone-100 dark:bg-stone-700 animate-pulse" />
          <div className="h-3 w-full rounded-full bg-stone-100 dark:bg-stone-700 animate-pulse" />
          <div className="h-3 w-4/5 rounded-full bg-stone-100 dark:bg-stone-700 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/review`);
        if (!res.ok) throw new Error("Failed to load reviews.");
        const data = await res.json();
        setReviews(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  const handleNewReview = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div
      className="h-screen flex flex-col bg-[#F7F6F3] dark:bg-stone-900 overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
      `}</style>

      <Navbar variant="reviews" />

      <main className="flex-1 overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-6 py-8 h-full flex flex-col">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="shrink-0 mb-6"
          >
            <h2
              style={{ fontFamily: "'DM Serif Display', serif" }}
              className="text-3xl text-stone-900 dark:text-stone-100"
            >
              Reviews
            </h2>
            <div className="mt-1 flex items-center gap-3">
              {avgRating && (
                <div className="flex items-center gap-1.5">
                  <StarRating value={Math.round(Number(avgRating))} />
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{avgRating}</span>
                  <span className="text-xs text-stone-400 dark:text-stone-500 font-light">
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}
              {!avgRating && !loading && (
                <p className="text-xs text-stone-400 dark:text-stone-500 font-light">No reviews yet — be the first!</p>
              )}
            </div>
          </motion.div>

          {/* Two column */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 min-h-0">

            {/* Left: Submit form */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="shrink-0"
            >
              <SubmitForm onSubmitted={handleNewReview} />
            </motion.div>

            {/* Right: Reviews feed */}
            <div className="overflow-y-auto min-h-0 space-y-3 pr-1">
              {loading && <Skeleton />}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-light p-4 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
                  {error}
                </div>
              )}

              {!loading && !error && reviews.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-48 gap-3 text-stone-400 dark:text-stone-600"
                >
                  <MessageSquare className="h-8 w-8 text-stone-300 dark:text-stone-700" />
                  <p className="text-sm font-light">No reviews yet. Start the conversation!</p>
                </motion.div>
              )}

              <AnimatePresence>
                {reviews.map((review, i) => (
                  <ReviewCard key={review.id} review={review} index={i} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewsPage;