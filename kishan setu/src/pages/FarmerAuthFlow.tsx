import { useState } from "react";
import { useAuth, FarmerUser } from "../auth";
import { t, INDIAN_STATES, CROPS } from "../i18n";

type Step =
  | "phone" | "otp" | "consent" | "name_aadhaar"
  | "land_bank" | "kisan_dbt" | "complete";

const DEMO_PHONE = "9876543210";
const DEMO_OTP = "123456";

function maskAadhaar(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 12);
  if (d.length <= 4) return d;
  const visible = d.slice(-4);
  const x = "XXXX XXXX " + visible;
  return x;
}

function maskBank(v: string) {
  const d = v.replace(/\D/g, "");
  if (d.length <= 4) return d;
  return "XXXXXXXX" + d.slice(-4);
}

interface Props {
  lang: Parameters<typeof t>[1];
  onBack: () => void;
  mode: "login" | "register";
}

export default function FarmerAuthFlow({ lang, onBack, mode }: Props) {
  const { login } = useAuth();
  const [step, setStep] = useState<Step>(mode === "login" ? "phone" : "phone");
  const [flowMode, setFlowMode] = useState<"login" | "register">(mode);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [village, setVillage] = useState("");
  const [landAcres, setLandAcres] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [pan, setPan] = useState("");
  const [kisanCard, setKisanCard] = useState("");
  const [dbtLinked, setDbtLinked] = useState(false);

  function handleSendOtp() {
    if (phone.length < 10) return;
    setOtpSent(true);
    setOtpError("");
  }

  function handleVerifyOtp() {
    if (otp !== DEMO_OTP) { setOtpError("Incorrect OTP. Demo: 123456"); return; }
    setOtpError("");
    if (flowMode === "login" && phone === DEMO_PHONE) {
      const user: FarmerUser = {
        role: "farmer", id: "KF-" + phone.slice(-6),
        name: "Ramesh Kumar", phone,
        aadhaarMasked: "XXXX XXXX 4321",
        state: "Uttar Pradesh", district: "Lucknow",
        block: "Malihabad", village: "Khanpur",
        farmerId: "PM-KISAN-2024-UP-12345",
        bankMasked: "XXXXXXXX4821",
        ifscMasked: "SBI0001234",
        panMasked: "ABCPK****",
        kycStatus: "verified",
        dbtLinked: true,
        kisanCard: "KCC-UP-2024-98765",
        landAcres: 3.5,
        registeredAt: new Date().toISOString(),
      };
      login(user);
    } else if (flowMode === "login") {
      setOtpError("Phone not registered. Please register.");
    } else {
      setStep("consent");
    }
  }

  function handleComplete() {
    const user: FarmerUser = {
      role: "farmer",
      id: "KF-" + phone.slice(-6),
      name: name || "Demo Farmer",
      phone,
      aadhaarMasked: aadhaar ? "XXXX XXXX " + aadhaar.replace(/\D/g, "").slice(-4) : "XXXX XXXX 0000",
      state: state || "Uttar Pradesh",
      district: district || "Lucknow",
      block: block || "Malihabad",
      village: village || "Khanpur",
      farmerId: "PM-KISAN-2026-" + state.slice(0, 2).toUpperCase() + "-" + Math.floor(Math.random() * 90000 + 10000),
      bankMasked: bankAccount ? "XXXXXXXX" + bankAccount.slice(-4) : "XXXXXXXX4821",
      ifscMasked: ifsc || "SBI0001234",
      panMasked: pan ? pan.slice(0, 5) + "****" : "ABCPK****",
      kycStatus: "pending",
      dbtLinked,
      kisanCard: kisanCard || "",
      landAcres: parseFloat(landAcres) || 0,
      registeredAt: new Date().toISOString(),
    };
    login(user);
  }

  const Label = ({ text }: { text: string }) => (
    <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">{text}</label>
  );

  const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b] bg-white"
    />
  );

  const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select
      {...props}
      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b] bg-white"
    />
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-[#1a3a6b] px-5 py-4 flex items-center gap-3">
          <button onClick={onBack} className="text-white/70 hover:text-white text-sm">←</button>
          <div>
            <div className="text-white font-bold text-sm">🌾 {t("iAmFarmer", lang)}</div>
            <div className="text-blue-200 text-xs">{flowMode === "login" ? t("login", lang) : t("register", lang)}</div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {step === "phone" && (
            <>
              <div>
                <Label text={t("phoneNumber", lang)} />
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">🇮🇳 +91</span>
                  <Input
                    type="tel" maxLength={10} value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile"
                  />
                </div>
              </div>
              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  disabled={phone.length < 10}
                  className="w-full py-3 bg-[#1a3a6b] text-white rounded-xl font-semibold disabled:opacity-40"
                >
                  {t("sendOtp", lang)}
                </button>
              ) : (
                <>
                  <div>
                    <Label text={t("enterOtp", lang)} />
                    <Input
                      type="text" maxLength={6} value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="6-digit OTP"
                    />
                    <p className="text-xs text-[#d4500a] mt-1">{t("demoOtp", lang)}</p>
                    {otpError && <p className="text-xs text-red-600 mt-1">{otpError}</p>}
                  </div>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={otp.length < 6}
                    className="w-full py-3 bg-[#d4500a] text-white rounded-xl font-semibold disabled:opacity-40"
                  >
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
                <div className="font-bold text-amber-800">DPDP Act 2023 — Data Consent</div>
                <p>Under the Digital Personal Data Protection Act 2023, KishanSetu collects your personal data (name, Aadhaar, bank details, land records) solely for agricultural procurement services.</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Data is shared only with authorized procurement centres and government PFMS/DBT systems</li>
                  <li>Aadhaar is stored masked (XXXX XXXX XXXX) and never in full</li>
                  <li>You may withdraw consent and request deletion at any time via Grievance portal</li>
                  <li>No commercial use of your data. No third-party sale.</li>
                </ul>
                <label className="flex items-start gap-2 pt-2 cursor-pointer">
                  <input type="checkbox" checked={consentGiven} onChange={e => setConsentGiven(e.target.checked)} className="mt-0.5" />
                  <span className="font-semibold">I have read and give explicit consent for data processing under DPDP Act 2023</span>
                </label>
              </div>
              <button
                onClick={() => { if (consentGiven) setStep("name_aadhaar"); }}
                disabled={!consentGiven}
                className="w-full py-3 bg-[#1a3a6b] text-white rounded-xl font-semibold disabled:opacity-40"
              >
                {t("next", lang)}
              </button>
            </>
          )}

          {step === "name_aadhaar" && (
            <>
              <div>
                <Label text={t("name", lang)} />
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="As per Aadhaar card" />
              </div>
              <div>
                <Label text={t("aadhaar", lang)} />
                <Input
                  value={aadhaar} onChange={e => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 12);
                    setAadhaar(v);
                  }}
                  placeholder="XXXX XXXX XXXX (masked)"
                  maxLength={12}
                />
                <p className="text-xs text-gray-400 mt-1">Stored masked as XXXX XXXX XXXX per UIDAI norms</p>
              </div>
              <div>
                <Label text={t("state", lang)} />
                <Select value={state} onChange={e => setState(e.target.value)}>
                  <option value="">-- Select State --</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div>
                <Label text={t("district", lang)} />
                <Input value={district} onChange={e => setDistrict(e.target.value)} placeholder="District" />
              </div>
              <div>
                <Label text={t("block", lang)} />
                <Input value={block} onChange={e => setBlock(e.target.value)} placeholder="Block / Tehsil" />
              </div>
              <div>
                <Label text={t("village", lang)} />
                <Input value={village} onChange={e => setVillage(e.target.value)} placeholder="Village / Town" />
              </div>
              <button
                onClick={() => setStep("land_bank")}
                disabled={!name || !aadhaar || !state}
                className="w-full py-3 bg-[#1a3a6b] text-white rounded-xl font-semibold disabled:opacity-40"
              >
                {t("next", lang)}
              </button>
            </>
          )}

          {step === "land_bank" && (
            <>
              <div className="text-xs font-bold text-[#1a3a6b] mb-1">Land & Bank Details</div>
              <div>
                <Label text={t("landAcres", lang)} />
                <Input type="number" value={landAcres} onChange={e => setLandAcres(e.target.value)} placeholder="e.g. 2.5" />
              </div>
              <div>
                <Label text={t("bankAccount", lang)} />
                <Input value={bankAccount} onChange={e => setBankAccount(e.target.value.replace(/\D/g, ""))} placeholder="Account number" />
                <p className="text-xs text-gray-400 mt-1">Stored as XXXXXXXX{bankAccount.slice(-4) || "****"}</p>
              </div>
              <div>
                <Label text={t("ifsc", lang)} />
                <Input value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} placeholder="e.g. SBIN0012345" maxLength={11} />
              </div>
              <div>
                <Label text={t("pan", lang)} />
                <Input value={pan} onChange={e => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} />
              </div>
              <button
                onClick={() => setStep("kisan_dbt")}
                disabled={!bankAccount || !ifsc}
                className="w-full py-3 bg-[#1a3a6b] text-white rounded-xl font-semibold disabled:opacity-40"
              >
                {t("next", lang)}
              </button>
              <button onClick={() => setStep("name_aadhaar")} className="w-full py-2 text-sm text-gray-500 underline">{t("back", lang)}</button>
            </>
          )}

          {step === "kisan_dbt" && (
            <>
              <div className="text-xs font-bold text-[#1a3a6b] mb-1">Kisan Card & DBT Link</div>
              <div>
                <Label text={t("farmerId", lang)} />
                <Input value={kisanCard} onChange={e => setKisanCard(e.target.value)} placeholder="PM-KISAN / Kisan Credit Card No." />
              </div>
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
                <input
                  type="checkbox" checked={dbtLinked} onChange={e => setDbtLinked(e.target.checked)}
                  className="mt-0.5 accent-[#1a3a6b]"
                />
                <div>
                  <div className="text-sm font-semibold text-[#1a3a6b]">{t("dbtLink", lang)}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Link your bank account to receive MSP payments via PFMS/DBT directly</div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <div className="text-xs font-bold text-[#1a3a6b] mb-1">Registration Summary</div>
                <div className="text-xs text-gray-600 space-y-0.5">
                  <div>Name: <span className="font-semibold">{name}</span></div>
                  <div>Phone: <span className="font-semibold">+91 {phone}</span></div>
                  <div>Aadhaar: <span className="font-semibold">{maskAadhaar(aadhaar)}</span></div>
                  <div>Bank: <span className="font-semibold">{maskBank(bankAccount)}</span></div>
                  <div>State: <span className="font-semibold">{state}, {district}</span></div>
                </div>
              </div>
              <button
                onClick={handleComplete}
                className="w-full py-3 bg-[#d4500a] text-white rounded-xl font-bold text-base"
              >
                Complete Registration →
              </button>
              <button onClick={() => setStep("land_bank")} className="w-full py-2 text-sm text-gray-500 underline">{t("back", lang)}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
