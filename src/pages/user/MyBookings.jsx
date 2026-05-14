import { useEffect, useState } from "react";
import api from "../../utils/api";
import UserSidebar from "../../components/UserSidebar";
import { 
  Calendar, Clock, User, CheckCircle2, 
  Loader2, Hash, Trash2, PartyPopper 
} from "lucide-react";
import RatingBox from "../../components/RatingBox";
import ComplaintBox from "../../components/ComplaintBox";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const cancel = async (id) => {
    if (!window.confirm("Confirm cancellation?")) return;
    try {
      await api.post(`/bookings/cancel/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
    } catch (err) { alert("Failed"); }
  };

  return (
    <div className="flex bg-[#F1F5F9] min-h-screen font-sans">
      <UserSidebar />
      <main className="pl-64 w-full">
        {/* HEADER SECTION */}
        <div className="bg-[#0f172a] pt-12 pb-24 px-10">
          <header className="max-w-5xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-80">User Console</p>
              <h1 className="text-4xl font-black text-white">My <span className="text-emerald-400">Bookings</span></h1>
            </div>
            <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4 backdrop-blur-sm">
              <div className="text-right">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Active Sessions</p>
                <p className="text-2xl font-mono text-white font-bold leading-none">
                  {bookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed').length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="text-emerald-400" size={20} />
              </div>
            </div>
          </header>
        </div>

        {/* BOOKINGS LIST */}
        <div className="px-10 -mt-12 max-w-5xl mx-auto pb-20">
          {loading ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Loading Records...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {bookings.map((b) => <BookingCard key={b._id} booking={b} onCancel={cancel} />)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function BookingCard({ booking, onCancel }) {
  const isCancelled = booking.status === 'cancelled';
  const isCompleted = booking.status === 'completed';
  const alreadyRated = booking.isRated; // Backend se aane wala flag

  return (
    <div className={`bg-white rounded-[1.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-md ${isCancelled ? 'opacity-75 grayscale-[0.5]' : ''}`}>
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* LEFT: Info Section */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase border border-emerald-100 flex items-center gap-1">
                <Hash size={10}/> Token {booking.tokenNumber || "0"}
              </span>
              <StatusBadge status={booking.status} />
            </div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{booking.serviceId?.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-slate-500">
               <User size={12} className="text-emerald-500" />
               <span className="text-[11px] font-bold uppercase tracking-tighter">{booking.serviceId?.spId?.name || "Expert"}</span>
            </div>
          </div>

          {/* MIDDLE: Time & Date Box */}
          <div className="flex items-center gap-3 bg-[#0f172a] p-1.5 rounded-xl self-start md:self-center shadow-lg shadow-slate-200">
             <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/5">
                <Calendar className="text-emerald-400" size={12} />
                <p className="text-[11px] font-bold text-white whitespace-nowrap">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
             </div>
             <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                <Clock className="text-blue-400" size={12} />
                <p className="text-[11px] font-bold text-white whitespace-nowrap">{booking.segmentId?.startTime || "00:00"}</p>
             </div>
          </div>

          {/* RIGHT: Actions */}
          {!isCancelled && !isCompleted && (
            <button 
              onClick={() => onCancel(booking._id)} 
              className="flex items-center gap-2 px-4 py-2 border border-red-100 text-red-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all group"
            >
              <Trash2 size={12} className="group-hover:animate-pulse" />
              Cancel
            </button>
          )}
        </div>

        {/* BOTTOM: Rating & Complaints */}
        {(isCompleted || isCancelled) && (
          <div className="mt-4 pt-4 border-t border-slate-50 flex flex-col gap-3">
             {isCompleted && (
               alreadyRated ? (
                 /* SUCCESS MESSAGE JAB RATING HO JAYE */
                 <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100/50 p-4 rounded-2xl animate-in fade-in zoom-in duration-500">
                    <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                      <PartyPopper size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Ratings Submitted</p>
                      <p className="text-[11px] font-bold text-emerald-600/80">Thanks for sharing your valuable feedback!</p>
                    </div>
                 </div>
               ) : (
                 <RatingBox bookingId={booking._id} />
               )
             )}
             <ComplaintBox bookingId={booking._id} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-600 border-amber-200",
    confirmed: "bg-blue-100 text-blue-600 border-blue-200",
    completed: "bg-emerald-100 text-emerald-600 border-emerald-200",
    cancelled: "bg-red-100 text-red-600 border-red-200",
  };
  return <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border tracking-tighter ${styles[status]}`}>{status === 'confirmed' ? 'Booked' : status}</span>;
}