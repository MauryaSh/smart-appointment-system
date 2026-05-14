import { useEffect, useState } from "react";
import api from "../../utils/api";
import SPSidebar from "../../components/SPSidebar";
import { Clock, Calendar, AlertCircle, RotateCcw, Ban, CheckCircle2, History, MapPin } from "lucide-react";

export default function Routine() {
  const [shifts, setShifts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const res = await api.get("/shifts/my-shifts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShifts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelShift = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this shift?")) return;
    try {
      await api.put(`/shifts/cancel/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchShifts();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex bg-[#f8fafc] min-h-screen text-slate-800 font-sans">
      <SPSidebar />

      <div className="ml-64 w-full p-10 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        
        {/* HEADER SECTION */}
        <header className="mb-12 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-1 bg-emerald-500 rounded-full"></div>
                <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">Work Schedule</p>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Routine</span>
            </h1>
          </div>
          
          <button 
            onClick={fetchShifts}
            className="group flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:border-emerald-500 hover:text-emerald-500 transition-all active:scale-95"
          >
            <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> 
            Sync Schedule
          </button>
        </header>

        {/* SHIFTS GRID */}
        {shifts.length === 0 ? (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 p-24 flex flex-col items-center justify-center text-center">
            <div className="bg-emerald-50 p-8 rounded-full mb-6">
              <History size={48} className="text-emerald-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-400">Your routine is empty</h3>
            <p className="text-slate-400 mt-2 font-medium max-w-xs">Looks like you haven't scheduled any shifts for this week yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {shifts.map((shift) => (
              <div 
                key={shift._id} 
                className={`group relative bg-white rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${
                  shift.status === "cancelled" 
                  ? "border-slate-100 opacity-75" 
                  : "border-white shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(16,185,129,0.1)] hover:border-emerald-100 hover:-translate-y-2"
                }`}
              >
                {/* Top Status Banner */}
                <div className={`h-2 w-full ${shift.status === 'active' ? 'bg-emerald-400' : 'bg-red-300'}`}></div>

                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                            shift.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-red-50 text-red-500'
                        }`}>
                            {shift.status}
                        </span>
                        <div className="text-slate-300 group-hover:text-emerald-200 transition-colors">
                            {shift.status === 'active' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        </div>
                    </div>

                    {/* Service Name Highlight */}
                    <div className="mb-4">
                        <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1 opacity-80">Service</h3>
                        <h2 className="text-xl font-black text-slate-800 leading-tight">
                            {shift.serviceId?.name || "Service Unspecified"}
                        </h2>
                    </div>

                    <hr className="border-slate-50 my-5" />

                    {/* Date & Time with better spacing */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Scheduled Date</p>
                                <p className="font-bold text-slate-700">
                                    {new Date(shift.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                <Clock size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Time Window</p>
                                <p className="font-bold text-slate-700">
                                    {shift.startTime} <span className="text-slate-300 mx-1">—</span> {shift.endTime}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    {shift.status === "active" ? (
                    <button 
                        onClick={() => cancelShift(shift._id)}
                        className="w-full py-4 bg-slate-900 hover:bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200 hover:shadow-red-200 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Ban size={14} /> Terminate Shift
                    </button>
                    ) : (
                    <div className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-center border border-slate-100">
                        Shift Cancelled
                    </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Tip */}
        <p className="mt-16 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
            © Managed Schedule System
        </p>
      </div>
    </div>
  );
}