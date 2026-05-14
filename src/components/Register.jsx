import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  const [night, setNight] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const toggleMode = () => {
    if (!night) {
      setShowForm(false);
      setNight(true);
      setTimeout(() => setShowForm(true), 1200);
    } else {
      setNight(false);
      setShowForm(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const pupilStyle = {
    width: 6,
    height: 6,
    background: "#000",
    borderRadius: "50%",
    position: "absolute",
    transform: `translate(${mouse.x * 4}px, ${mouse.y * 4}px)`,
    transition: "transform 0.1s",
  };

  const eyeStyle = {
    width: 14,
    height: blink ? 2 : 14,
    background: "yellow",
    borderRadius: "50%",
    position: "relative",
    overflow: "hidden",
    transition: "height 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #333",
  };

  const Eyes = () => (
    <>
      <div style={eyeStyle}>{!blink && <div style={pupilStyle}></div>}</div>
      <div style={eyeStyle}>{!blink && <div style={pupilStyle}></div>}</div>
    </>
  );

  const Dandelion = ({ left, height, scale, delay }) => (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left,
        transform: `translate(${mouse.x * 8}px, ${mouse.y * 4}px) scale(${scale})`,
        transformOrigin: "bottom center",
        transition: "transform 0.2s ease-out",
        animation: `float 4s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: night
            ? "radial-gradient(circle, #fff6b0 30%, #ffd700 70%)"
            : "radial-gradient(circle, #ffffff 30%, #f0f0f0 60%, #e8e8e8 80%)",
          boxShadow: night ? "0 0 20px #ffd700" : "0 0 10px rgba(255,255,255,0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
          margin: "0 auto",
        }}
      >
        <Eyes />
      </div>

      <div
        style={{
          width: 4,
          height,
          background: "#6b8e23",
          margin: "0 auto",
          borderRadius: 2,
        }}
      />
    </div>
  );

  const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  password: "",
  businessName: "",
  category: "",
  address: ""
});

  const handleChange = (e) => {
    const key = e.target.placeholder.replace(" ", "").toLowerCase();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { ...formData, role }
      );
      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
}
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div
        style={{
          height: "100vh",
          background: night ? "#000" : "#fafafa",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "0 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* TOGGLE */}
        <button
          onClick={toggleMode}
          style={{
            position: "absolute",
            top: 20,
            right: 30,
            padding: "8px 16px",
            borderRadius: 20,
            border: "none",
            cursor: "pointer",
            background: night ? "#222" : "#eee",
          }}
        >
          {night ? "Day ☀️" : "Night 🌙"}
        </button>

        {/* LEFT TEXT */}
        <div style={{ maxWidth: 400, zIndex: 2 }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              letterSpacing: "2px",
              fontFamily: "Poppins, sans-serif",
              color: night ? "#ffe066" : "#111",
              textShadow: night ? "0 0 15px #ffe066" : "none",
            }}
          >
            SMART APPOINTMENT
          </h1>

          <div style={{ display: "flex", alignItems: "center" }}>
            <p
              style={{
                fontSize: 22,
                fontFamily: "Poppins, sans-serif",
                color: night ? "#fff" : "#444",
                textShadow: night ? "0 0 12px white" : "none",
              }}
            >
              Your Time. Smarter.
            </p>

            {/* BULB */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: night ? "#ffe066" : "#ddd",
                boxShadow: night ? "0 0 40px #ffe066" : "none",
                marginLeft: 15,
                transition: "0.5s",
              }}
            />
          </div>
        </div>

        {/* PLANTS */}
        <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <Dandelion left="6%" height={120} scale={1} delay={0} />
          <Dandelion left="10%" height={140} scale={1.05} delay={0.5} />
          <Dandelion left="14%" height={110} scale={0.95} delay={1} />
          <Dandelion left="18%" height={150} scale={1.1} delay={1.5} />
          <Dandelion left="22%" height={130} scale={1} delay={2} />
          <Dandelion left="26%" height={115} scale={0.98} delay={2.5} />
          <Dandelion left="30%" height={135} scale={1.02} delay={3} />
        </div>

        {/* FORM */}
        {showForm && (
          <div
            style={{
              width: 420,
              background: night ? "#111" : "white",
              color: night ? "white" : "black",
              padding: 40,
              borderRadius: 16,
              boxShadow: night
                ? "0 0 25px #ffe066"
                : "0 4px 12px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginLeft: "400px",
              animation: night ? "fadeIn 0.8s ease" : "none",
            }}
          >
            <h2 style={{ textAlign: "center" }}>Create Account</h2>

            <input name="name" placeholder="Name" onChange={handleChange}/>
            <input name="email" placeholder="Email" onChange={handleChange}/>
            <input name="phone" placeholder="Phone" onChange={handleChange}/>
            <input name="password" placeholder="Password" type="password" onChange={handleChange}/>
            
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="sp">Service Provider</option>
            </select>
            
            {role === "sp" && (
              <input name="address" placeholder="Business Address" onChange={handleChange}/>
            )}
            {role === "sp" && (
             <>
    <input
      name="businessName"
      placeholder="Business Name"
      onChange={handleChange}
    />

    <select
  name="category"
  onChange={(e) =>
    setFormData({ ...formData, category: e.target.value })
  }
>
  <option value="">Select Category</option>
  <option value="Food">Food</option>
  <option value="Medical">Medical</option>
  <option value="Salon">Salon</option>
  <option value="Spa">Spa</option>
  <option value="Consultancy">Consultancy</option>
</select>
  </>
)}

            <button
              onClick={handleRegister}
              style={{
                padding: 12,
                background: "#ffe066",
                color: "black",
                border: "none",
                borderRadius: 6,
              }}
            >
              Register
            </button>

            <p style={{ textAlign: "center" }}>
              Already registered?{" "}
              <span
                style={{ color: "#ffe066", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Sign in
              </span>
            </p>
          </div>
        )}
      </div>
    </>
  );
}