import { useState, useCallback, useRef, useEffect } from "react";
import { useAuth, FarmerUser, AgentUser } from "../auth";
import { INDIAN_STATES, AGENT_DOCUMENTS, CROPS } from "../i18n";
import { useLang } from "../hooks/useLang";
import { getDistricts, getBlocks, getVillages, getPostOffices, getPoliceStations } from "../data/india-locations";
import KishanSetuLogo from "../components/KishanSetuLogo";

type Role = "farmer" | "agent";
const DEMO_OTP = "123456";

interface Props {
  onLogin: () => void;
  onBack: () => void;
  onComplete: (userId: string) => void;
}

// Confirmation modal
function ConfirmExit({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={e => e.stopPropagation()}>
        <div className="text-3xl mb-4 text-center">⚠️</div>
        <h3 className="font-display font-bold text-center mb-2" style={{ color:"#1a0a00", fontSize:"1.2rem" }}>
          Leave Registration?
        </h3>
        <p className="text-center text-sm mb-6" style={{ color:"#7a5a3a" }}>
          Are you sure you want to go back? You will have to fill all the details again from the beginning.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-xl border-2 font-semibold text-sm"
            style={{ borderColor:"#FF6B00", color:"#FF6B00" }}>
            Keep Filling
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background:"#1a0a00" }}>
            Yes, Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

// File upload zone with card/photo scanning simulation
function UploadCard({ label, desc, required, icon = "📄", onUpload, uploaded, verified, onVerify }: {
  label: string; desc: string; required: boolean; icon?: string;
  onUpload: () => void; uploaded: boolean; verified: boolean;
  onVerify: (otp: string) => boolean;
}) {
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const [scanning, setScanning] = useState(false);

  function handleUpload() {
    setScanning(true);
    setTimeout(() => { setScanning(false); onUpload(); }, 1200);
  }

  return (
    <div className={`rounded-xl border-2 p-4 transition-all ${verified ? "border-green-400 bg-green-50" : uploaded ? "border-orange-300 bg-orange-50" : "border-dashed border-orange-200 bg-white"}`}>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold" style={{ color:"#1a0a00" }}>{label}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${required ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
              {required ? "Required" : "Optional"}
            </span>
          </div>
          <p className="text-xs text-gray-400">{desc}</p>
        </div>
        {verified ? (
          <span className="badge-verified flex-shrink-0">✓ Verified</span>
        ) : scanning ? (
          <span className="text-xs text-blue-600 font-bold animate-pulse flex-shrink-0">🔍 Scanning...</span>
        ) : uploaded ? (
          <button onClick={() => setShowOtp(v => !v)}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold flex-shrink-0 text-white"
            style={{ background:"#000080" }}>
            Verify OTP
          </button>
        ) : (
          <button onClick={handleUpload}
            className="text-xs border-2 px-3 py-1.5 rounded-lg font-semibold flex-shrink-0 flex items-center gap-1 hover:bg-orange-50 transition-colors"
            style={{ borderColor:"#FF6B00", color:"#FF6B00" }}>
            📷 Upload
          </button>
        )}
      </div>
      {showOtp && !verified && (
        <div className="mt-3 flex gap-2">
          <input id={`otp-${label.replace(/\s/g,"")}`} type="text" maxLength={6} placeholder="OTP (demo: 123456)" value={otp}
            onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setError(false); }}
            className={`flex-1 border-2 rounded-xl px-3 py-2 text-sm focus:outline-none ${error ? "border-red-300" : "border-orange-200 focus:border-orange-400"} bg-white`}
          />
          <button onClick={() => {
            if (onVerify(otp)) { setShowOtp(false); setOtp(""); }
            else setError(true);
          }}
            className="text-xs px-3 py-2 rounded-xl font-semibold text-white"
            style={{ background:"#FF6B00" }}>
            Verify
          </button>
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">Wrong OTP. Demo: 123456</p>}
    </div>
  );
}

// Step indicator bar (mobile)
function StepBar({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
      {steps.map((s, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={s} className="flex items-center gap-1 flex-shrink-0">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={done ? { background:"#138808", color:"white" } : active ? { background:"#FF6B00", color:"white" } : { background:"#FFE8D0", color:"#c08060" }}>
              {done ? "✓" : n}
            </div>
            {i < steps.length - 1 && (
              <div className="h-0.5 w-5 rounded-full" style={{ background: done ? "#138808" : "#FFE0C0" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Input that auto-focuses on mount
function FocusInput(props: React.InputHTMLAttributes<HTMLInputElement> & { inputClass?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const { inputClass, ...rest } = props;
  useEffect(() => {
    const t = setTimeout(() => ref.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);
  return (
    <input ref={ref} {...rest}
      className={`w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white transition-colors ${inputClass ?? ""}`}
      style={{ WebkitTapHighlightColor:"rgba(255,107,0,0.1)", touchAction:"manipulation" }}
    />
  );
}

// Regular input (no auto-focus)
function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white transition-colors"
      style={{ WebkitTapHighlightColor:"rgba(255,107,0,0.1)", touchAction:"manipulation" }}
    />
  );
}

function SelectField(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props}
      className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white transition-colors"
      style={{ WebkitTapHighlightColor:"rgba(255,107,0,0.1)", touchAction:"manipulation" }}
    />
  );
}

const Label = ({ text }: { text: string }) => (
  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color:"#FF6B00" }}>{text}</label>
);

const Btn = ({ children, onClick, disabled = false, variant = "primary" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; variant?: "primary" | "secondary" | "green";
}) => (
  <button onClick={onClick} disabled={disabled}
    className="w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 active:scale-98"
    style={variant === "primary"
      ? { background: "linear-gradient(135deg,#FF6B00,#FF8C2A)", color:"white", boxShadow:"0 4px 16px rgba(255,107,0,0.3)" }
      : variant === "green"
      ? { background: "linear-gradient(135deg,#138808,#1eaf0a)", color:"white", boxShadow:"0 4px 16px rgba(19,136,8,0.3)" }
      : { background: "transparent", color: "#FF6B00", border:"2px solid #FF6B00" }}>
    {children}
  </button>
);

// Location Cascade Component
function LocationCascade({ state, district, block, village, postOffice, policeStation, onChange, disabled = false }: {
  state: string; district: string; block: string; village: string; postOffice: string; policeStation: string;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}) {
  const { T } = useLang();
  const districts = state ? getDistricts(state) : [];
  const blocks = (state && district) ? getBlocks(state, district) : [];
  const villages = (state && district && block) ? getVillages(state, district, block) : [];
  const postOffices = (state && district && block) ? getPostOffices(state, district, block) : [];
  const policeStations = (state && district && block) ? getPoliceStations(state, district, block) : [];

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <Label text={T("state")} />
        <SelectField value={state} disabled={disabled} onChange={e => { onChange("state", e.target.value); onChange("district",""); onChange("block",""); onChange("village",""); onChange("postOffice",""); onChange("policeStation",""); }}>
          <option value="">— Select State —</option>
          {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
        </SelectField>
      </div>
      <div>
        <Label text={T("district")} />
        <SelectField value={district} disabled={!state || disabled} onChange={e => { onChange("district", e.target.value); onChange("block",""); onChange("village",""); onChange("postOffice",""); onChange("policeStation",""); }}>
          <option value="">— Select District —</option>
          {districts.map(d => <option key={d}>{d}</option>)}
        </SelectField>
        {!state && <p className="text-xs text-gray-400 mt-1">Select state first</p>}
      </div>
      <div>
        <Label text={T("block")} />
        <SelectField value={block} disabled={!district || disabled} onChange={e => { onChange("block", e.target.value); onChange("village",""); onChange("postOffice",""); onChange("policeStation",""); }}>
          <option value="">— Select Block —</option>
          {blocks.map(b => <option key={b}>{b}</option>)}
        </SelectField>
        {!district && <p className="text-xs text-gray-400 mt-1">Select district first</p>}
      </div>
      <div>
        <Label text={T("village")} />
        <SelectField value={village} disabled={!block || disabled} onChange={e => onChange("village", e.target.value)}>
          <option value="">— Select Village —</option>
          {villages.map(v => <option key={v}>{v}</option>)}
          <option value="__other">Other (type below)</option>
        </SelectField>
        {village === "__other" && (
          <Field placeholder="Enter village name" className="mt-2"
            onChange={e => onChange("village", e.target.value)} />
        )}
      </div>
      <div>
        <Label text="Post Office" />
        <SelectField value={postOffice} disabled={!block || disabled} onChange={e => onChange("postOffice", e.target.value)}>
          <option value="">— Select Post Office —</option>
          {postOffices.map(p => <option key={p}>{p}</option>)}
          <option value="__other">Other</option>
        </SelectField>
      </div>
      <div>
        <Label text="Police Station" />
        <SelectField value={policeStation} disabled={!block || disabled} onChange={e => onChange("policeStation", e.target.value)}>
          <option value="">— Select Police Station —</option>
          {policeStations.map(p => <option key={p}>{p}</option>)}
          <option value="__other">Other</option>
        </SelectField>
      </div>
    </div>
  );
}

export default function RegisterPage({ onLogin, onBack, onComplete }: Props) {
  const { login } = useAuth();
  const { T } = useLang();
  const [confirmExit, setConfirmExit] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [fStep, setFStep] = useState(1);
  const [aStep, setAStep] = useState(1);

  // Phone & OTP (shared)
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [consent, setConsent] = useState(false);

  // Personal info (shared)
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [digilockerStatus, setDigilockerStatus] = useState<"idle" | "connecting" | "verified">("idle");

  // Location (shared)
  const [loc, setLoc] = useState({ state:"", district:"", block:"", village:"", postOffice:"", policeStation:"" });
  const updateLoc = (field: string, value: string) => setLoc(prev => ({ ...prev, [field]: value }));

  // GPS location
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locPermission, setLocPermission] = useState<"idle"|"granted"|"denied">("idle");

  // Farmer-specific
  const [bankAccount, setBankAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [pan, setPan] = useState("");
  const [landAcres, setLandAcres] = useState("");
  const [kisanCard, setKisanCard] = useState("");
  const [dbt, setDbt] = useState(false);
  const [farmerDocs, setFarmerDocs] = useState<Record<string, { uploaded: boolean; verified: boolean }>>({});

  // Agent-specific
  const [centreName, setCentreName] = useState("");
  const [centreType, setCentreType] = useState<"govt" | "private">("private");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [agentDocs, setAgentDocs] = useState<Record<string, { uploaded: boolean; verified: boolean }>>({});
  const requiredAgentDocsOk = AGENT_DOCUMENTS.filter(d => d.required).every(d => agentDocs[d.id]?.verified);

  function requestGPS() {
    setLocLoading(true);
    if (!navigator.geolocation) { setLat(28.6139); setLng(77.2090); setLocLoading(false); setLocPermission("granted"); return; }
    navigator.geolocation.getCurrentPosition(
      pos => { setLat(pos.coords.latitude); setLng(pos.coords.longitude); setLocLoading(false); setLocPermission("granted"); },
      () => { setLat(28.6139); setLng(77.2090); setLocLoading(false); setLocPermission("denied"); }
    );
  }

  const handleSendOtp = () => { if (phone.length < 10) return; setOtpSent(true); setOtpError(""); };
  const handleVerifyOtp = () => {
    if (otp !== DEMO_OTP) { setOtpError("Incorrect OTP. Demo: 123456"); return; }
    setOtpVerified(true); setOtpError("");
    if (role === "farmer") setFStep(2);
    else setAStep(2);
  };

  function handleFarmerDoc(id: string) { setFarmerDocs(p => ({ ...p, [id]: { uploaded: true, verified: false } })); }
  function verifyFarmerDoc(id: string, o: string) {
    if (o !== DEMO_OTP) return false;
    setFarmerDocs(p => ({ ...p, [id]: { uploaded: true, verified: true } })); return true;
  }

  function connectDigiLocker() {
    if (!consent || !name.trim() || aadhaar.length !== 12) return;
    setDigilockerStatus("connecting");
    window.setTimeout(() => {
      setDigilockerStatus("verified");
      setFarmerDocs(p => ({
        ...p,
        aadhaar_photo: { uploaded: true, verified: true },
        land_record: { uploaded: true, verified: true },
      }));
    }, 1400);
  }
  function handleAgentDoc(id: string) { setAgentDocs(p => ({ ...p, [id]: { uploaded: true, verified: false } })); }
  function verifyAgentDoc(id: string, o: string) {
    if (o !== DEMO_OTP) return false;
    setAgentDocs(p => ({ ...p, [id]: { uploaded: true, verified: true } })); return true;
  }

  function completeFarmer() {
    const u: FarmerUser = {
      role: "farmer", id: "KF-" + phone.slice(-6), name, phone,
      aadhaarMasked: "XXXX XXXX " + aadhaar.slice(-4),
      state: loc.state, district: loc.district, block: loc.block, village: loc.village,
      lat, lng,
      farmerId: "PM-KISAN-2026-" + loc.state.slice(0, 2).toUpperCase() + "-" + Math.floor(Math.random() * 90000 + 10000),
      bankMasked: "XXXXXXXX" + bankAccount.slice(-4),
      ifscMasked: ifsc, panMasked: pan.slice(0, 5) + "****",
      kycStatus: digilockerStatus === "verified" || farmerDocs["aadhaar_photo"]?.verified ? "verified" : "pending",
      digilockerVerified: digilockerStatus === "verified",
      verifiedDocuments: Object.entries(farmerDocs).filter(([, value]) => value.verified).map(([id]) => id),
      dbtLinked: dbt, kisanCard,
      landAcres: parseFloat(landAcres) || 0, registeredAt: new Date().toISOString(),
    };
    login(u); onComplete(u.id);
  }

  function completeAgent() {
    const u: AgentUser = {
      role: "agent", id: "AGT-" + phone.slice(-6), name, phone,
      aadhaarMasked: "XXXX XXXX " + aadhaar.slice(-4),
      centreName, centreType, state: loc.state, district: loc.district, block: loc.block,
      address, pincode, lat, lng, documentsStatus: "pending", registeredAt: new Date().toISOString(),
    };
    login(u); onComplete(u.id);
  }

  const handleBack = useCallback(() => {
    if (role !== null) setConfirmExit(true);
    else onBack();
  }, [role, onBack]);

  const farmerSteps = ["Phone OTP", "Consent & ID", "Location & GPS", "Bank & Finance", "Kisan Cards & DBT"];
  const agentSteps = ["Phone OTP", "Consent & ID", "Centre Info", "Address & GPS", "Documents"];
  const steps = role === "farmer" ? farmerSteps : agentSteps;
  const currentStep = role === "farmer" ? fStep : aStep;

  const landAcresNum = parseFloat(landAcres);
  const landValid = landAcres !== "" && !isNaN(landAcresNum) && landAcresNum > 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background:"#FFFDF9" }}>
      {confirmExit && (
        <ConfirmExit
          onConfirm={() => { setConfirmExit(false); onBack(); }}
          onCancel={() => setConfirmExit(false)}
        />
      )}

      {/* Nav */}
      <div className="flex items-center justify-between px-6 lg:px-10 py-4 border-b bg-white"
        style={{ borderColor:"#FFE0C0" }}>
        <div className="flex items-center gap-3">
          <button onClick={handleBack}
            className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-70 transition-opacity"
            style={{ color:"#FF6B00" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Back
          </button>
          <div className="w-px h-5 bg-orange-100" />
          <KishanSetuLogo size={36} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 hidden sm:block">Already registered?</span>
          <button onClick={onLogin}
            className="text-sm font-bold px-4 py-2 rounded-xl border-2 transition-colors"
            style={{ borderColor:"#000080", color:"#000080" }}>
            Login →
          </button>
        </div>
      </div>
      <div className="h-1 flex">
        <div className="flex-1" style={{ background:"#FF6B00" }} />
        <div className="flex-1" style={{ background:"#FFFFFF" }} />
        <div className="flex-1" style={{ background:"#138808" }} />
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="hidden lg:flex w-72 flex-col p-8 border-r" style={{ borderColor:"#FFE0C0", background:"#FFF9F3" }}>
          <h2 className="font-display font-bold text-xl mb-2" style={{ color:"#1a0a00" }}>
            {role === null ? "Join KishanSetu" : role === "farmer" ? "Farmer Registration" : "Agent Registration"}
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color:"#7a5a3a" }}>
            {role === null ? "Register once, access India's agricultural procurement network."
              : role === "farmer" ? "Sell harvest at fair MSP prices, receive PFMS payments directly."
              : "Register your centre to manage farmer bookings and process payments."}
          </p>
          {role !== null && (
            <div className="space-y-3">
              {steps.map((s, i) => {
                const n = i + 1; const done = n < currentStep; const active = n === currentStep;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={done ? { background:"#138808", color:"white" } : active ? { background:"#FF6B00", color:"white", boxShadow:"0 0 0 4px rgba(255,107,0,0.2)" } : { background:"#FFE8D0", color:"#c08060" }}>
                      {done ? "✓" : n}
                    </div>
                    <span className="text-sm" style={{ color: active ? "#FF6B00" : done ? "#138808" : "#c08060", fontWeight: active ? 700 : 400 }}>{s}</span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-auto pt-8 border-t space-y-2 text-xs" style={{ borderColor:"#FFE0C0", color:"#c08060" }}>
            <div>🔒 DPDP Act 2023 Protected</div>
            <div>✓ UIDAI Aadhaar Verified</div>
            <div>💰 PFMS/DBT Integrated</div>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto py-8 px-6 lg:px-12 flex justify-center">
          <div className="w-full max-w-2xl">

            {/* Role selection */}
            {role === null && (
              <div>
                <h1 className="font-display font-extrabold text-3xl mb-1" style={{ color:"#1a0a00" }}>Who are you?</h1>
                <p className="text-sm mb-8" style={{ color:"#7a5a3a" }}>Choose your role to begin registration</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { r:"farmer" as Role, emoji:"🌾", title:"I'm a Farmer", desc:"Register to sell harvest at fair MSP prices, book slots, and receive PFMS payments directly." },
                    { r:"agent" as Role, emoji:"🏢", title:"I'm an Agent", desc:"Register your procurement centre to manage farmer bookings, verify documents, and process government payments." },
                  ].map(({ r, emoji, title, desc }) => (
                    <button key={r} onClick={() => setRole(r)}
                      className="text-left p-6 bg-white rounded-2xl border-2 transition-all hover:shadow-lg"
                      style={{ borderColor:"#FFE0C0" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "#FF6B00")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "#FFE0C0")}>
                      <div className="text-4xl mb-4">{emoji}</div>
                      <h3 className="font-display font-bold text-lg mb-2" style={{ color:"#1a0a00" }}>{title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color:"#7a5a3a" }}>{desc}</p>
                      <div className="mt-4 text-sm font-bold" style={{ color:"#FF6B00" }}>Get started →</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ===== FARMER FLOW ===== */}
            {role === "farmer" && (
              <div key={`farmer-step-${fStep}`}>
                <div className="lg:hidden mb-4"><StepBar steps={farmerSteps} current={fStep} /></div>
                <h2 className="font-display font-bold text-2xl mb-6" style={{ color:"#1a0a00" }}>{farmerSteps[fStep - 1]}</h2>

                {/* F-Step 1: Phone OTP */}
                {fStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label text={T("phoneNumber")} />
                      <div className="flex gap-2">
                        <span className="flex items-center px-3 bg-white border-2 border-orange-100 rounded-xl text-sm" style={{ color:"#7a5a3a" }}>🇮🇳 +91</span>
                        <FocusInput id="farmer-phone" name="farmer-phone" type="tel" inputMode="numeric" maxLength={10} value={phone}
                          onChange={e => { setPhone(e.target.value.replace(/\D/g, "")); setOtpSent(false); setOtp(""); }}
                          placeholder="10-digit mobile number" autoComplete="tel-national" />
                      </div>
                    </div>
                    {!otpSent ? (
                      <Btn onClick={handleSendOtp} disabled={phone.length < 10}>Send OTP →</Btn>
                    ) : !otpVerified ? (
                      <div className="space-y-3">
                        <div>
                          <Label text={T("enterOtp")} />
                          <FocusInput id="farmer-otp" name="farmer-otp" type="text" inputMode="numeric" maxLength={6} value={otp}
                            onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                            placeholder="6-digit OTP" inputClass="text-center tracking-[0.5em] text-xl font-mono" autoComplete="one-time-code" />
                          <p className="text-xs mt-1" style={{ color:"#FF6B00" }}>Demo OTP: <strong>123456</strong></p>
                          {otpError && <p className="text-red-500 text-xs mt-1">{otpError}</p>}
                        </div>
                        <Btn onClick={handleVerifyOtp} disabled={otp.length < 6}>Verify & Continue →</Btn>
                        <button onClick={() => setOtpSent(false)} className="w-full text-xs py-2" style={{ color:"#7a5a3a" }}>← Resend OTP</button>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* F-Step 2: Consent & Personal ID */}
                {fStep === 2 && (
                  <div className="space-y-4">
                    <div className="rounded-2xl p-5 border-2" style={{ background:"#FFFBF0", borderColor:"#FFD699" }}>
                      <div className="font-bold text-sm mb-2" style={{ color:"#996600" }}>🔒 DPDP Act 2023 — Data Consent Required</div>
                      <ul className="space-y-1 text-xs list-disc pl-4" style={{ color:"#7a5a3a" }}>
                        <li>Aadhaar stored as XXXX XXXX XXXX per UIDAI norms</li>
                        <li>Data shared only with authorised centres and PFMS/DBT</li>
                        <li>No commercial use; withdraw anytime via Grievance portal</li>
                      </ul>
                      <label className="flex items-start gap-2 mt-3 cursor-pointer">
                        <input type="checkbox" id="farmer-consent" name="farmer-consent" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 w-4 h-4" style={{ accentColor:"#FF6B00" }} />
                        <span className="text-xs font-bold" style={{ color:"#FF6B00" }}>I give explicit consent for data processing under DPDP Act 2023</span>
                      </label>
                    </div>
                    <div>
                      <Label text={T("name")} />
                      <FocusInput id="farmer-name" name="farmer-name" value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your full name" autoComplete="name" />
                    </div>
                    <div>
                      <Label text={T("aadhaar")} />
                      <Field id="farmer-aadhaar" name="farmer-aadhaar" type="text" inputMode="numeric"
                        value={aadhaar}
                        onChange={e => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                        placeholder="12-digit Aadhaar number" maxLength={12} autoComplete="off" />
                      <p className="text-xs mt-1 text-gray-400">Stored as XXXX XXXX XXXX — never in full</p>
                    </div>
                    <div className={`rounded-2xl border-2 p-5 transition-all ${
                      digilockerStatus === "verified"
                        ? "border-india-green bg-india-green-pale"
                        : "border-blue-200 bg-blue-50"
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                          <svg viewBox="0 0 24 24" className="h-6 w-6 text-chakra-blue" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path d="M4 9.5 12 5l8 4.5-8 4.5-8-4.5Z" />
                            <path d="M6.5 11v5.5c3.5 2.2 7.5 2.2 11 0V11M20 10v5" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="font-bold text-chakra-blue">Verify details with DigiLocker</div>
                            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-chakra-blue">Government of India</span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-gray-600">
                            Give consent to securely fetch your Aadhaar and available land record. KishanSetu stores only verified status and masked details.
                          </p>
                          {digilockerStatus === "verified" ? (
                            <div className="mt-3 flex items-center gap-2 text-sm font-bold text-india-green">
                              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                <path d="m5 12 4 4L19 6" />
                              </svg>
                              Identity and documents authenticated
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={connectDigiLocker}
                              disabled={digilockerStatus === "connecting" || !consent || !name.trim() || aadhaar.length !== 12}
                              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-chakra-blue px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {digilockerStatus === "connecting" ? (
                                <>
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                  Authenticating securely…
                                </>
                              ) : (
                                "Connect DigiLocker"
                              )}
                            </button>
                          )}
                          <p className="mt-2 text-[10px] text-gray-400">
                            Secure sandbox flow for this prototype. Production OAuth credentials can be connected without changing the registration UI.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Btn onClick={() => { if (consent && name.trim() && aadhaar.length === 12) setFStep(3); }} disabled={!consent || !name.trim() || aadhaar.length < 12}>
                      {digilockerStatus === "verified" ? "Continue with verified details →" : "Continue for manual verification →"}
                    </Btn>
                    <button onClick={() => setFStep(1)} className="w-full text-xs py-2" style={{ color:"#7a5a3a" }}>← Back</button>
                  </div>
                )}

                {/* F-Step 3: Location + GPS */}
                {fStep === 3 && (
                  <div className="space-y-4">
                    <LocationCascade
                      state={loc.state} district={loc.district} block={loc.block}
                      village={loc.village} postOffice={loc.postOffice} policeStation={loc.policeStation}
                      onChange={updateLoc}
                    />
                    {/* GPS Permission */}
                    <div className="rounded-2xl p-4 border-2" style={{ background: locPermission === "granted" ? "#E6F9E6" : "#eef0ff", borderColor: locPermission === "granted" ? "#138808" : "#8888ff" }}>
                      <div className="font-bold text-sm mb-2" style={{ color: locPermission === "granted" ? "#138808" : "#000080" }}>
                        📍 Device Location (for real-time map)
                      </div>
                      {locPermission === "granted" && lat ? (
                        <div>
                          <p className="text-xs font-mono text-green-700">✓ Location captured: {lat.toFixed(4)}°N, {lng?.toFixed(4)}°E</p>
                          <p className="text-xs text-green-600 mt-1">Your location will update automatically whenever you use KishanSetu.</p>
                        </div>
                      ) : locPermission === "denied" ? (
                        <p className="text-xs" style={{ color:"#b91c1c" }}>Location denied. Approximate location used. You can update later in Profile.</p>
                      ) : (
                        <div>
                          <p className="text-xs text-gray-600 mb-3">Allow KishanSetu to access your device location. Your location will be shown on India's real-time agricultural map.</p>
                          <button onClick={requestGPS} disabled={locLoading}
                            className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background:"#000080" }}>
                            {locLoading ? "Getting location..." : "🛰 Allow Location Access"}
                          </button>
                        </div>
                      )}
                    </div>
                    <Btn onClick={() => { if (loc.state && loc.district && loc.block) setFStep(4); }} disabled={!loc.state || !loc.district || !loc.block}>Continue →</Btn>
                    <button onClick={() => setFStep(2)} className="w-full text-xs py-2" style={{ color:"#7a5a3a" }}>← Back</button>
                  </div>
                )}

                {/* F-Step 4: Bank & Finance */}
                {fStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <Label text="Land Area (Acres) — must be greater than 0" />
                      <FocusInput id="farmer-acres" name="farmer-acres" type="number" inputMode="decimal" min="0.01" step="0.01"
                        value={landAcres}
                        onChange={e => setLandAcres(e.target.value)}
                        placeholder="e.g. 2.5" autoComplete="off" />
                      {landAcres !== "" && !isNaN(parseFloat(landAcres)) && parseFloat(landAcres) <= 0 && (
                        <p className="text-red-500 text-xs mt-1">⚠ Land area must be greater than 0</p>
                      )}
                    </div>
                    <div>
                      <Label text={T("bankAccount")} />
                      <Field id="farmer-bank" name="farmer-bank" type="text" inputMode="numeric"
                        value={bankAccount}
                        onChange={e => setBankAccount(e.target.value.replace(/\D/g, ""))}
                        placeholder="Account number" autoComplete="off" />
                      {bankAccount.length >= 4 && <p className="text-xs text-gray-400 mt-1">Stored as XXXXXXXX{bankAccount.slice(-4)}</p>}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label text={T("ifsc")} />
                        <Field id="farmer-ifsc" name="farmer-ifsc" type="text"
                          value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} placeholder="SBIN0012345" maxLength={11} autoComplete="off" />
                      </div>
                      <div>
                        <Label text="PAN Card (Optional)" />
                        <Field id="farmer-pan" name="farmer-pan" type="text"
                          value={pan} onChange={e => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} autoComplete="off" />
                      </div>
                    </div>
                    <Btn onClick={() => { if (bankAccount && ifsc && landValid) setFStep(5); }} disabled={!bankAccount || !ifsc || !landValid}>Continue →</Btn>
                    <button onClick={() => setFStep(3)} className="w-full text-xs py-2" style={{ color:"#7a5a3a" }}>← Back</button>
                  </div>
                )}

                {/* F-Step 5: Kisan Cards + Photo Upload + DBT */}
                {fStep === 5 && (
                  <div className="space-y-4">
                    <div>
                      <Label text="PM-KISAN / Kisan Credit Card Number" />
                      <FocusInput id="farmer-kisan" name="farmer-kisan" type="text"
                        value={kisanCard} onChange={e => setKisanCard(e.target.value)} placeholder="KCC or PM-KISAN ID (optional)" autoComplete="off" />
                    </div>

                    <div className="rounded-2xl p-4 border" style={{ background:"#FFF9F3", borderColor:"#FFE0C0" }}>
                      <div className="font-bold text-sm mb-3" style={{ color:"#FF6B00" }}>📋 Upload & Verify Documents</div>
                      <p className="text-xs text-gray-500 mb-3">
                        {digilockerStatus === "verified"
                          ? "Aadhaar and available land records were securely received from DigiLocker. Add any remaining documents below."
                          : "Upload clear photos/scans. A demo OTP (123456) will verify your documents."}
                      </p>
                      <div className="space-y-3">
                        <UploadCard icon="🪪" label="Aadhaar Card Photo / Scan" desc="Front side of Aadhaar card" required
                          uploaded={farmerDocs["aadhaar_photo"]?.uploaded ?? false}
                          verified={farmerDocs["aadhaar_photo"]?.verified ?? false}
                          onUpload={() => handleFarmerDoc("aadhaar_photo")}
                          onVerify={(o) => verifyFarmerDoc("aadhaar_photo", o)} />
                        <UploadCard icon="📸" label="Farmer Photo" desc="Recent passport-size photo" required
                          uploaded={farmerDocs["farmer_photo"]?.uploaded ?? false}
                          verified={farmerDocs["farmer_photo"]?.verified ?? false}
                          onUpload={() => handleFarmerDoc("farmer_photo")}
                          onVerify={(o) => verifyFarmerDoc("farmer_photo", o)} />
                        <UploadCard icon="💳" label="Kisan Credit Card / PM-KISAN Card" desc="Front side of card issued by bank/govt" required={false}
                          uploaded={farmerDocs["kisan_card"]?.uploaded ?? false}
                          verified={farmerDocs["kisan_card"]?.verified ?? false}
                          onUpload={() => handleFarmerDoc("kisan_card")}
                          onVerify={(o) => verifyFarmerDoc("kisan_card", o)} />
                        <UploadCard icon="📜" label="Land Record (Khatauni / Patta)" desc="Land ownership document from Patwari" required={false}
                          uploaded={farmerDocs["land_record"]?.uploaded ?? false}
                          verified={farmerDocs["land_record"]?.verified ?? false}
                          onUpload={() => handleFarmerDoc("land_record")}
                          onVerify={(o) => verifyFarmerDoc("land_record", o)} />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Documents are verified against your Aadhaar-linked data. Uploaded details must match entered information.</p>
                    </div>

                    <label className="flex items-start gap-3 rounded-2xl p-4 cursor-pointer border-2" style={{ background:"#E6F9E6", borderColor:"#138808" }}>
                      <input type="checkbox" id="farmer-dbt" name="farmer-dbt" checked={dbt} onChange={e => setDbt(e.target.checked)} className="mt-0.5 w-4 h-4" style={{ accentColor:"#138808" }} />
                      <div>
                        <div className="font-bold text-sm" style={{ color:"#138808" }}>Link DBT (Direct Benefit Transfer)</div>
                        <p className="text-xs mt-0.5 text-gray-500">Receive MSP payments directly to your bank via PFMS — no middlemen</p>
                      </div>
                    </label>

                    <div className="rounded-2xl p-5 border space-y-2" style={{ background:"#FFF9F3", borderColor:"#FFE0C0" }}>
                      <div className="font-bold text-sm mb-3" style={{ color:"#1a0a00" }}>Registration Summary</div>
                      {[["Name", name], ["Phone", "+91 " + phone], ["Aadhaar", "XXXX XXXX " + aadhaar.slice(-4)], ["Land", landAcres + " acres"], ["Bank", "XXXXXXXX" + bankAccount.slice(-4)], ["Location", `${loc.village || "—"}, ${loc.block}, ${loc.district}, ${loc.state}`]].map(([k, v]) => (
                        <div key={k as string} className="flex justify-between text-xs">
                          <span className="text-gray-400">{k}</span>
                          <span className="font-semibold" style={{ color:"#1a0a00" }}>{v}</span>
                        </div>
                      ))}
                      {farmerDocs["aadhaar_photo"]?.verified && (
                        <div className="mt-2 text-xs text-green-700 font-semibold">✓ Aadhaar card verified</div>
                      )}
                    </div>
                    <Btn variant="green" onClick={completeFarmer} disabled={!farmerDocs["aadhaar_photo"]?.uploaded && !farmerDocs["farmer_photo"]?.uploaded}>
                      ✓ Complete Registration →
                    </Btn>
                    <p className="text-xs text-center text-gray-400">You can also complete registration without uploading documents and verify later from your profile.</p>
                    <button onClick={completeFarmer} className="w-full text-xs py-1.5 underline" style={{ color:"#FF6B00" }}>
                      Skip document upload and complete registration →
                    </button>
                    <button onClick={() => setFStep(4)} className="w-full text-xs py-2" style={{ color:"#7a5a3a" }}>← Back</button>
                  </div>
                )}
              </div>
            )}

            {/* ===== AGENT FLOW ===== */}
            {role === "agent" && (
              <div key={`agent-step-${aStep}`}>
                <div className="lg:hidden mb-4"><StepBar steps={agentSteps} current={aStep} /></div>
                <h2 className="font-display font-bold text-2xl mb-6" style={{ color:"#1a0a00" }}>{agentSteps[aStep - 1]}</h2>

                {/* A-Step 1: Phone OTP */}
                {aStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label text={T("phoneNumber")} />
                      <div className="flex gap-2">
                        <span className="flex items-center px-3 bg-white border-2 border-orange-100 rounded-xl text-sm" style={{ color:"#7a5a3a" }}>🇮🇳 +91</span>
                        <FocusInput id="agent-phone" name="agent-phone" type="tel" inputMode="numeric" maxLength={10} value={phone}
                          onChange={e => { setPhone(e.target.value.replace(/\D/g, "")); setOtpSent(false); setOtp(""); }}
                          placeholder="10-digit mobile" autoComplete="tel-national" />
                      </div>
                    </div>
                    {!otpSent ? (
                      <Btn onClick={handleSendOtp} disabled={phone.length < 10}>Send OTP →</Btn>
                    ) : !otpVerified ? (
                      <div className="space-y-3">
                        <div>
                          <Label text={T("enterOtp")} />
                          <FocusInput id="agent-otp" name="agent-otp" type="text" inputMode="numeric" maxLength={6} value={otp}
                            onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                            placeholder="6-digit OTP" inputClass="text-center tracking-[0.5em] text-xl font-mono" autoComplete="one-time-code" />
                          <p className="text-xs mt-1" style={{ color:"#FF6B00" }}>Demo OTP: <strong>123456</strong></p>
                          {otpError && <p className="text-red-500 text-xs mt-1">{otpError}</p>}
                        </div>
                        <Btn onClick={handleVerifyOtp} disabled={otp.length < 6}>Verify & Continue →</Btn>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* A-Step 2: Consent & ID */}
                {aStep === 2 && (
                  <div className="space-y-4">
                    <div className="rounded-2xl p-5 border-2" style={{ background:"#FFFBF0", borderColor:"#FFD699" }}>
                      <div className="font-bold text-sm mb-2" style={{ color:"#996600" }}>🔒 Agent Consent — DPDP Act 2023</div>
                      <ul className="space-y-1 text-xs list-disc pl-4" style={{ color:"#7a5a3a" }}>
                        <li>All documents verified by State Nodal Agency</li>
                        <li>Centre GPS location published on farmer-facing map</li>
                        <li>False documents → account suspension + legal action</li>
                      </ul>
                      <label className="flex items-start gap-2 mt-3 cursor-pointer">
                        <input type="checkbox" id="agent-consent" name="agent-consent" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 w-4 h-4" style={{ accentColor:"#FF6B00" }} />
                        <span className="text-xs font-bold" style={{ color:"#FF6B00" }}>I confirm documents are genuine and consent to DPDP Act processing</span>
                      </label>
                    </div>
                    <div>
                      <Label text={T("name")} />
                      <FocusInput id="agent-name" name="agent-name" value={name}
                        onChange={e => setName(e.target.value)} placeholder="Your full name" autoComplete="name" />
                    </div>
                    <div>
                      <Label text={T("aadhaar")} />
                      <Field id="agent-aadhaar" name="agent-aadhaar" type="text" inputMode="numeric"
                        value={aadhaar}
                        onChange={e => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                        placeholder="12-digit Aadhaar" maxLength={12} autoComplete="off" />
                    </div>
                    <Btn onClick={() => { if (consent && name.trim() && aadhaar.length === 12) setAStep(3); }} disabled={!consent || !name.trim() || aadhaar.length < 12}>Continue →</Btn>
                    <button onClick={() => setAStep(1)} className="w-full text-xs py-2" style={{ color:"#7a5a3a" }}>← Back</button>
                  </div>
                )}

                {/* A-Step 3: Centre Info */}
                {aStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label text={T("centreName")} />
                      <FocusInput id="agent-centre" name="agent-centre" value={centreName}
                        onChange={e => setCentreName(e.target.value)} placeholder="Official centre name" autoComplete="organization" />
                    </div>
                    <div>
                      <Label text={T("centreType")} />
                      <div className="flex gap-3">
                        {(["govt", "private"] as const).map(t => (
                          <button key={t} onClick={() => setCentreType(t)}
                            className="flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all"
                            style={centreType === t ? { background:"#000080", color:"white", borderColor:"#000080" } : { borderColor:"#E0E0F0", color:"#7a5a3a" }}>
                            {t === "govt" ? "🏛 Government" : "🏬 Private"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Btn onClick={() => { if (centreName.trim()) setAStep(4); }} disabled={!centreName.trim()}>Continue →</Btn>
                    <button onClick={() => setAStep(2)} className="w-full text-xs py-2" style={{ color:"#7a5a3a" }}>← Back</button>
                  </div>
                )}

                {/* A-Step 4: Location & GPS */}
                {aStep === 4 && (
                  <div className="space-y-4">
                    <LocationCascade
                      state={loc.state} district={loc.district} block={loc.block}
                      village={loc.village} postOffice={loc.postOffice} policeStation={loc.policeStation}
                      onChange={updateLoc}
                    />
                    <div>
                      <Label text={T("address")} />
                      <Field id="agent-address" name="agent-address" type="text"
                        value={address} onChange={e => setAddress(e.target.value)} placeholder="Street / building address" autoComplete="street-address" />
                    </div>
                    <div>
                      <Label text={T("pincode")} />
                      <Field id="agent-pin" name="agent-pin" type="text" inputMode="numeric"
                        value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="6-digit PIN" maxLength={6} autoComplete="postal-code" />
                    </div>
                    <div className="rounded-2xl p-4 border-2" style={{ background: lat ? "#E6F9E6" : "#eef0ff", borderColor: lat ? "#138808" : "#8888ff" }}>
                      <p className="text-sm font-bold mb-2" style={{ color: lat ? "#138808" : "#000080" }}>
                        📍 GPS Location — marks centre on farmer map
                      </p>
                      {lat ? (
                        <p className="text-xs font-mono text-green-700">✓ {lat.toFixed(4)}°N, {lng?.toFixed(4)}°E</p>
                      ) : (
                        <button onClick={requestGPS} disabled={locLoading}
                          className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background:"#000080" }}>
                          {locLoading ? "Getting location..." : "🛰 Allow GPS Location →"}
                        </button>
                      )}
                    </div>
                    <Btn onClick={() => { if (loc.state && loc.district && address && pincode) setAStep(5); }} disabled={!loc.state || !loc.district || !address || !pincode}>Continue →</Btn>
                    <button onClick={() => setAStep(3)} className="w-full text-xs py-2" style={{ color:"#7a5a3a" }}>← Back</button>
                  </div>
                )}

                {/* A-Step 5: Documents */}
                {aStep === 5 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm" style={{ color:"#7a5a3a" }}>
                        {Object.values(agentDocs).filter(d => d.verified).length} / {AGENT_DOCUMENTS.length} verified
                      </p>
                      <span className="text-xs font-bold" style={{ color:"#FF6B00" }}>Demo OTP: 123456</span>
                    </div>
                    <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                      {AGENT_DOCUMENTS.map(doc => (
                        <UploadCard key={doc.id} label={doc.name} desc={doc.desc} required={doc.required}
                          uploaded={agentDocs[doc.id]?.uploaded ?? false}
                          verified={agentDocs[doc.id]?.verified ?? false}
                          onUpload={() => handleAgentDoc(doc.id)}
                          onVerify={(o) => verifyAgentDoc(doc.id, o)} />
                      ))}
                    </div>
                    <div className="rounded-2xl p-4 border space-y-2" style={{ background:"#FFF9F3", borderColor:"#FFE0C0" }}>
                      <div className="font-bold text-sm mb-2" style={{ color:"#1a0a00" }}>Review & Submit</div>
                      {[["Name", name],["Phone","+91 "+phone],["Centre",centreName],["Type",centreType==="govt"?"Government":"Private"],["State",`${loc.district}, ${loc.state}`],["PIN",pincode],["Docs Verified",`${Object.values(agentDocs).filter(d=>d.verified).length} / ${AGENT_DOCUMENTS.length}`]].map(([k,v])=>(
                        <div key={k as string} className="flex justify-between text-xs py-0.5 border-b" style={{ borderColor:"#FFE8D0" }}>
                          <span className="text-gray-400">{k}</span>
                          <span className="font-bold" style={{ color:"#1a0a00" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl p-4 text-xs border-2" style={{ background:"#FFFBF0", borderColor:"#FFD699", color:"#996600" }}>
                      ⚠ Application reviewed by State Nodal Agency within 3 working days. You can use the platform while verification is pending.
                    </div>
                    <Btn variant="green" onClick={completeAgent}>✓ Submit Application →</Btn>
                    <button onClick={() => setAStep(4)} className="w-full text-xs py-2" style={{ color:"#7a5a3a" }}>← Back</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
