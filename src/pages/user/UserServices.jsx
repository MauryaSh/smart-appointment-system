import { useEffect, useState } from "react";
import api from "../../utils/api";
import UserSidebar from "../../components/UserSidebar";
import { Search, MapPin, Star, Clock, Zap, ArrowRight, ShieldCheck, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function UserServices() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [address, setAddress] = useState("");
  
  useEffect(() => {
  const delay = setTimeout(() => {
    fetchServices();
  }, 400);

  return () => clearTimeout(delay);
}, [searchTerm, category, sort, address]);

const fetchServices = async () => {
  try {
    const params = {};

    if (searchTerm) params.search = searchTerm;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (address) params.address = address;

    const res = await api.get("/services/search", { params });

    setServices(res.data);
  } catch (err) {
    console.log("Error fetching services:", err);
  }
};
  
  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <UserSidebar />

      <div className="ml-64 w-full relative">
        {/* --- DARK HEADER SECTION --- */}
        <div className="bg-[#0f172a] p-10 pb-32">
          <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-white">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">Official Marketplace</p>
              </div>
              <h1 className="text-5xl font-black tracking-tight">
                Explore <span className="text-emerald-400">Services</span>
              </h1>
            </div>

            {/* SEARCH BAR GLASS UI */}
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Find a service..."
                className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-2xl"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-4 mt-6">

  {/* CATEGORY */}
  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="bg-slate-800 text-white border border-white/20 px-4 py-2 rounded-xl"
  >
    <option className="text-black" value="">All Categories</option>
    <option className="text-black" value="Medical">Medical</option>
    <option className="text-black" value="Spa">Spa</option>
    <option className="text-black" value="Saloon">Saloon</option>
    <option className="text-black" value="Food">Food</option>
    <option className="text-black" value="Consultancy">Consultancy</option>
  </select>

  {/* SORT */}
  <select
    value={sort}
    onChange={(e) => setSort(e.target.value)}
    className="bg-slate-800 text-white border border-white/20 px-4 py-2 rounded-xl"
  >
    <option className="text-black" value="">Sort</option>
    <option className="text-black" value="lowToHigh">Price: Low → High</option>
    <option className="text-black" value="highToLow">Price: High → Low</option>
    <option className="text-black" value="rating">Best Rated</option>
  </select>

  {/* ADDRESS */}
  <input
    type="text"
    placeholder="Search by address..."
    value={address}
    onChange={(e) => setAddress(e.target.value.trimStart())}
    className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl"
  />

</div>
          </header>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="px-10 -mt-20 max-w-7xl mx-auto pb-20 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service._id} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-800 rounded-[2.5rem] blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
                
                <div className="relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group-hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
                  
                  {/* Card Top: Service Icon & REAL Rating */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400 shadow-xl group-hover:rotate-6 transition-transform">
                      <Zap size={24} />
                    </div>
                    
                    {/* Dynamic Rating Logic */}
                    {service.rating ? (
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl border border-amber-100">
                        <Star size={12} className="fill-current" />
                        <span className="text-[11px] font-black">{service.rating.toFixed(1)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-100">
                        <PlusCircle size={12} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">New Service</span>
                      </div>
                    )}
                  </div>

                  {/* Service Info */}
                  <div className="mb-8 flex-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1 group-hover:text-emerald-600 transition-colors">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <MapPin size={14} className="text-slate-300" />
                      <span className="font-bold">By {service.spId?.name || "Independent Provider"}</span>
                    </div>
                  </div>

                  {/* Info Ribbon */}
                  <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl mb-8 border border-slate-100">
                    <div className="text-center flex-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Investment</p>
                      <p className="text-sm font-black text-slate-900 italic">₹{service.price}</p>
                    </div>
                    <div className="h-6 w-[1px] bg-slate-200"></div>
                    <div className="text-center flex-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Timeline</p>
                      <div className="flex items-center justify-center gap-1 text-sm font-black text-slate-900">
                        <Clock size={12} className="text-slate-400" /> {service.duration}m
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTON */}
                  <button
                    onClick={() => { navigate(`/slots/${service._id}`);}}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#0f172a] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-emerald-500 transition-all shadow-lg active:scale-95 group-hover:shadow-emerald-200/50 shadow-slate-200"
                  >
                    Check Availability <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}