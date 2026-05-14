import { useState } from "react";
import api from "../utils/api";
import { Star, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function RatingBox({ bookingId }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitRating = async () => {
    if (rating === 0) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.post("/ratings/add", { bookingId, rating }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitted(true);
    } catch (err) {
      alert("Rating failed to submit");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl transition-all animate-in fade-in zoom-in">
      <div className="bg-emerald-500 p-1 rounded-full">
        <CheckCircle2 size={14} className="text-white" />
      </div>
      <p className="text-[11px] font-black text-emerald-700 uppercase tracking-tighter">Feedback Received!</p>
    </div>
  );

  return (
    <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-[1.5rem] mt-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* LEFT: Label & Stars */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center sm:text-left">
            Rate Experience
          </h4>
          <div className="flex gap-1.5 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform active:scale-90"
              >
                <Star
                  size={26}
                  className={`transition-all duration-200 ${
                    star <= (hover || rating) 
                      ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" 
                      : "text-slate-200 fill-transparent"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Action Button */}
        <button
          onClick={submitRating}
          disabled={rating === 0 || loading}
          className={`
            min-w-[120px] group flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all
            ${rating === 0 
              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
              : "bg-[#0f172a] text-white shadow-xl shadow-slate-200 hover:bg-emerald-500 hover:shadow-emerald-200 active:scale-95"
            }
          `}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin text-white" />
          ) : (
            <Send size={14} className={rating > 0 ? "group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" : ""} />
          )}
          {loading ? "SENDING" : "POST"}
        </button>

      </div>
    </div>
  );
}