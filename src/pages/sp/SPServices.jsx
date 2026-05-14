import { useState, useEffect } from "react";
import api from "../../utils/api";
import SPSidebar from "../../components/SPSidebar";
import { Plus, Edit3, Trash2, Clock, Layers, IndianRupee, Timer, Users, ChevronRight, ChevronLeft, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SPServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    serviceName: "",
    category: "",
    price: "",
    duration: "",
    maxCustomersPerSlot: "",
    schedulingType: "continuous",
    slotDuration: ""
  });

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(6); // Engineers love even numbers for grids
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services/my-services", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(res.data);
    } catch (err) {
      console.log("Fetch services error:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addService = async () => {
    try {
      const payload = {
        name: form.serviceName,
        category: form.category,
        price: form.price,
        duration: form.duration,
        maxCustomers: form.maxCustomersPerSlot,
        schedulingType: form.schedulingType,
        slotDuration: form.schedulingType === "slot" ? form.slotDuration : null
      };
      await api.post("/services/add", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Service Added");
      resetForm();
      fetchServices();
    } catch (err) {
      alert("Service creation failed");
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await api.delete(`/services/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // If deleting last item on page, go back
      if (currentServices.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
      fetchServices();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  const editService = (service) => {
    setForm({
      _id: service._id,
      serviceName: service.name,
      category: service.category,
      price: service.price,
      duration: service.duration,
      maxCustomersPerSlot: service.maxCustomers,
      schedulingType: service.schedulingType,
      slotDuration: service.slotDuration
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Engineer UX: Scroll to form
  };

  const updateService = async () => {
    try {
      const payload = {
        name: form.serviceName,
        category: form.category,
        price: form.price,
        duration: form.duration,
        maxCustomers: form.maxCustomersPerSlot,
        schedulingType: form.schedulingType,
        slotDuration: form.schedulingType === "slot" ? form.slotDuration : null
      };
      await api.put(`/services/update/${form._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Service Updated");
      resetForm();
      fetchServices();
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  const resetForm = () => {
    setForm({
      serviceName: "",
      category: "",
      price: "",
      duration: "",
      maxCustomersPerSlot: "",
      schedulingType: "continuous",
      slotDuration: ""
    });
  };

  // PAGINATION LOGIC
  const indexOfLast = currentPage * servicesPerPage;
  const indexOfFirst = indexOfLast - servicesPerPage;
  const currentServices = services.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(services.length / servicesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex bg-[#fcfdfe] min-h-screen text-slate-800 font-sans">
      <SPSidebar />

      <div className="ml-64 w-full p-10 bg-gradient-to-br from-slate-50 via-white to-white">
        
        {/* HEADER */}
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Layers className="text-emerald-500" size={36} /> Service Registry
            </h1>
            <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em] ml-1">Configuring {services.length} active modules</p>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-xs font-bold text-slate-500">
             PAGE: {currentPage} / {totalPages || 1}
          </div>
        </header>

        {/* --- FORM SECTION --- */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_1px_3px_rgba(0,0,0,0.02),0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100 p-10 mb-12 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"></div>
          
          <h2 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-8 flex items-center gap-2">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             {form._id ? "Modification Mode" : "New Service Entry"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InputField label="Service Identity" name="serviceName" value={form.serviceName} onChange={handleChange} placeholder="Consultation" icon={<Layers size={14}/>}/>
            
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1.5"><Filter size={14}/> Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-400 transition-all cursor-pointer">
                <option value="">Select Category</option>
                <option value="Medical">Medical</option>
                <option value="Spa">Spa</option>
                <option value="Saloon">Saloon</option>
                <option value="Food">Food</option>
                <option value="Consultancy">Consultancy</option>
              </select>
            </div>

            <InputField label="Unit Price (₹)" name="price" type="number" value={form.price} onChange={handleChange} placeholder="500" icon={<IndianRupee size={14}/>}/>
            <InputField label="Base Duration (Min)" name="duration" type="number" value={form.duration} onChange={handleChange} placeholder="30" icon={<Timer size={14}/>}/>
            
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1.5"><Clock size={14}/> Scheduling Logic</label>
              <select name="schedulingType" value={form.schedulingType} onChange={handleChange} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-400 transition-all cursor-pointer">
                <option value="continuous">Continuous Flow</option>
                <option value="slot">Slot Based System</option>
              </select>
            </div>

            <InputField label="Capacity Limit" name="maxCustomersPerSlot" type="number" value={form.maxCustomersPerSlot} onChange={handleChange} placeholder="10" icon={<Users size={14}/>}/>

            {form.schedulingType === "slot" && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <InputField label="Slot Interval (Min)" name="slotDuration" type="number" value={form.slotDuration} onChange={handleChange} placeholder="15" icon={<Clock size={14}/>}/>
              </div>
            )}
          </div>

          <div className="mt-10 flex gap-4 pt-8 border-t border-slate-50">
            <button onClick={form._id ? updateService : addService} className="bg-[#0f172a] hover:bg-emerald-600 text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center gap-3 active:scale-95">
              {form._id ? <Edit3 size={18}/> : <Plus size={18}/>}
              {form._id ? "Commit Updates" : "Deploy Service"}
            </button>
            {form._id && (
              <button onClick={resetForm} className="bg-white border border-slate-200 text-slate-500 font-black py-4 px-10 rounded-2xl hover:bg-slate-50 transition-all">
                Abort
              </button>
            )}
          </div>
        </div>

        {/* --- TABLE SECTION --- */}
<div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-slate-200/60 overflow-hidden transition-all duration-500 hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)]">
  <table className="w-full text-left border-collapse">
    {/* 1. HEADER SECTION (DARK CONSOLE STYLE) */}
    <thead className="bg-[#0f172a] text-white/50 border-b border-slate-800">
      <tr>
        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em]">
          <span className="flex items-center gap-2 border-l-2 border-emerald-500 pl-3 text-white">
            <Layers size={12} className="text-emerald-400" /> System_Service
          </span>
        </th>
        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-center">
           <span className="inline-block border-b border-emerald-500/50 pb-1 text-white/80">Specifications</span>
        </th>
        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-white/80">
           Value_Metric
        </th>
        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-right pr-14 text-white/80">
           Operations
        </th>
      </tr>
    </thead>

    {/* 2. BODY SECTION (CLEAN & SPACIOUS) */}
    <tbody className="divide-y divide-slate-100">
      {currentServices.map((s) => (
        <tr key={s._id} className="group hover:bg-slate-50/80 transition-all duration-300">
          
          {/* SERVICE CELL */}
          <td className="px-10 py-7 border-r border-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-emerald-400 shadow-xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                <Layers size={20} />
              </div>
              <div>
                <p className="text-slate-900 font-black text-[15px] tracking-tight group-hover:text-emerald-600 transition-colors">{s.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                   <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{s.category}</span>
                   <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></span>
                </div>
              </div>
            </div>
          </td>

          {/* SPECS CELL */}
          <td className="px-10 py-7 border-r border-slate-50/50 bg-slate-50/30 group-hover:bg-transparent transition-colors">
             <div className="flex justify-center items-center gap-6">
                <div className="text-center">
                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Cycle</p>
                   <p className="text-xs font-black text-slate-800">{s.duration}m</p>
                </div>
                <div className="h-8 w-[1px] bg-slate-200 rotate-12"></div>
                <div className="text-center">
                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Capacity</p>
                   <p className="text-xs font-black text-slate-800">{s.maxCustomers}p</p>
                </div>
             </div>
          </td>

          {/* PRICE CELL */}
          <td className="px-10 py-7">
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 font-mono italic tracking-tighter">
                ₹{s.price}
              </span>
              <span className="text-[8px] text-emerald-500 font-black uppercase tracking-[0.2em] leading-none">Verified_Price</span>
            </div>
          </td>

          {/* ACTIONS CELL */}
          <td className="px-10 py-7 text-right">
            <div className="flex justify-end items-center gap-2 opacity-40 group-hover:opacity-100 transition-all duration-300">
               <button onClick={() => editService(s)} className="p-2.5 text-slate-500 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all">
                  <Edit3 size={16} />
               </button>
               <button onClick={() => deleteService(s._id)} className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={16} />
               </button>
               <button 
                 onClick={() => { localStorage.setItem("selectedService", s._id); navigate("/sp/shifts"); }}
                 className="ml-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg active:scale-95"
               >
                 Configure
               </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* 3. PAGINATION ENGINE (Sleek & Professional) */}
  <div className="flex flex-col md:flex-row justify-between items-center px-10 py-8 bg-slate-50/50 border-t border-slate-100 gap-6">
    
    {/* PAGINATION STATUS */}
    <div className="flex flex-col">
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Navigation_System</div>
      <div className="text-xs font-bold text-slate-600">
        Displaying <span className="text-emerald-600 px-1">{indexOfFirst + 1} - {Math.min(indexOfLast, services.length)}</span> 
        of <span className="text-slate-900 ml-1">{services.length}</span> Modules
      </div>
    </div>

    {/* PAGINATION CONTROLS */}
    <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
      <button 
        disabled={currentPage === 1} 
        onClick={() => setCurrentPage(prev => prev - 1)} 
        className="flex items-center justify-center w-10 h-10 bg-white text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all disabled:opacity-20 disabled:hover:bg-transparent"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex gap-1 mx-3">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-9 h-9 rounded-xl font-black text-[11px] transition-all duration-300 ${
              currentPage === i + 1 
              ? "bg-[#0f172a] text-white shadow-xl scale-110" 
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            }`}
          >
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </div>

      <button 
        disabled={currentPage === totalPages || totalPages === 0} 
        onClick={() => setCurrentPage(prev => prev + 1)} 
        className="flex items-center justify-center w-10 h-10 bg-white text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all disabled:opacity-20 disabled:hover:bg-transparent"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  </div>
</div>
      </div>
    </div>
  );
}

// COMPONENT: InputField (Engineering Standard)
function InputField({ label, icon, ...props }) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[11px] font-black text-slate-400 uppercase ml-1 flex items-center gap-2 group-focus-within:text-emerald-600 transition-colors">
        {icon} {label}
      </label>
      <input 
        {...props} 
        className="bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none font-bold text-slate-800 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-400 focus:bg-white transition-all shadow-sm" 
      />
    </div>
  );
}

// COMPONENT: ActionBtn
function ActionBtn({ onClick, icon, color, label }) {
  return (
    <button 
        onClick={onClick} 
        className={`px-4 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-2 font-black text-[10px] uppercase tracking-tighter border border-transparent ${color}`}
    >
      {icon} <span>{label}</span>
    </button>
  );
}