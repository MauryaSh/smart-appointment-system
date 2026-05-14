import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [bulbOn, setBulbOn] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    const move = (e) => {
      setMouse({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleLogin = async () => {
  setLoading(true);
  try {
    const res = await api.post("/auth/login", { email, password });

    console.log("FULL RESPONSE:", res.data);
    console.log("ROLE VALUE:", res.data.user.role); // 🔥 IMPORTANT

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.user.id);
    localStorage.setItem("userName", res.data.user.name);

    const role = res.data.user.role;
    localStorage.setItem("role", role);

    console.log("Stored Role:", localStorage.getItem("role")); // 🔥

    alert(res.data.message);
    setLoading(false);

    if (role === "manager") {
      navigate("/manager/dashboard");
    } else if (role === "sp") {
      navigate("/sp/dashboard");
    } else {
      navigate("/user/dashboard");
    }

  } catch (err) {
    setLoading(false);
    alert(err.response?.data?.message || "Login failed");
  }
};

  const pupilStyle = {
    width: "10px",
    height: "10px",
    background: "#5a2d0c",
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%) translate(${mouse.x * 6}px, ${
      mouse.y * 6
    }px)`,
    transition: "0.3s",
  };

  const eyeWhite = {
    width: 22,
    height: 22,
    background: "white",
    borderRadius: "50%",
    position: "relative",
    overflow: "hidden",
  };

  const Eyes = () => (
    <>
      <div style={eyeWhite}>
        <div style={pupilStyle}></div>
      </div>
      <div style={eyeWhite}>
        <div style={pupilStyle}></div>
      </div>
    </>
  );

  const Mouth = () => (
    <div
      style={{
        position: "absolute",
        bottom: "18%",
        width: "30px",
        height: "15px",
        borderBottom: "3px solid white",
        borderRadius: "0 0 20px 20px",
      }}
    ></div>
  );

  return (
    <>
      <style>{`
        @keyframes bulbFall {
          0% { transform: translateY(-300px); }
          80% { transform: translateY(0); }
          90% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }
        @keyframes swing {
          0% { transform: rotate(4deg); }
          50% { transform: rotate(-4deg); }
          100% { transform: rotate(4deg); }
        }
        @keyframes glow {
          from { filter: brightness(0.8); }
          to { filter: brightness(1.4); }
        }
        @keyframes boxAppear {
          from { opacity:0; transform: translateY(50px); }
          to { opacity:1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          height: "100vh",
          width: "100%",
          background: "black",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!bulbOn && (
          <div
            style={{
              position: "absolute",
              top: "120px",
              left: "70%",
              transform: "translateX(-50%)",
              color: "#ffd27f",
              fontSize: "18px",
              textShadow: "0 0 10px #ffb347",
              animation: "glow 1.5s infinite alternate",
            }}
          >
            ✨ Click the bulb to login ✨
          </div>
        )}

        {/* BULB */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "70%",
            animation: "bulbFall 2s ease-out forwards",
          }}
        >
          <div
            style={{
              transformOrigin: "top",
              animation: "swing 3s ease-in-out infinite",
              cursor: "pointer",
            }}
            onClick={() => {
              setBulbOn(true);
              setTimeout(() => setShowBox(true), 800);
            }}
          >
            <div
              style={{
                width: "6px",
                height: "160px",
                background: "#ffd27f",
                margin: "0 auto",
              }}
            ></div>

            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: bulbOn ? "#ffb347" : "#333",
                boxShadow: bulbOn
                  ? "0 0 60px #ffb347, 0 0 140px rgba(255,210,127,1)"
                  : "none",
                animation: bulbOn ? "glow 2s infinite alternate" : "none",
              }}
            ></div>
          </div>
        </div>

        {/* SHAPES */}
        <div style={{ width: "50%", position: "relative", height: "100%" }}>
          {[
            { bg: "#3498db", w: 160, h: 140, t: "40%", l: "20%", m: 30 },
            { bg: "#f1c40f", w: 120, h: 200, t: "30%", l: "40%", m: 40 },
            { bg: "#9b59b6", w: 140, h: 140, t: "55%", l: "35%", m: 50, r: "50%" },
            { bg: "#e74c3c", w: 140, h: 150, t: "45%", l: "55%", m: 60 },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: s.w,
                height: s.h,
                background: s.bg,
                borderRadius: s.r || "8px",
                boxShadow: `0 0 40px ${s.bg}`,
                top: s.t,
                left: s.l,
                transform: `translate(${mouse.x * s.m}px,${mouse.y * s.m}px)`,
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <Eyes />
              </div>

              {bulbOn && <Mouth />}
            </div>
          ))}
        </div>

        {/* LOGIN BOX */}
        {showBox && (
          <div
            style={{
            width:"420px",
            background:"rgba(255,255,255,0.1)",
            backdropFilter:"blur(10px)",
            border:"1px solid rgba(255,255,255,0.2)",
            padding:"40px",
            borderRadius:"16px",
            boxShadow:"0 0 30px rgba(255,210,127,0.6)",
            display:"flex",
            flexDirection:"column",
            gap:"16px",
            animation:"boxAppear 1s forwards",
            color:"white"
              }}
          >
            <h2 style={{ textAlign: "center" }}>Login</h2>

            <input
              placeholder="📧 Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              onKeyDown={(e)=>{
              if(e.key==="Enter"){
              handleLogin()
              }
            }}
            />
            <div style={{ position: "relative" }}>
            <input
              placeholder="🔒 Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", paddingRight: "35px" }}
            />

            <span
             onClick={() => setShowPassword(!showPassword)}
             style={{
             position: "absolute",
             right: "10px",
             top: "8px",
             cursor: "pointer",
             fontSize: "18px"
            }}
            >
            👁️
           </span>
          </div>

            <button
              onClick={handleLogin}
              style={{
              padding:"10px",
              background:"black",
              color:"white",
              border:"none",
              borderRadius:"5px"
              }}
              >
              {loading ? "Logging in..." : "Login"}
            </button> 

            <p style={{ textAlign: "center" }}>
              Don’t have an account?{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Register
              </span>
            </p>
          </div>
        )}
      </div>
    </>
  );
}