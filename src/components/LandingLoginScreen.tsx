import React, { useState, useEffect } from "react";
import { Lock, Mail, Eye, EyeOff, Check, ShieldCheck, Sliders, AlertCircle, TrendingUp, Cpu, CheckCircle2, Layers } from "lucide-react";
import { useProject } from "@/lib/store";

export function LandingLoginScreen() {
  const login = useProject((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(true);
  const [interactiveWaterLevel, setInteractiveWaterLevel] = useState(2.8);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const isEmailCorrect = email.trim() === "str.design.test";
  const isPasswordCorrect = password === "123!test";
  const isReadyToLogin = isEmailCorrect && isPasswordCorrect;

  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        const loginEmail = email.trim() === "" ? "str.design.test" : email.trim();
        const loginPass = password.trim() === "" ? "123!test" : password;
        login(loginEmail, loginPass);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert, email, password, login]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const loginEmail = email.trim() === "" ? "str.design.test" : email.trim();
    const loginPass = password.trim() === "" ? "123!test" : password;
    
    if (loginEmail !== "str.design.test") {
      setError("Incorrect email. Default is: str.design.test");
      return;
    }
    if (loginPass !== "123!test") {
      setError("Wrong password. Default is: 123!test");
      return;
    }

    // Trigger Success Alert modal first as requested
    setShowSuccessAlert(true);
  };

  return (
    <div className="min-h-dvh w-full bg-[#07111f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Blueprint grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#16263d_1px,transparent_1px),linear-gradient(to_bottom,#16263d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-45 pointer-events-none" />

      {/* TOP HEADER: Clean Structural Design Platform Title & Verification Bar */}
      <header className="relative z-20 w-full border-b border-[#1e3a5f]/80 bg-[#060e1a]/95 backdrop-blur-md px-6 sm:px-10 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Layers className="size-4" />
          </div>
          <div>
            <h1 className="font-display text-lg sm:text-xl font-bold tracking-wider text-cyan-400 uppercase">
              STRUCTURAL DESIGN PLATFORM
            </h1>
            <p className="text-[11px] font-mono text-slate-400">
              Integrated Geotechnical & Structural Engineering Analysis Suite
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 text-xs font-mono">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>EUROCODE VERIFIED PLATFORM</span>
          </div>
        </div>
      </header>

      {/* MAIN TWO-PANE VIEW SPLIT BY CONTINUOUS VERTICAL GRID SEPARATOR */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-stretch">
        {/* LEFT VIEW PANEL: Clean Interactive Structural Engineering Simulation View */}
        <div className="flex-1 lg:w-[58%] xl:w-[60%] flex flex-col justify-center items-center p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#1e3a5f] bg-[#060e18]/70 backdrop-blur-sm relative">
          {/* Subtle grid line coordinate marker on the divider */}
          <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 flex-col items-center gap-1 py-2 px-1 bg-[#07111f] border border-[#1e3a5f] rounded text-[9px] font-mono text-cyan-500/70 shadow">
            <span>G</span>
            <span>R</span>
            <span>I</span>
            <span>D</span>
          </div>

          {/* LEFT CARD: Exact height match to Right Card */}
          <div className="w-full max-w-2xl bg-[#040910]/95 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(6,182,212,0.1)] h-[530px]">
            {/* Top telemetry bar */}
            <div className="flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-cyan-900/60 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-cyan-400" />
                <span>MODEL: FLOOD EMBANKMENT WALL (H = 4.50m)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  <span>utilization: 78.4% (PASS)</span>
                </span>
              </div>
            </div>

            {/* SVG Engineering Cross-Section Graphic */}
            <div className="relative flex-1 flex items-center justify-center py-2 min-h-[300px]">
              <svg className="w-full h-full max-w-[480px]" viewBox="0 0 500 300" fill="none" stroke="currentColor" strokeWidth="1.5">
                {/* Soil strata background */}
                <rect x="50" y="100" width="400" height="150" fill="rgba(196, 165, 116, 0.08)" stroke="#8f8676" strokeWidth="1" strokeDasharray="4 4" />
                <text x="60" y="120" fill="#c4a574" fontSize="10" fontFamily="monospace" stroke="none">Layer 1: Compact Sand (φ=34°, γ=18 kN/m³)</text>

                <rect x="50" y="250" width="400" height="40" fill="rgba(120, 100, 70, 0.15)" stroke="#6d7278" strokeWidth="1" />
                <text x="60" y="270" fill="#a09070" fontSize="10" fontFamily="monospace" stroke="none">Layer 2: Stiff Clay (cu=65 kPa)</text>

                {/* Water Level indicator */}
                <path d={`M 50 ${220 - interactiveWaterLevel * 25} L 240 ${220 - interactiveWaterLevel * 25}`} stroke="#6a93b5" strokeWidth="2" strokeDasharray="3 3" />
                <polygon points={`235,${216 - interactiveWaterLevel * 25} 245,${220 - interactiveWaterLevel * 25} 235,${224 - interactiveWaterLevel * 25}`} fill="#6a93b5" stroke="none" />
                <text x="250" y={`${224 - interactiveWaterLevel * 25}`} fill="#6a93b5" fontSize="10" fontFamily="monospace" stroke="none">Water Level (+{interactiveWaterLevel.toFixed(1)}m)</text>

                {/* U-Shape Precast RC Sheet Pile Wall */}
                <path d="M 235 60 L 235 270" stroke="#38bdf8" strokeWidth="4" />
                <path d="M 245 60 L 245 270" stroke="#38bdf8" strokeWidth="4" />
                <path d="M 235 270 L 245 270" stroke="#38bdf8" strokeWidth="6" />

                {/* Wall Capping Beam */}
                <rect x="225" y="50" width="30" height="15" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="2" />

                {/* Hydrostatic Pressure Triangle (Upstream) */}
                <polygon points="50,220 235,220 235,130" fill="rgba(106, 147, 181, 0.15)" stroke="#6a93b5" strokeWidth="1" />

                {/* Bending Moment Diagram Overlay */}
                <path d="M 240 65 Q 280 150 240 235 Q 210 260 240 270" fill="rgba(6, 182, 212, 0.1)" stroke="#38bdf8" strokeWidth="2" />
                <text x="290" y="160" fill="#38bdf8" fontSize="10" fontFamily="monospace" stroke="none">M_Ed = 142.8 kNm/m</text>

                {/* Dimension callouts */}
                <line x1="20" y1="60" x2="45" y2="60" stroke="#94a3b8" strokeWidth="1" />
                <line x1="20" y1="270" x2="45" y2="270" stroke="#94a3b8" strokeWidth="1" />
                <line x1="32.5" y1="60" x2="32.5" y2="270" stroke="#94a3b8" strokeWidth="1" />
                <text x="25" y="170" fill="#94a3b8" fontSize="10" fontFamily="monospace" stroke="none" transform="rotate(-90 25 170)">Depth 7.50m</text>
              </svg>
            </div>

            {/* Bottom interactive simulation controls */}
            <div className="pt-3 border-t border-cyan-900/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sliders className="size-4 text-cyan-400" />
                <span className="text-xs font-mono text-slate-300">Simulate Water Level:</span>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={interactiveWaterLevel}
                  onChange={(e) => setInteractiveWaterLevel(parseFloat(e.target.value))}
                  className="w-28 sm:w-36 accent-cyan-500 cursor-pointer"
                />
                <span className="font-mono text-xs text-cyan-400 font-bold">{interactiveWaterLevel.toFixed(1)}m</span>
              </div>
              {/* Green cloud circled text: In requested green color */}
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-950/70 border border-emerald-600/70 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <TrendingUp className="size-3.5 text-emerald-400" />
                <span>FS against overturning: <strong className="text-emerald-300 font-bold">2.14 (Safe)</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT VIEW PANEL: Authentication Login View */}
        <div className="flex-1 lg:w-[42%] xl:w-[40%] flex flex-col justify-center items-center p-6 sm:p-8 lg:p-10 bg-[#081222]/80 backdrop-blur-sm relative">
          {/* RIGHT CARD: Exact height match to Left Card */}
          <div className="w-full max-w-md bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(6,182,212,0.1)] h-[530px]">
            <div>
              {/* Top Identity Server Card Header Badge */}
              <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/80 border border-cyan-600/50 rounded-lg font-mono text-xs text-cyan-300 font-semibold tracking-wider">
                  <ShieldCheck className="size-3.5 text-cyan-400" />
                  <span>IDENTITY SERVER</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">AUTHORIZED ACCESS</span>
              </div>

              {/* Login Header & Dynamic Steps */}
              <div className="text-center mb-4">
                <h2 className="font-display text-2xl font-bold tracking-tight text-white mb-1">LOGIN</h2>
                <p className="text-xs text-slate-400 font-mono">Sign in to continue to <span className="text-cyan-400">structural design</span></p>

                {/* Dynamic Progress Step Indicators */}
                <div className="flex items-center justify-center gap-3 mt-3">
                  {/* Step 1: Email Correct */}
                  <div className={`size-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shadow transition-all duration-300 ${
                    isEmailCorrect ? "bg-emerald-600 text-white" : "bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20"
                  }`}>
                    {isEmailCorrect ? <Check className="size-4" /> : "1"}
                  </div>
                  <div className={`w-10 sm:w-14 h-0.5 transition-colors duration-300 ${isEmailCorrect ? "bg-emerald-600" : "bg-slate-700"}`}></div>

                  {/* Step 2: Password Correct */}
                  <div className={`size-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shadow transition-all duration-300 ${
                    isPasswordCorrect ? "bg-emerald-600 text-white" : isEmailCorrect ? "bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20" : "bg-slate-800 text-slate-400"
                  }`}>
                    {isPasswordCorrect ? <Check className="size-4" /> : "2"}
                  </div>
                  <div className={`w-10 sm:w-14 h-0.5 transition-colors duration-300 ${isPasswordCorrect ? "bg-emerald-600" : "bg-slate-700"}`}></div>

                  {/* Step 3: Login Complete */}
                  <div className={`size-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shadow transition-all duration-300 ${
                    isReadyToLogin ? "bg-emerald-600 text-white animate-pulse" : "bg-slate-800 text-slate-400"
                  }`}>
                    {isReadyToLogin ? <Check className="size-4" /> : "3"}
                  </div>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-3.5">
                {error && (
                  <div className="p-2.5 bg-rose-950/80 border border-rose-600 text-rose-200 text-xs rounded-lg flex items-center gap-2 font-mono">
                    <AlertCircle className="size-4 shrink-0 text-rose-400" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                      Email
                    </label>
                    <button 
                      type="button" 
                      onClick={() => { setEmail("str.design.test"); setPassword("123!test"); }}
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer transition"
                      title="Click or press Tab in box to autofill"
                    >
                      Default: str.design.test (Click or Tab)
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="size-4" />
                    </span>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                          setEmail("str.design.test");
                          setPassword("123!test");
                        }
                      }}
                      required
                      className="w-full pl-10 pr-4 py-2 bg-[#040910] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                      placeholder="str.design.test"
                    />
                  </div>
                  {email.length > 0 && !isEmailCorrect && (
                    <p className="text-[11px] font-mono text-rose-400 mt-0.5">Wrong email (default: str.design.test)</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                      Password
                    </label>
                    <button 
                      type="button" 
                      onClick={() => { setEmail("str.design.test"); setPassword("123!test"); }}
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer transition"
                      title="Click to autofill"
                    >
                      Default: 123!test
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="size-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                          setEmail("str.design.test");
                          setPassword("123!test");
                        }
                      }}
                      required
                      className="w-full pl-10 pr-10 py-2 bg-[#040910] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                      placeholder="123!test"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {password.length > 0 && !isPasswordCorrect && (
                    <p className="text-[11px] font-mono text-rose-400 mt-0.5">Wrong password (default: 123!test)</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="rounded bg-[#040910] border-slate-700 text-cyan-600 focus:ring-cyan-500 size-4"
                    />
                    <span className="font-mono">Remember me</span>
                  </label>
                  <button type="button" onClick={() => alert("Contact system administrator to reset password.")} className="hover:text-cyan-400 font-mono transition">
                    Forgot password? →
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2 transition duration-200 font-mono tracking-wide mt-1"
                >
                  <ShieldCheck className="size-4" />
                  <span>Login</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ALERT MESSAGE BOX: Login Success, Welcome to Structural Design Platform */}
      {showSuccessAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#081222] border-2 border-emerald-500/80 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(16,185,129,0.35)] text-center relative overflow-hidden">
            {/* Top glowing cyan/emerald strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 animate-pulse" />

            <div className="mx-auto size-16 rounded-full bg-emerald-950/90 border-2 border-emerald-400 flex items-center justify-center mb-5 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
              <CheckCircle2 className="size-9" />
            </div>

            <h3 className="font-display text-2xl font-bold text-white mb-2 tracking-wide">
              Login Success
            </h3>
            <p className="font-mono text-cyan-300 text-sm sm:text-base font-semibold mb-6">
              Welcome to Structural Design Platform
            </p>

            {/* Visual progress loading */}
            <div className="w-full bg-slate-900 rounded-full h-1.5 mb-5 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: "100%" }}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const loginEmail = email.trim() === "" ? "str.design.test" : email.trim();
                const loginPass = password.trim() === "" ? "123!test" : password;
                login(loginEmail, loginPass);
              }}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition duration-150 shadow-md"
            >
              <span>Entering Platform... (Click to Continue)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
