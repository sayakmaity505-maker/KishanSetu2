import { useState } from "react";
import { useAuth, FarmerUser, AgentUser } from "../auth";
import KishanSetuLogo from "../components/KishanSetuLogo";
import { useLang } from "../hooks/useLang";

interface Props {
  onRegister: () => void;
  onAdmin: () => void;
  onBack: () => void;
}

type Role = "farmer" | "agent";
const DEMO_OTP = "123456";

export default function LoginPage({ onRegister, onAdmin, onBack }: Props) {
  const { login } = useAuth();
  const { T } = useLang();
  const [role, setRole] = useState<Role>("farmer");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSend() {
    if (phone.length < 10) { setError(T("phoneNumber") + " — 10 digits required"); return; }
    setLoading(true);
    setTimeout(() => { setOtpSent(true); setLoading(false); setError(""); }, 600);
  }

  function handleVerify() {
    if (otp !== DEMO_OTP) { setError(T("demoOtp")); return; }
    setLoading(true);
    setTimeout(() => {
      if (role === "farmer") {
        const u: FarmerUser = {
          role: "farmer", id: "KF-" + phone.slice(-6), name: "Ramesh Kumar", phone,
          aadhaarMasked: "XXXX XXXX 4321", state: "Uttar Pradesh", district: "Lucknow",
          block: "Malihabad", village: "Khanpur", farmerId: "PM-KISAN-2024-UP-12345",
          bankMasked: "XXXXXXXX4821", ifscMasked: "SBI0001234", panMasked: "ABCPK****",
          kycStatus: "verified", dbtLinked: true, kisanCard: "KCC-UP-2024-98765",
          landAcres: 3.5, registeredAt: new Date().toISOString(),
        };
        login(u);
      } else {
        const u: AgentUser = {
          role: "agent", id: "AGT-" + phone.slice(-6), name: "Suresh Patel", phone,
          aadhaarMasked: "XXXX XXXX 9876", centreName: "State Agri Warehouse Complex",
          centreType: "govt", state: "Uttar Pradesh", district: "Lucknow",
          block: "Sadar", address: "NH-28, Amausi, Lucknow", pincode: "226001",
          lat: 26.8467, lng: 80.9462, documentsStatus: "verified",
          registeredAt: new Date().toISOString(),
        };
        login(u);
      }
      setLoading(false);
    }, 800);
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#FFFDF9" }}>
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#000080 0%,#06065e 40%,#004d00 80%,#003300 100%)" }}>
        <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col">
          <div className="flex-1" style={{ background: "#FF6B00" }} />
          <div className="flex-1" style={{ background: "#FFFFFF" }} />
          <div className="flex-1" style={{ background: "#138808" }} />
        </div>
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&h=1200&fit=crop&auto=format)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute" style={{ bottom: "-80px", right: "-80px", width: 400, height: 400, opacity: 0.05 }}>
          <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
            <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="3"/>
            <circle cx="100" cy="100" r="10" fill="white"/>
            {Array.from({length:24},(_,i)=>{const a=(i*360/24)*Math.PI/180;return <line key={i} x1="100" y1="100" x2={100+78*Math.cos(a)} y2={100+78*Math.sin(a)} stroke="white" strokeWidth="1.5"/>;})}
          </svg>
        </div>
        <div className="relative flex flex-col h-full p-12 pl-16">
          <KishanSetuLogo size={52} light />
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-display font-extrabold text-white text-4xl leading-tight mb-4">India's Smart<br/>Agricultural<br/>Gateway</h2>
            <p className="text-white/55 text-base leading-relaxed max-w-sm">Connect with govt-verified procurement centres. Get fair MSP prices, digital bills, and PFMS payments directly to your bank.</p>
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[{icon:"🌾",label:"1.4 Cr+ Farmers",sub:"Registered"},{icon:"🏛",label:"6,200+ Centres",sub:"Govt & Private"},{icon:"💰",label:"₹84 Cr+",sub:"PFMS Payments"},{icon:"🔒",label:"DPDP 2023",sub:"Data Protected"}].map(s=>(
                <div key={s.label} className="rounded-2xl p-4 border border-white/10" style={{ background:"rgba(255,255,255,0.07)" }}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-white font-bold text-sm">{s.label}</div>
                  <div className="text-white/40 text-xs mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-1 mt-6">
            <div className="h-1 w-8 rounded-full" style={{ background: "#FF6B00" }} />
            <div className="h-1 w-8 rounded-full bg-white/40" />
            <div className="h-1 w-8 rounded-full" style={{ background: "#138808" }} />
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="h-1 flex">
          <div className="flex-1" style={{ background: "#FF6B00" }} />
          <div className="flex-1 bg-white" />
          <div className="flex-1" style={{ background: "#138808" }} />
        </div>

        <div className="px-8 pt-5 pb-1">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-70 transition-opacity"
            style={{ color: "#FF6B00" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            {T("back")}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-4">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-6"><KishanSetuLogo size={44} /></div>

            <div className="mb-7">
              <h1 className="font-display font-extrabold text-3xl mb-1" style={{ color: "#1a0a00" }}>{T("welcomeBack")}</h1>
              <p className="text-sm" style={{ color: "#7a5a3a" }}>{T("login")} · KishanSetu</p>
            </div>

            <div className="flex gap-1 mb-7 p-1 rounded-xl" style={{ background: "#FFE8D0" }}>
              {(["farmer","agent"] as Role[]).map(r => (
                <button key={r} onClick={() => { setRole(r); setOtpSent(false); setOtp(""); setError(""); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all"
                  style={role===r?{background:"white",color:"#FF6B00",boxShadow:"0 2px 8px rgba(255,107,0,0.15)"}:{color:"#c08060"}}>
                  <span>{r==="farmer"?"🌾":"🏢"}</span>
                  <span>{r==="farmer"?T("iAmFarmer"):T("iAmAgent")}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: "#FF6B00" }}>{T("phoneNumber")}</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-white border-2 border-orange-100 rounded-xl text-sm gap-1" style={{ color: "#7a5a3a" }}>🇮🇳 +91</span>
                  <input type="tel" maxLength={10} value={phone} autoFocus={!otpSent}
                    onChange={e => { setPhone(e.target.value.replace(/\D/g,"")); setOtpSent(false); setOtp(""); }}
                    placeholder="9876543210"
                    className="flex-1 border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white transition-colors"
                  />
                </div>
              </div>

              {!otpSent ? (
                <button onClick={handleSend} disabled={phone.length<10||loading}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-40 transition-all"
                  style={{ background:"linear-gradient(135deg,#FF6B00,#FF8C2A)", boxShadow:"0 4px 16px rgba(255,107,0,0.3)" }}>
                  {loading?"...":T("sendOtp") + " →"}
                </button>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: "#FF6B00" }}>{T("enterOtp")}</label>
                    <input type="text" maxLength={6} value={otp} autoFocus
                      onChange={e => setOtp(e.target.value.replace(/\D/g,""))}
                      placeholder="6-digit OTP"
                      className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-lg focus:outline-none bg-white tracking-[0.5em] text-center font-mono transition-colors"
                    />
                    <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color:"#FF6B00" }}>⚡ Demo OTP: <strong>123456</strong></p>
                  </div>
                  <button onClick={handleVerify} disabled={otp.length<6||loading}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-40"
                    style={{ background:"linear-gradient(135deg,#138808,#1eaf0a)", boxShadow:"0 4px 16px rgba(19,136,8,0.3)" }}>
                    {loading?"...":T("verifyOtp") + " →"}
                  </button>
                  <button onClick={() => setOtpSent(false)} className="w-full text-xs py-2" style={{ color:"#7a5a3a" }}>← {T("sendOtp")}</button>
                </>
              )}

              {error && (
                <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm border-2" style={{ background:"#FFF0F0", borderColor:"#fca5a5", color:"#b91c1c" }}>
                  ⚠ {error}
                </div>
              )}
            </div>

            <div className="mt-7 pt-5 border-t space-y-3" style={{ borderColor:"#FFE0C0" }}>
              <p className="text-center text-sm" style={{ color:"#7a5a3a" }}>
                {T("newUser")}{" "}
                <button onClick={onRegister} className="font-bold hover:underline" style={{ color:"#FF6B00" }}>{T("registerHere")} →</button>
              </p>
              <p className="text-center text-xs" style={{ color:"#c08060" }}>
                Admin?{" "}
                <button onClick={onAdmin} className="font-bold hover:underline" style={{ color:"#000080" }}>Admin Console</button>
              </p>
            </div>

            <div className="mt-5 p-4 rounded-2xl border-2" style={{ background:"#FFF9F3", borderColor:"#FFE0C0" }}>
              <p className="text-xs font-bold mb-2" style={{ color:"#FF6B00" }}>⚡ Demo Quick Login</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setRole("farmer"); setPhone("9876543210"); setOtpSent(true); }}
                  className="text-xs bg-white border-2 rounded-xl px-3 py-2 text-left hover:border-orange-300 transition-colors"
                  style={{ borderColor:"#FFE0C0" }}>
                  <div className="font-bold" style={{ color:"#1a0a00" }}>🌾 Farmer</div>
                  <div style={{ color:"#c08060" }}>9876543210</div>
                </button>
                <button onClick={() => { setRole("agent"); setPhone("9988776655"); setOtpSent(true); }}
                  className="text-xs bg-white border-2 rounded-xl px-3 py-2 text-left hover:border-orange-300 transition-colors"
                  style={{ borderColor:"#FFE0C0" }}>
                  <div className="font-bold" style={{ color:"#1a0a00" }}>🏢 Agent</div>
                  <div style={{ color:"#c08060" }}>9988776655</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
