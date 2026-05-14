import { useState, useEffect } from "react";
import api from "../../utils/api";
import SPSidebar from "../../components/SPSidebar";
import { 
  Clock, Calendar, PlusCircle, Trash2, Copy,
  AlertTriangle, Save, Info, Zap
} from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const weekends = ["Saturday", "Sunday"];

export default function Shifts() {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [activeTab, setActiveTab] = useState("weekly");

  const [weekly, setWeekly] = useState(
    days.reduce((acc, d) => {
      acc[d] = [{ startTime: "", endTime: "" }];
      return acc;
    }, {})
  );

  const [overrideDate, setOverrideDate] = useState("");
  const [overrideShifts, setOverrideShifts] = useState([{ startTime: "", endTime: "" }]);
  const [isCancelled, setIsCancelled] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchServices();
    const selected = localStorage.getItem("selectedService");
    if (selected) setServiceId(selected);
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services/my-services", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(res.data);
    } catch (err) { console.log(err); }
  };

  // ================= WEEKLY LOGIC =================
  const handleShiftChange = (day, index, field, value) => {
    const updated = [...weekly[day]];
    updated[index][field] = value;
    setWeekly({ ...weekly, [day]: updated });
  };

  const addShift = (day) => {
    setWeekly({ ...weekly, [day]: [...weekly[day], { startTime: "", endTime: "" }] });
  };

  const removeShift = (day, index) => {
    const updated = weekly[day].filter((_, i) => i !== index);
    setWeekly({ ...weekly, [day]: updated });
  };

  const copyTemplate = (sourceDay, targetDays) => {
    const template = JSON.parse(JSON.stringify(weekly[sourceDay]));
    const updated = { ...weekly };
    targetDays.forEach(day => { updated[day] = template; });
    setWeekly(updated);
  };

  const saveWeekly = async () => {
    try {
      await api.post("/schedule/weekly", { serviceId, weekly }, { headers: { Authorization: `Bearer ${token}` } });
      alert("✅ Weekly schedule secured.");
    } catch (err) { alert("Error saving weekly"); }
  };

  // ================= OVERRIDE LOGIC =================
  const handleOverrideChange = (i, field, value) => {
    const updated = [...overrideShifts];
    updated[i][field] = value;
    setOverrideShifts(updated);
  };

  const addOverrideShift = () => {
    setOverrideShifts([...overrideShifts, { startTime: "", endTime: "" }]);
  };

  const removeOverrideShift = (i) => {
    setOverrideShifts(overrideShifts.filter((_, idx) => idx !== i));
  };

  const saveOverride = async () => {
    try {
      await api.post("/schedule/override", {
        serviceId,
        date: overrideDate,
        shifts: isCancelled ? [] : overrideShifts,
        isCancelled
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("🔥 Override saved!");
    } catch (err) { alert("Override failed"); }
  };

  return (
    <div className="flex bg-white min-h-screen text-slate-800 font-sans">
      <SPSidebar />

      <div className="ml-64 w-full p-10">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">
              Shift <span className="text-emerald-500">Control</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">
              System Operations Hub
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-2 rounded-2xl shadow-sm">
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="bg-transparent text-slate-700 font-bold text-sm px-4 py-1 outline-none cursor-pointer min-w-[200px]"
            >
              <option>Select Service</option>
              {services.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
        </header>

        {/* TAB NAVIGATION */}
        <div className="flex gap-2 mb-8 bg-slate-100/50 p-1.5 rounded-2xl w-fit border border-slate-100">
          <button 
            onClick={() => setActiveTab("weekly")}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'weekly' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Weekly Routine
          </button>
          <button 
            onClick={() => setActiveTab("override")}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'override' ? 'bg-white text-rose-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Emergency Override
          </button>
        </div>

        {activeTab === "weekly" ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {days.map(day => (
                <div key={day} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-emerald-500/20 transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-800">{day}</h3>
                    <div className="flex gap-1">
                      <button onClick={() => copyTemplate(day, days)} className="p-2 hover:bg-emerald-50 text-slate-300 hover:text-emerald-500 rounded-lg transition-all" title="Copy to All">
                        <Copy size={12} />
                      </button>
                      <button onClick={() => copyTemplate(day, weekdays)} className="px-2 py-1 bg-slate-50 text-[8px] font-black text-slate-400 hover:bg-slate-900 hover:text-white rounded-md transition-all">WD</button>
                      <button onClick={() => copyTemplate(day, weekends)} className="px-2 py-1 bg-slate-50 text-[8px] font-black text-slate-400 hover:bg-slate-900 hover:text-white rounded-md transition-all">WE</button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 font-mono">
                    {weekly[day].map((shift, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                        <Clock size={12} className="text-slate-400" />
                        <div className="flex items-center gap-2 flex-1 text-[11px] font-bold text-slate-600">
                          <input type="time" value={shift.startTime} onChange={(e) => handleShiftChange(day, i, "startTime", e.target.value)} className="bg-transparent outline-none focus:text-emerald-500 w-full" />
                          <span className="text-slate-300">—</span>
                          <input type="time" value={shift.endTime} onChange={(e) => handleShiftChange(day, i, "endTime", e.target.value)} className="bg-transparent outline-none focus:text-emerald-500 w-full" />
                        </div>
                        <button onClick={() => removeShift(day, i)} className="text-slate-300 hover:text-rose-500 p-1"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => addShift(day)} className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2">
                    <PlusCircle size={14} /> Add Slot
                  </button>
                </div>
              ))}
            </div>

            {/* LEGEND SECTION */}
            <div className="mt-8 flex gap-6 px-2 border-t border-slate-50 pt-8">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-slate-900 text-[8px] font-black text-white rounded-md">WD</span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekdays (Mon-Fri)</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-slate-900 text-[8px] font-black text-white rounded-md">WE</span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekends (Sat-Sun)</p>
              </div>
            </div>

            <button onClick={saveWeekly} className="fixed bottom-10 right-10 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 z-50">
              <Save size={18} /> Deploy Weekly Routine
            </button>
          </div>
        ) : (
          /* OVERRIDE CONTENT */
          <div className="max-w-xl bg-white border border-slate-100 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-10 text-rose-500">
              <div className="bg-rose-50 p-4 rounded-2xl"><AlertTriangle size={32} /></div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Custom Override</h2>
                <p className="text-[10px] font-bold uppercase text-slate-400 mt-2">Modify specific dates</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Date</p>
                <input type="date" value={overrideDate} onChange={(e) => setOverrideDate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-slate-800 font-bold outline-none focus:ring-2 focus:ring-rose-500/10 transition-all" />
              </div>

              <label className={`flex items-center justify-between p-6 rounded-3xl border transition-all cursor-pointer ${isCancelled ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isCancelled ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-400'}`}><Zap size={18}/></div>
                  <div>
                    <p className="font-black text-slate-900 text-xs uppercase tracking-widest leading-none">Full Day Off</p>
                    <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">Disable all bookings for this date</p>
                  </div>
                </div>
                <input type="checkbox" checked={isCancelled} onChange={(e) => setIsCancelled(e.target.checked)} className="w-6 h-6 rounded-lg accent-rose-500 cursor-pointer" />
              </label>

              {!isCancelled && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Override Shifts</p>
                    <button onClick={addOverrideShift} className="text-rose-500 font-black text-[9px] uppercase tracking-widest flex items-center gap-1 hover:underline underline-offset-4"><PlusCircle size={12} /> Add Slot</button>
                  </div>
                  {overrideShifts.map((s, i) => (
                    <div key={i} className="flex gap-3 animate-in zoom-in-95 duration-200">
                      <div className="flex-1 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-xs">
                        <input type="time" value={s.startTime} onChange={(e) => handleOverrideChange(i, "startTime", e.target.value)} className="bg-transparent outline-none text-rose-600 font-bold" />
                        <input type="time" value={s.endTime} onChange={(e) => handleOverrideChange(i, "endTime", e.target.value)} className="bg-transparent outline-none text-rose-600 font-bold" />
                      </div>
                      <button onClick={() => removeOverrideShift(i)} className="text-slate-300 hover:text-rose-500 p-2"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={saveOverride} className="w-full bg-rose-500 hover:bg-rose-600 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-rose-500/20 transition-all active:scale-95">
                Apply Date Override
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 flex items-center gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-100 w-fit max-w-xl">
          <Info size={14} className="text-slate-400 shrink-0" />
          <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed tracking-tight">
            Pro-Tip: <span className="text-slate-900">Overrides are high-priority.</span> Logic applies overrides first, then weekly routine.
          </p>
        </div>
      </div>
    </div>
  );
}