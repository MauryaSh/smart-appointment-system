import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Layers, 
  CalendarCheck, 
  UserCircle, 
  LogOut,
  Zap 
} from "lucide-react";

export default function UserSidebar() {
  const menu = [
    { name: "Dashboard", path: "/user/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Services", path: "/services", icon: <Layers size={20} /> },
    { name: "My Bookings", path: "/my-bookings", icon: <CalendarCheck size={20} /> },
    { name: "Profile", path: "/user/profile", icon: <UserCircle size={20} /> }
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#0f172a] text-white p-6 flex flex-col border-r border-white/5 shadow-2xl z-50">
      
      {/* BRAND LOGO */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
          <Zap size={22} className="text-white fill-current" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tighter leading-none">SMART<span className="text-emerald-400">BOOK</span></h2>
          <p className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.2em] mt-1">User Console</p>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 space-y-2">
        {menu.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) => `
              group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden
              ${isActive 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-emerald-500 rounded-r-full shadow-[4px_0_15px_rgba(16,185,129,0.6)]"></div>
                )}
                
                <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-white"}`}>
                  {item.icon}
                </span>
                
                <span className="text-sm font-black tracking-wide uppercase text-[11px]">
                  {item.name}
                </span>

                {/* Glass Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* USER INFO & LOGOUT */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="group flex items-center justify-between w-full px-5 py-4 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/10 rounded-2xl transition-all duration-300 shadow-lg active:scale-95"
        >
          <span className="text-[11px] font-black uppercase tracking-widest">Terminate Session</span>
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        <div className="mt-6 px-2 flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center font-black text-xs text-emerald-400 uppercase">
             {localStorage.getItem("userName")?.charAt(0) || "U"}
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-white uppercase tracking-tight truncate w-32">
                {localStorage.getItem("userName") || "User Profile"}
              </span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Now</span>
           </div>
        </div>
      </div>
    </div>
  );
}