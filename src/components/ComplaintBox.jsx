import { useState } from "react";
import api from "../utils/api";
import { AlertCircle, ChevronDown, Send, Loader2, MessageSquare } from "lucide-react";

export default function ComplaintBox({ bookingId }) {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("Delay");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const submitComplaint = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.post("/complaints/create", { bookingId, message, category }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsOpen(false);
      alert("Complaint filed.");
    } catch (err) { alert("Error"); } finally { setLoading(false); }
  };

  return (
    <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 transition-all"
        >
          <AlertCircle size={14} /> Report an issue?
        </button>
      ) : (
        <div className="bg-rose-50/30 border border-rose-100/50 p-4 rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Raise Complaint</span>
            <button onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-slate-400">Close</button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-shrink-0">
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full md:w-32 appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-rose-300 transition-all"
              >
                <option>Delay</option>
                <option>Behavior</option>
                <option>Quality</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <input
              placeholder="Tell us what happened..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-medium outline-none focus:border-rose-300 transition-all"
            />
            
            <button 
              onClick={submitComplaint}
              disabled={!message.trim() || loading}
              className="bg-rose-500 hover:bg-rose-600 text-white p-2.5 rounded-xl transition-all disabled:opacity-30"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}