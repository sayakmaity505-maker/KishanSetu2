import { useState } from "react";
import { useAuth, AgentUser } from "../auth";
import { t, INDIAN_STATES, AGENT_DOCUMENTS } from "../i18n";

type Step = "phone" | "otp" | "consent" | "basic" | "address" | "location" | "documents" | "complete";

const DEMO_PHONE = "9988776655";
const DEMO_OTP = "123456";

interface Props {
  lang: Parameters<typeof t>[1];
  onBack: () => void;
  mode: "login" | "register";
}

export default function AgentAuthFlow({ lang, onBack, mode }: Props) {
  const { login } = useAuth();
  const [step, setStep] = useState<Step>("phone");
  const [flowMode, setFlowMode] = useState<"login" | "register">(mode);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [centreName, setCentreName] = useState("");
  const [centreType, setCentreType] = useState<"govt" | "private">("private");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [docStatus, setDocStatus] = useState<Record<string, "none" | "uploaded" | "verified">>({});
  const [docOtp, setDocOtp] = useState<Record<string, string>>({});
  const [docOtpSent, setDocOtpSent] = useState<Record<string, boolean>>({});

  function handleSendOtp() {
    if (phone.length < 10) return;
    setOtpSent(true); setOtpError("");
  }

  function handleVerifyOtp() {
    if (otp !== DEMO_OTP) { setOtpError("Incorrect OTP. Demo: 123456"); return; }
    setOtpError("");
    if (flowMode === "login" && phone === DEMO_PHONE) {
      const user: AgentUser = {
        role: "agent", id: "AGT-" + phone.slice(-6),
        name: "Suresh Patel", phone,
        aadhaarMasked: "XXXX XXXX 9876",
        centreName: "State Agri Warehouse Complex",
        centreType: "govt",
        state: "Uttar Pradesh", district: "Lucknow",
        block: "Sadar", address: "NH-28, Amausi, Lucknow",
        pincode: "226001", lat: 26.8467, lng: 80.9462,
        documentsStatus: "verified",
        registeredAt: new Date().toISOString(),
      };
      login(user);
    } else if (flowMode === "login") {
      setOtpError("Phone not registered. Please register.");
    } else {
      setStep("consent");
    }
  }

  function handleGetLocation() {
    if (!navigator.geolocation) { setLocationDenied(true); return; }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLat(pos.coords.latitude); setLng(pos.coords.longitude); setLocationLoading(false); },
      () => { setLocationDenied(true); setLocationLoading(false); }
    );
  }

  function handleDocOtpSend(docId: string) {
    setDocOtpSent(prev => ({ ...prev, [docId]: true }));
    setDocStatus(prev => ({ ...prev, [docId]: "uploaded" }));
  }

  function handleDocOtpVerify(docId: string) {
    if (docOtp[docId] !== DEMO_OTP) return;
    setDocStatus(prev => ({ ...prev, [docId]: "verified" }));
  }

  function handleComplete() {
    const verifiedCount = Object.values(docStatus).filter(s => s === "verified").length;
    const user: AgentUser = {
      role: "agent",
      id: "AGT-" + phone.slice(-6),
      name: name || "Demo Agent",
      phone,
      aadhaarMasked: aadhaar ? "XXXX XXXX " + aadhaar.replace(/\D/g, "").slice(-4) : "XXXX XXXX 0000",
      centreName: centreName || "KishanSetu Centre",
      centreType,
      state: state || "Uttar Pradesh",
      district: district || "Lucknow",
      block: block || "Sadar",
      address: address || "Demo Address",
      pincode: pincode || "000000",
      lat, lng,
      documentsStatus: verifiedCount >= 8 ? "verified" : "pending",
      registeredAt: new Date().toISOString(),
    };
    login(user);
  }

  const Label = ({ text }: { text: string }) => (
    <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">{text}</label>
  );
  const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b] bg-white" />
  );
  const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b] bg-white" />
  );

  const requiredDocs = AGENT_DOCUMENTS.filter(d => d.required);
  const allRequiredVerified = requiredDocs.every(d => docStatus[d.id] === "verified");

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-[#1a3a6b] px-5 py-4 flex items-center gap-3">
          <button onClick={onBack} className="text-white/70 hover:text-white text-sm">←</button>
          <div>
            <div className="text-white font-bold text-sm">🏢 {t("iAmAgent", lang)}</div>
            <div className="text-blue-200 text-xs">{flowMode === "login" ? t("login", lang) : t("register", lang)}</div>
          </div>
          {step !== "phone" && step !== "otp" && step !== "consent" && (
            <div className="ml-auto text-xs text-blue-200">
              {["basic","address","location","documents","complete"].indexOf(step) + 1} / 5
            </div>
          )}
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {step === "phone" && (
            <>
              <div>
                <Label text={t("phoneNumber", lang)} />
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">🇮🇳 +91</span>
                  <Input type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile" />
                </div>
              </div>
              {!otpSent ? (
                <button onClick={handleSendOtp} disabled={phone.length < 10} className="w-full py-3 bg-[#1a3a6b] text-white rounded-xl font-semibold disabled:opacity-40">
                  {t("sendOtp", lang)}
                </button>
              ) : (
                <>
                  <div>
                    <Label text={t("enterOtp", lang)} />
                    <Input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="6-digit OTP" />
                    <p className="text-xs text-[#d4500a] mt-1">{t("demoOtp", lang)}</p>
                    {otpError && <p className="text-xs text-red-600 mt-1">{otpError}</p>}
                  </div>
                  <button onClick={handleVerifyOtp} disabled={otp.length < 6} className="w-full py-3 bg-[#d4500a] text-white rounded-xl font-semibold disabled:opacity-40">
                    {t("verifyOtp", lang)}
                  </button>
                </>
              )}
              <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-100">
                {flowMode === "login" ? (
                  <>{t("newUser", lang)} <button onClick={() => setFlowMode("register")} className="text-[#1a3a6b] font-semibold underline">{t("registerHere", lang)}</button></>
                ) : (
                  <>{t("alreadyRegistered", lang)} <button onClick={() => setFlowMode("login")} className="text-[#1a3a6b] font-semibold underline">{t("loginHere", lang)}</button></>
                )}
              </div>
            </>
          )}

          {step === "consent" && (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-gray-700 space-y-2">
                <div className="font-bold text-amber-800">DPDP Act 2023 — Agent Consent</div>
                <p>KishanSetu collects your business documents and personal details for verification as an authorized procurement agent.</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Documents verified by State Nodal Agency and Agriculture Ministry</li>
                  <li>Data shared with PFMS/DBT for payment rails only</li>
                  <li>Centre location published on public farmer-facing map</li>
                  <li>False documents → account suspension and legal action</li>
                </ul>
                <label className="flex items-start gap-2 pt-2 cursor-pointer">
                  <input type="checkbox" checked={consentGiven} onChange={e => setConsentGiven(e.target.checked)} className="mt-0.5" />
                  <span className="font-semibold">I confirm all documents uploaded will be genuine and I consent to DPDP Act 2023 data processing</span>
                </label>
              </div>
              <button onClick={() => { if (consentGiven) setStep("basic"); }} disabled={!consentGiven} className="w-full py-3 bg-[#1a3a6b] text-white rounded-xl font-semibold disabled:opacity-40">
                {t("next", lang)}
              </button>
            </>
          )}

          {step === "basic" && (
            <>
              <div className="text-xs font-bold text-[#1a3a6b]">Step 1: Basic Info</div>
              <div><Label text={t("name", lang)} /><Input value={name} onChange={e => setName(e.target.value)} placeholder="Agent full name" /></div>
              <div><Label text={t("aadhaar", lang)} /><Input value={aadhaar} onChange={e => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="12-digit Aadhaar" maxLength={12} /></div>
              <div><Label text={t("centreName", lang)} /><Input value={centreName} onChange={e => setCentreName(e.target.value)} placeholder="Procurement centre name" /></div>
              <div>
                <Label text={t("centreType", lang)} />
                <div className="flex gap-2">
                  <button onClick={() => setCentreType("govt")} className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border-2 transition-all ${centreType === "govt" ? "border-[#1a3a6b] bg-[#1a3a6b] text-white" : "border-gray-200 text-gray-600"}`}>
                    🏛 {t("govtCentre", lang)}
                  </button>
                  <button onClick={() => setCentreType("private")} className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border-2 transition-all ${centreType === "private" ? "border-[#1a3a6b] bg-[#1a3a6b] text-white" : "border-gray-200 text-gray-600"}`}>
                    🏬 {t("privateCentre", lang)}
                  </button>
                </div>
              </div>
              <button onClick={() => setStep("address")} disabled={!name || !centreName} className="w-full py-3 bg-[#1a3a6b] text-white rounded-xl font-semibold disabled:opacity-40">{t("next", lang)}</button>
            </>
          )}

          {step === "address" && (
            <>
              <div className="text-xs font-bold text-[#1a3a6b]">Step 2: Centre Address</div>
              <div><Label text={t("state", lang)} /><Select value={state} onChange={e => setState(e.target.value)}><option value="">-- Select State --</option>{INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}</Select></div>
              <div><Label text={t("district", lang)} /><Input value={district} onChange={e => setDistrict(e.target.value)} placeholder="District" /></div>
              <div><Label text={t("block", lang)} /><Input value={block} onChange={e => setBlock(e.target.value)} placeholder="Block / Municipality" /></div>
              <div><Label text={t("address", lang)} /><Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address" /></div>
              <div><Label text={t("pincode", lang)} /><Input value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit PIN" maxLength={6} /></div>
              <button onClick={() => setStep("location")} disabled={!state || !district || !pincode} className="w-full py-3 bg-[#1a3a6b] text-white rounded-xl font-semibold disabled:opacity-40">{t("next", lang)}</button>
              <button onClick={() => setStep("basic")} className="w-full py-2 text-sm text-gray-500 underline">{t("back", lang)}</button>
            </>
          )}

          {step === "location" && (
            <>
              <div className="text-xs font-bold text-[#1a3a6b]">Step 3: GPS Location</div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📍</div>
                <div className="text-sm font-semibold text-[#1a3a6b]">{t("allowLocation", lang)}</div>
                <div className="text-xs text-gray-500 mt-1">{t("locationDesc", lang)}</div>
                {lat && lng ? (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-2 text-xs text-green-800">
                    ✓ {t("locationMarked", lang)}<br/>
                    <span className="font-mono">{lat.toFixed(4)}°N, {lng.toFixed(4)}°E</span>
                  </div>
                ) : locationDenied ? (
                  <div className="mt-3 text-xs text-red-600">{t("locationDenied", lang)}</div>
                ) : (
                  <button
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                    className="mt-3 px-4 py-2 bg-[#1a3a6b] text-white rounded-lg text-xs font-semibold"
                  >
                    {locationLoading ? "Getting location..." : t("preciseLocation", lang)}
                  </button>
                )}
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <div className="text-xs font-semibold text-gray-600 mb-2">Or enter approximate coordinates manually:</div>
                <div className="flex gap-2">
                  <Input type="number" step="0.0001" placeholder="Latitude" value={lat ?? ""} onChange={e => setLat(parseFloat(e.target.value) || null)} />
                  <Input type="number" step="0.0001" placeholder="Longitude" value={lng ?? ""} onChange={e => setLng(parseFloat(e.target.value) || null)} />
                </div>
              </div>
              <button onClick={() => setStep("documents")} className="w-full py-3 bg-[#1a3a6b] text-white rounded-xl font-semibold">{t("next", lang)}</button>
              <button onClick={() => setStep("address")} className="w-full py-2 text-sm text-gray-500 underline">{t("back", lang)}</button>
            </>
          )}

          {step === "documents" && (
            <>
              <div className="text-xs font-bold text-[#1a3a6b]">Step 4: Upload 16 Documents</div>
              <div className="text-xs text-gray-500 mb-2">Required documents must be OTP-verified. Demo OTP: <span className="font-bold text-[#d4500a]">123456</span></div>
              <div className="space-y-3">
                {AGENT_DOCUMENTS.map(doc => {
                  const status = docStatus[doc.id] || "none";
                  const sent = docOtpSent[doc.id];
                  return (
                    <div key={doc.id} className={`rounded-xl border p-3 ${status === "verified" ? "border-green-300 bg-green-50" : doc.required ? "border-gray-200 bg-white" : "border-dashed border-gray-200 bg-gray-50"}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-[#1a3a6b]">{doc.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{doc.desc}</div>
                          <div className="mt-0.5">
                            <span className={`text-xs font-semibold ${doc.required ? "text-red-500" : "text-gray-400"}`}>
                              {doc.required ? t("documentRequired", lang) : t("documentOptional", lang)}
                            </span>
                          </div>
                        </div>
                        {status === "verified" ? (
                          <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg flex-shrink-0">{t("docVerified", lang)}</span>
                        ) : (
                          <button
                            onClick={() => handleDocOtpSend(doc.id)}
                            className="text-xs font-semibold text-[#1a3a6b] bg-blue-50 border border-blue-200 px-2 py-1 rounded-lg flex-shrink-0 hover:bg-blue-100"
                          >
                            {status === "uploaded" ? t("verifyDoc", lang) : t("uploadDoc", lang)}
                          </button>
                        )}
                      </div>
                      {sent && status !== "verified" && (
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text" maxLength={6} placeholder="Enter OTP"
                            value={docOtp[doc.id] || ""}
                            onChange={e => setDocOtp(prev => ({ ...prev, [doc.id]: e.target.value.replace(/\D/g, "") }))}
                            className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs"
                          />
                          <button
                            onClick={() => handleDocOtpVerify(doc.id)}
                            disabled={(docOtp[doc.id] || "").length < 6}
                            className="text-xs bg-[#d4500a] text-white px-2 py-1.5 rounded-lg font-semibold disabled:opacity-40"
                          >
                            Verify
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-2">
                  {Object.values(docStatus).filter(s => s === "verified").length} / {AGENT_DOCUMENTS.length} documents verified
                  {!allRequiredVerified && <span className="text-red-500 ml-1">(Required docs pending)</span>}
                </div>
                <button
                  onClick={handleComplete}
                  disabled={!allRequiredVerified}
                  className="w-full py-3 bg-[#d4500a] text-white rounded-xl font-bold disabled:opacity-40"
                >
                  Submit Registration →
                </button>
                <button
                  onClick={handleComplete}
                  className="w-full py-2 text-xs text-gray-400 underline mt-1"
                >
                  Skip (Demo mode — proceed with incomplete docs)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
