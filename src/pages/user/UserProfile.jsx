import { useEffect, useState } from "react";
import api from "../../utils/api";
import UserSidebar from "../../components/UserSidebar";
import { Camera, Lock, User, Mail, Phone, AlertCircle, Save, ShieldCheck } from "lucide-react";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!image) return alert("Please select an image first");
    const formData = new FormData();
    formData.append("image", image);

    try {
      await api.post("/auth/upload-profile", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Profile picture updated!");
      fetchProfile();
    } catch (err) {
      alert("Upload failed");
    }
  };

  const changePassword = async () => {
    try {
      await api.post("/auth/change-password", password, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Password updated successfully");
      setPassword({ oldPassword: "", newPassword: "" });
    } catch (err) {
      alert("Error updating password");
    }
  };

  if (!user) return (
    <div className="flex h-screen items-center justify-center bg-[#0f172a] text-emerald-400">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-400"></div>
    </div>
  );

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <UserSidebar />

      <div className="ml-64 w-full relative">
        {/* --- DARK HEADER SECTION --- */}
        <div className="bg-[#0f172a] p-10 pb-32">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">Account Settings</p>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-white">
              My <span className="text-emerald-400">Profile</span>
            </h1>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="px-10 -mt-20 max-w-5xl mx-auto pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: AVATAR CARD */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] text-center">
                <div className="relative group w-32 h-32 mx-auto mb-6">
                  <img
                    src={preview || `http://localhost:5000/uploads/${user.profileImage}`}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-3xl border-4 border-slate-50 shadow-lg group-hover:opacity-75 transition-opacity"
                  />
                  <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <div className="bg-emerald-500 p-3 rounded-full text-white shadow-xl">
                      <Camera size={20} />
                    </div>
                    <input type="file" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
                
                <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
                <p className="text-slate-400 text-sm mb-6">{user.email}</p>
                
                <button 
                  onClick={uploadImage}
                  className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md"
                >
                  Save New Photo
                </button>
              </div>

              {/* STATS/COMPLAINTS MINI CARD */}
              <div className="mt-6 bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-600/60 uppercase tracking-widest">Active Complaints</p>
                  <p className="text-2xl font-black text-amber-700">{user.complaints || 0}</p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DETAILS & SECURITY */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* PERSONAL INFO */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3 mb-8">
                  <User className="text-emerald-500" size={24} />
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Personal Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Full Name</label>
                    <div className="relative">
                      <input disabled value={user.name} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-600 focus:outline-none cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Email Address</label>
                    <input disabled value={user.email} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-600 focus:outline-none cursor-not-allowed" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Phone Number</label>
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5">
                      <Phone size={16} className="text-slate-400 mr-3" />
                      <span className="text-slate-600 font-bold">{user.phone || "Not provided"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECURITY SECTION */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3 mb-8">
                  <Lock className="text-emerald-500" size={24} />
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Security</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                      onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
                      value={password.oldPassword}
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                      onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                      value={password.newPassword}
                    />
                  </div>
                  <button 
                    onClick={changePassword}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-lg active:scale-95"
                  >
                    <Save size={16} /> Update Password
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}