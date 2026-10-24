import { useState, useEffect } from "react";
import { useStore, Booking, formatINR } from "../store";

type Screen =
  | "splash"
  | "language"
  | "login"
  | "otp"
  | "consent"
  | "registration"
  | "kyc"
  | "kyc-success"
  | "dashboard"
  | "find-centre"
  | "crop-prices"
  | "book-slot"
  | "booking-confirmation"
  | "my-bookings"
  | "await-decision"
  | "queue-tracking"
  | "post-collection"
  | "grievance"
  | "notifications"
  | "profile"
  | "voice-assistant";

interface Props {
  onBack: () => void;
  guidedScreen?: string;
}

function QRCode({ value }: { value: string }) {
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,0,0,0,0,0,0],
    [1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,0],
    [0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,1],
    [1,0,1,1,0,1,1,0,1,1,0,0,1,1,1,0,1,0,1,1,0],
    [0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,1],
    [1,1,1,0,0,1,1,0,1,0,0,1,1,0,1,1,0,1,1,0,0],
    [0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,0,1,1,0,1,0],
    [1,0,0,0,0,0,1,0,1,1,1,0,1,1,0,1,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,0,1,0,0,1,0,1,1,1,0,0],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,0,1,0,0,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,0,1,1,0,1,1],
  ];
  const cellSize = 7;
  const size = pattern.length * cellSize;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="qr-svg">
      <rect width={size} height={size} fill="white" />
      {pattern.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#1a2332"
            />
          ) : null
        )
      )}
      <text x={size/2} y={size + 12} textAnchor="middle" fontSize="7" fill="#4a6080" fontFamily="monospace">{value}</text>
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; dot: string }> = {
    pending: { label: "🟡 Pending", cls: "badge-pending", dot: "#d97706" },
    accepted: { label: "🟢 Accepted", cls: "badge-accepted", dot: "#1a6b2e" },
    rejected: { label: "🔴 Rejected", cls: "badge-rejected", dot: "#b91c1c" },
    rescheduled: { label: "🔵 Rescheduled", cls: "badge-rescheduled", dot: "#6d28d9" },
    completed: { label: "✅ Completed", cls: "badge-completed", dot: "#1a3a6b" },
    cancelled: { label: "⚫ Cancelled", cls: "badge-rejected", dot: "#4a6080" },
    verified: { label: "🟢 KYC Verified", cls: "badge-verified", dot: "#1a6b2e" },
    processing: { label: "🟡 Processing", cls: "badge-processing", dot: "#d97706" },
    credited: { label: "🟢 Credited", cls: "badge-credited", dot: "#1a6b2e" },
    failed: { label: "🔴 Failed", cls: "badge-failed", dot: "#b91c1c" },
  };
  const s = map[status] ?? { label: status, cls: "badge-pending", dot: "#d97706" };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  );
}

function MobileHeader({
  title,
  onBack,
  notifications = 0,
  onNotifications,
}: {
  title: string;
  onBack?: () => void;
  notifications?: number;
  onNotifications?: () => void;
}) {
  return (
    <div className="bg-[#1a3a6b] text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
      {onBack && (
        <button onClick={onBack} className="text-white/80 hover:text-white p-1">
          ←
        </button>
      )}
      <div className="flex-1">
        <p className="font-semibold text-sm leading-tight">{title}</p>
      </div>
      {onNotifications && (
        <button onClick={onNotifications} className="relative p-1">
          🔔
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-[#d4500a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {notifications}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export default function FarmerApp({ onBack, guidedScreen }: Props) {
  const { state, dispatch } = useStore();
  const [screen, setScreen] = useState<Screen>("splash");
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState("9876543210");
  const [consentChecked, setConsentChecked] = useState(false);
  const [newBooking, setNewBooking] = useState<Booking | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<string | null>("KS-2026-001284");
  const [bookForm, setBookForm] = useState({
    crop: "Wheat",
    quantity: "50",
    centreId: "CTR-024",
    date: "12 September 2026",
    slot: "10:00 – 11:00",
  });
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [grievanceForm, setGrievanceForm] = useState({ category: "Booking", description: "" });
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);
  const [grievanceId] = useState(() => `GRV-2026-${Math.floor(Math.random() * 90000 + 10000)}`);
  const [grievanceBookingId, setGrievanceBookingId] = useState("KS-2026-001284");

  const farmer = state.farmers.find((f) => f.id === "F001")!;
  const myBookings = state.bookings.filter((b) => b.farmerId === "F001");
  const myNotifications = state.notifications.filter((n) => n.farmerId === "F001");
  const unreadCount = myNotifications.filter((n) => !n.read).length;
  const pendingBooking = state.bookings.find((b) => b.id === "KS-2026-001284");
  const completedBooking = state.bookings.find((b) => b.id === "KS-2026-001280");
  const completedTxn = state.transactions.find((t) => t.bookingId === "KS-2026-001280");

  useEffect(() => {
    if (!guidedScreen) return;
    dispatch({ type: "SET_CURRENT_FARMER", farmerId: "F001" });
    if (guidedScreen === "dashboard") {
      setScreen("dashboard");
    } else if (guidedScreen === "await-decision") {
      const booking = state.bookings.find((b) => b.id === "KS-2026-001284");
      setScreen(booking && booking.status === "accepted" ? "queue-tracking" : "await-decision");
    } else if (guidedScreen === "post-collection") {
      setScreen("post-collection");
    }
  }, [guidedScreen, state.bookings]);

  // Only run splash→language transition when NOT in guided demo mode
  useEffect(() => {
    if (guidedScreen) return;
    const t = setTimeout(() => setScreen("language"), 2000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = () => {
    if (otp === "123456" || otp === "") {
      dispatch({ type: "SET_CURRENT_FARMER", farmerId: "F001" });
      setScreen("consent");
    }
  };

  const handleBookSlot = () => {
    const centre = state.centres.find((c) => c.id === bookForm.centreId)!;
    const id = `KS-2026-001${Math.floor(Math.random() * 900 + 100)}`;
    const booking: Booking = {
      id,
      farmerId: "F001",
      farmerName: farmer.name,
      centreId: centre.id,
      centreName: centre.name,
      crop: bookForm.crop,
      quantity: parseInt(bookForm.quantity),
      date: bookForm.date,
      slot: bookForm.slot,
      status: "pending",
      kycVerified: true,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "CREATE_BOOKING", booking });
    dispatch({
      type: "ADD_NOTIFICATION",
      notification: {
        id: `N${Date.now()}`,
        farmerId: "F001",
        message: `Your procurement request ${id} has been submitted.`,
        hindi: `आपका खरीद अनुरोध ${id} सबमिट हो गया है।`,
        type: "booking",
        read: false,
        createdAt: new Date().toISOString(),
      },
    });
    setNewBooking(booking);
    setSelectedBooking(id);
    setScreen("booking-confirmation");
  };

  const slots = [
    { time: "09:00 – 10:00", available: true },
    { time: "10:00 – 11:00", available: true },
    { time: "11:00 – 12:00", available: false },
    { time: "12:00 – 13:00", available: true },
    { time: "13:00 – 14:00", available: true },
    { time: "14:00 – 15:00", available: false },
  ];

  const simulateVoice = () => {
    setVoiceActive(true);
    setVoiceText("...");
    setTimeout(() => {
      setVoiceText("मेरा स्लॉट कब है?");
      setTimeout(() => {
        setVoiceText("आपका स्लॉट 12 सितंबर को सुबह 10:00 बजे है। Burdwan Wheat Procurement Centre, CTR-024.");
        setVoiceActive(false);
      }, 1500);
    }, 1000);
  };

  const currentBooking = selectedBooking
    ? state.bookings.find((b) => b.id === selectedBooking) ?? pendingBooking
    : pendingBooking;

  // ---- SCREENS ----

  if (screen === "splash") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="flex flex-col items-center justify-center h-full min-h-[700px] bg-gradient-to-b from-[#1a3a6b] to-[#0e2247] text-white animate-fade px-8">
            <div className="text-6xl mb-4">🌾</div>
            <h1 className="text-3xl font-bold mb-1">Kishan<span className="text-[#f5c842]">सेतु</span></h1>
            <p className="text-[#93c5fd] text-sm mb-8 hindi">किसान और केंद्र के बीच एक स्मार्ट सेतु</p>
            <div className="flex gap-1 mt-4">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />
              ))}
            </div>
            <p className="text-xs text-[#4a6080] mt-16 text-center">
              A Digital Agriculture Initiative<br/>
              SIH 2026 Prototype
            </p>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "language") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen bg-white px-6 pt-12 pb-8 animate-fade">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🌾</div>
              <h1 className="text-2xl font-bold text-[#1a3a6b]">KishanSetu</h1>
              <p className="text-[#4a6080] text-sm mt-1">Choose your language / अपनी भाषा चुनें</p>
            </div>
            <div className="space-y-3 mb-8">
              {[
                { code: "hi", label: "हिंदी", sub: "Hindi" },
                { code: "en", label: "English", sub: "अंग्रेजी" },
                { code: "bn", label: "বাংলা", sub: "Bengali" },
                { code: "ta", label: "தமிழ்", sub: "Tamil" },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code as "en" | "hi"); setScreen("login"); }}
                  className="w-full text-left border-2 border-[#c0d0e2] hover:border-[#1a3a6b] hover:bg-[#e8eef8] rounded-xl p-4 flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="font-bold text-lg text-[#1a2332]">{l.label}</p>
                    <p className="text-sm text-[#4a6080]">{l.sub}</p>
                  </div>
                  <span className="text-[#1a3a6b]">→</span>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-[#4a6080]">
              Bhashini multilingual support enabled<br/>
              <span className="text-[#d4500a]">🎙️ Voice input available</span>
            </p>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "login") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen bg-white animate-fade">
            <div className="bg-[#1a3a6b] text-white px-6 py-8 text-center">
              <div className="text-4xl mb-2">👨‍🌾</div>
              <h2 className="text-xl font-bold">KishanSetu Login</h2>
              <p className="text-[#93c5fd] text-sm mt-1">किसान पंजीकरण / Farmer Registration</p>
            </div>
            <div className="px-6 py-8">
              {/* Demo credentials hint */}
              <div className="bg-[#fef3c7] border border-[#fcd34d] rounded-lg p-3 mb-6 text-xs">
                <p className="font-semibold text-[#92400e] mb-1">⚠ Demo Credentials</p>
                <p className="text-[#92400e]">Mobile: <span className="font-bold mono">9876543210</span></p>
                <p className="text-[#92400e]">OTP: <span className="font-bold mono">123456</span></p>
              </div>
              <div className="mb-5">
                <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Mobile Number / मोबाइल नंबर</label>
                <div className="flex">
                  <span className="bg-[#eef2f7] border border-r-0 border-[#c0d0e2] rounded-l px-3 flex items-center text-sm text-[#4a6080] font-semibold">+91</span>
                  <input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="flex-1 border border-[#c0d0e2] rounded-r px-4 py-3 text-base font-medium focus:outline-none focus:border-[#1a3a6b]"
                    placeholder="10-digit mobile number"
                    type="tel"
                    maxLength={10}
                  />
                </div>
              </div>
              <button
                onClick={() => setScreen("otp")}
                className="w-full bg-[#1a3a6b] text-white font-bold py-3.5 rounded text-base mb-4"
              >
                Send OTP / OTP भेजें
              </button>
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e0e8f0]" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-[#4a6080]">or / या</span></div>
              </div>
              <button className="w-full border-2 border-[#1a3a6b] text-[#1a3a6b] font-semibold py-3 rounded text-sm flex items-center justify-center gap-2">
                🎙️ <span className="hindi">बोलकर पूछें</span> / Voice Login
              </button>
              <p className="text-center text-xs text-[#4a6080] mt-6">
                No smartphone? Call <span className="font-bold text-[#1a3a6b]">1800-XXX-XXXX</span> (IVR available)
              </p>
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "otp") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen bg-white animate-slide">
            <MobileHeader title="Enter OTP" onBack={() => setScreen("login")} />
            <div className="px-6 py-8 text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg font-bold text-[#1a2332] mb-1">Verify Mobile Number</h3>
              <p className="text-sm text-[#4a6080] mb-2">OTP sent to +91 {mobile}</p>
              <p className="text-xs text-[#d4500a] mb-6">Demo OTP: <span className="font-bold mono">123456</span></p>
              <div className="flex gap-2 justify-center mb-6">
                {[0,1,2,3,4,5].map((i) => (
                  <input
                    key={i}
                    value={otp[i] ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val && i < 5) {
                        const next = document.getElementById(`otp-${i+1}`);
                        next?.focus();
                      }
                      setOtp((prev) => prev.slice(0, i) + (val.slice(-1) || "") + prev.slice(i + 1));
                    }}
                    id={`otp-${i}`}
                    maxLength={1}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-[#c0d0e2] rounded-lg focus:border-[#1a3a6b] focus:outline-none"
                    type="tel"
                  />
                ))}
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-[#1a3a6b] text-white font-bold py-3.5 rounded text-base mb-4"
              >
                Verify OTP →
              </button>
              <button onClick={() => setOtp("123456")} className="text-xs text-[#d4500a] hover:underline">
                Auto-fill demo OTP (123456)
              </button>
              <p className="text-xs text-[#4a6080] mt-4">
                Didn't receive? <span className="text-[#1a3a6b] font-semibold">Resend OTP</span> (00:42)
              </p>
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "consent") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen bg-white animate-slide">
            <MobileHeader title="Data Consent" onBack={() => setScreen("login")} />
            <div className="px-5 py-6">
              <div className="bg-[#e8eef8] border border-[#93c5fd] rounded-lg p-4 mb-5">
                <p className="text-xs font-bold text-[#1a3a6b] mb-1 flex items-center gap-1">
                  🔒 Digital Personal Data Protection Act, 2023
                </p>
                <p className="text-xs text-[#1a3a6b]/80 leading-relaxed">
                  DPDP Act 2023 — Explicit Consent Required
                </p>
              </div>
              <h3 className="font-bold text-base text-[#1a2332] mb-3">Data Usage Consent</h3>
              <div className="bg-[#f8fafc] border border-[#c0d0e2] rounded-lg p-4 mb-5 text-xs text-[#1a2332] leading-relaxed">
                <p className="mb-3">
                  "I consent to <strong>KishanSetu</strong> processing my <strong>Aadhaar</strong> and <strong>land record data</strong> solely for the purpose of agricultural procurement verification, as per the Digital Personal Data Protection Act, 2023."
                </p>
                <p className="mb-3 hindi text-[#4a6080]">
                  "मैं किसानसेतु को कृषि खरीद सत्यापन के उद्देश्य से मेरे आधार और भूमि रिकॉर्ड डेटा के प्रसंस्करण के लिए सहमति देता/देती हूं।"
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[#4a6080]">
                  <li>Data used only for procurement verification</li>
                  <li>Aadhaar number always masked (XXXX XXXX XXXX)</li>
                  <li>Right to download or request deletion of your data</li>
                  <li>Financial records retained per audit law even after deletion</li>
                </ul>
              </div>
              <label className="flex items-start gap-3 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-2 border-[#1a3a6b]"
                />
                <span className="text-sm font-medium text-[#1a2332]">
                  I Agree to the above terms and consent to data processing
                </span>
              </label>
              <button
                disabled={!consentChecked}
                onClick={() => setScreen("kyc")}
                className={`w-full font-bold py-3.5 rounded text-base mb-3 ${consentChecked ? "bg-[#1a3a6b] text-white" : "bg-[#c0d0e2] text-[#4a6080] cursor-not-allowed"}`}
              >
                Continue →
              </button>
              <button
                onClick={() => setScreen("login")}
                className="w-full border border-[#c0d0e2] text-[#4a6080] font-medium py-2.5 rounded text-sm"
              >
                Decline — Return to Login
              </button>
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "kyc") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen bg-white animate-slide">
            <MobileHeader title="KYC Verification" onBack={() => setScreen("consent")} />
            <div className="px-5 py-5">
              <div className="bg-[#e6f4ea] border border-[#a7d9b3] rounded-lg p-4 mb-5">
                <p className="text-sm font-bold text-[#1a6b2e]">✓ Verification In Progress</p>
                <p className="text-xs text-[#2d6a4f] mt-0.5">Connecting to government databases...</p>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  { label: "Aadhaar Verification", status: "verified", detail: farmer.aadhaarMasked },
                  { label: "Land Record Verification", status: "verified", detail: `${farmer.landAcres} acres — ${farmer.district}` },
                  { label: "Farmer Registration", status: "verified", detail: farmer.farmerId },
                  { label: "Bank Account (DBT)", status: "verified", detail: farmer.bankAccountMasked },
                ].map((item) => (
                  <div key={item.label} className="border border-[#c0d0e2] rounded-lg p-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#1a2332]">{item.label}</p>
                      <p className="text-xs mono text-[#4a6080] mt-0.5">{item.detail}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
              <div className="bg-[#1a3a6b] text-white rounded-xl p-5 text-center mb-5">
                <div className="text-3xl mb-2">✅</div>
                <p className="font-bold text-lg">🟢 KYC VERIFIED</p>
                <p className="text-[#93c5fd] text-sm mt-1">All verifications complete</p>
              </div>
              <button
                onClick={() => setScreen("kyc-success")}
                className="w-full bg-[#1a6b2e] text-white font-bold py-3.5 rounded text-base"
              >
                Proceed to Dashboard →
              </button>
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "kyc-success") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen bg-white animate-fade flex flex-col items-center justify-center px-8 py-12 text-center min-h-[600px]">
            <div className="w-20 h-20 rounded-full bg-[#e6f4ea] flex items-center justify-center text-4xl mb-5">✅</div>
            <h2 className="text-2xl font-bold text-[#1a6b2e] mb-2">KYC Verified!</h2>
            <p className="text-[#4a6080] mb-1">Welcome, <strong>{farmer.name}</strong></p>
            <p className="text-xs mono text-[#4a6080] mb-6">{farmer.farmerId}</p>
            <div className="bg-[#e6f4ea] border border-[#a7d9b3] rounded-xl p-4 w-full text-left mb-6">
              <p className="text-xs text-[#2d6a4f] font-semibold mb-2">Verified Details:</p>
              <div className="space-y-1 text-xs text-[#2d6a4f]">
                <p>Aadhaar: <span className="mono font-bold">{farmer.aadhaarMasked}</span></p>
                <p>Bank A/C: <span className="mono font-bold">{farmer.bankAccountMasked}</span></p>
                <p>Land: <span className="font-bold">{farmer.landAcres} acres, {farmer.district}</span></p>
              </div>
            </div>
            <button
              onClick={() => setScreen("dashboard")}
              className="w-full bg-[#1a3a6b] text-white font-bold py-3.5 rounded text-base"
            >
              Go to Dashboard →
            </button>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "dashboard") {
    const pendingB = state.bookings.filter(b => b.farmerId === "F001" && b.status === "pending");
    const acceptedB = state.bookings.filter(b => b.farmerId === "F001" && b.status === "accepted");
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen bg-[#f4f8fc] animate-fade">
            {/* Header */}
            <div className="bg-[#1a3a6b] text-white px-4 pt-4 pb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#2a5298] flex items-center justify-center text-lg font-bold">
                    {farmer.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{farmer.name}</p>
                    <p className="text-[#93c5fd] text-xs mono">{farmer.farmerId}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <button onClick={() => setScreen("notifications")} className="relative text-lg">
                    🔔
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#d4500a] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{unreadCount}</span>
                    )}
                  </button>
                  <button onClick={() => setScreen("voice-assistant")} className="text-lg">🎙️</button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={farmer.kycStatus} />
                <span className="text-xs text-[#93c5fd]">{farmer.district}, {farmer.state}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-4 -mt-3">
              <div className="bg-white rounded-xl shadow-sm p-4 mb-3">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: "📍", label: "Find Centre", screen: "find-centre" as Screen },
                    { icon: "💰", label: "Check Price", screen: "crop-prices" as Screen },
                    { icon: "📅", label: "Book Slot", screen: "book-slot" as Screen },
                    { icon: "🎫", label: "My Bookings", screen: "my-bookings" as Screen },
                    { icon: "📊", label: "Transactions", screen: "post-collection" as Screen },
                    { icon: "📋", label: "Grievance", screen: "grievance" as Screen },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={() => setScreen(btn.screen)}
                      className="flex flex-col items-center gap-1.5 p-3 bg-[#f4f8fc] rounded-xl hover:bg-[#e8eef8] transition-colors"
                    >
                      <span className="text-2xl">{btn.icon}</span>
                      <span className="text-[10px] font-semibold text-[#1a3a6b] text-center leading-tight">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upcoming slot alert */}
              {(pendingB.length > 0 || acceptedB.length > 0) && (
                <div className="bg-[#fef3c7] border border-[#fcd34d] rounded-xl p-3.5 mb-3">
                  <p className="text-xs font-bold text-[#92400e] mb-1">📅 Upcoming Booking</p>
                  {(acceptedB[0] ?? pendingB[0]) && (() => {
                    const b = acceptedB[0] ?? pendingB[0];
                    return (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[#1a2332] mono">{b.id}</p>
                          <p className="text-xs text-[#4a6080]">{b.crop} · {b.date} · {b.slot}</p>
                        </div>
                        <button
                          onClick={() => { setSelectedBooking(b.id); setScreen("await-decision"); }}
                          className="text-xs font-semibold text-[#1a3a6b] bg-white px-2 py-1 rounded border border-[#c0d0e2]"
                        >
                          View →
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Nearby centres */}
              <div className="bg-white rounded-xl p-4 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-sm text-[#1a2332]">📍 Nearby Centres</p>
                  <button onClick={() => setScreen("find-centre")} className="text-xs text-[#1a3a6b] font-semibold">See All →</button>
                </div>
                {state.centres.slice(0, 2).map((c) => {
                  const remaining = c.dailyCapacityQ - c.bookedQ;
                  const pct = (c.bookedQ / c.dailyCapacityQ) * 100;
                  return (
                    <div key={c.id} className="border border-[#e0e8f0] rounded-lg p-3 mb-2 last:mb-0">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-semibold text-[#1a2332] leading-tight pr-2">{c.name}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${remaining > 200 ? "bg-[#e6f4ea] text-[#1a6b2e]" : "bg-[#fef3c7] text-[#b45309]"}`}>
                          {remaining > 200 ? "Open" : "Limited"}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#4a6080] mt-1">{c.distanceKm} km · {c.crops.join(", ")}</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-[10px] text-[#4a6080] mb-1">
                          <span>Capacity: {remaining}Q remaining</span>
                          <span>{Math.round(pct)}% full</span>
                        </div>
                        <div className="h-1.5 bg-[#e0e8f0] rounded-full overflow-hidden">
                          <div className="h-full bg-[#1a3a6b] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MSP prices */}
              <div className="bg-white rounded-xl p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm text-[#1a2332]">💰 MSP Prices</p>
                  <span className="text-[10px] text-[#d4500a] font-semibold">⚠ DEMO PRICE</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {state.cropPrices.slice(0, 4).map((cp) => (
                    <div key={cp.crop} className="bg-[#f4f8fc] rounded-lg p-2.5">
                      <p className="text-[10px] text-[#4a6080] font-medium">{cp.crop}</p>
                      <p className="text-sm font-bold text-[#1a3a6b]">₹{cp.mspPerQ.toLocaleString("en-IN")}</p>
                      <p className="text-[9px] text-[#4a6080]">per Quintal</p>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={onBack} className="w-full border border-[#c0d0e2] text-[#4a6080] text-sm py-2.5 rounded-xl mb-4">
                ← Back to Home
              </button>
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "find-centre") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen animate-slide">
            <MobileHeader title="Find Centre / केंद्र खोजें" onBack={() => setScreen("dashboard")} />
            <div className="px-4 py-3 bg-white border-b border-[#e0e8f0]">
              <div className="bg-[#f4f8fc] border border-[#c0d0e2] rounded-lg px-3 py-2.5 flex items-center gap-2">
                <span className="text-[#4a6080]">🔍</span>
                <span className="text-sm text-[#4a6080]">Search by district or crop...</span>
              </div>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs font-semibold text-[#4a6080] mb-2">
                📍 {state.centres.length} centres near {farmer.district} — PostGIS geo-search
              </p>
              {state.centres.map((c) => {
                const remaining = c.dailyCapacityQ - c.bookedQ;
                return (
                  <div key={c.id} className="bg-white border border-[#c0d0e2] rounded-xl p-4 mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-bold text-[#1a2332] flex-1 pr-2">{c.name}</p>
                      <span className="mono text-[10px] bg-[#e8eef8] text-[#1a3a6b] px-2 py-0.5 rounded font-semibold">{c.id}</span>
                    </div>
                    <p className="text-xs text-[#4a6080] mb-2">{c.address}</p>
                    <div className="flex gap-3 text-xs mb-2">
                      <span className="text-[#1a3a6b] font-medium">📏 {c.distanceKm} km</span>
                      <span className="text-[#4a6080]">Crops: {c.crops.join(", ")}</span>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-[10px] text-[#4a6080] mb-1">
                        <span>Daily capacity: {c.dailyCapacityQ}Q</span>
                        <span className={remaining > 200 ? "text-[#1a6b2e] font-semibold" : "text-[#b45309] font-semibold"}>
                          {remaining}Q remaining
                        </span>
                      </div>
                      <div className="h-2 bg-[#e0e8f0] rounded-full overflow-hidden">
                        <div className="h-full bg-[#1a3a6b] rounded-full" style={{ width: `${(c.bookedQ / c.dailyCapacityQ) * 100}%` }} />
                      </div>
                    </div>
                    <button
                      onClick={() => setScreen("book-slot")}
                      className="w-full bg-[#d4500a] text-white font-semibold py-2 rounded text-xs mt-1"
                    >
                      📅 Book Slot at This Centre
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "crop-prices") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen animate-slide">
            <MobileHeader title="MSP Prices / MSP मूल्य" onBack={() => setScreen("dashboard")} />
            <div className="px-4 py-3">
              <div className="bg-[#fef3c7] border border-[#fcd34d] rounded-lg p-3 mb-4 text-xs">
                <p className="font-semibold text-[#92400e]">⚠ DEMO PRICE</p>
                <p className="text-[#92400e] mt-0.5">CACP/Agmarknet integration-ready. Static seed values shown. Refreshed: 08 Sep 2026.</p>
              </div>
              {state.cropPrices.map((cp) => (
                <div key={cp.crop} className="bg-white border border-[#c0d0e2] rounded-xl p-4 mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-base text-[#1a2332]">{cp.crop}</p>
                      <p className="text-xs text-[#4a6080] mt-0.5">Season: {cp.season}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#1a6b2e]">₹{cp.mspPerQ.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-[#4a6080]">per Quintal (MSP)</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#e0e8f0] text-xs text-[#4a6080] flex gap-4">
                    <span>₹{(cp.mspPerQ / 100).toFixed(0)}/kg</span>
                    <span>1Q = 100kg</span>
                  </div>
                </div>
              ))}
              <p className="text-xs text-center text-[#4a6080] mt-2">
                Prices set by CACP — Commission for Agricultural Costs and Prices
              </p>
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "book-slot") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen animate-slide">
            <MobileHeader title="Book a Slot / स्लॉट बुक करें" onBack={() => setScreen("dashboard")} />
            <div className="px-4 py-4">
              {/* Crop */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Crop / फसल</label>
                <select
                  value={bookForm.crop}
                  onChange={(e) => setBookForm((f) => ({ ...f, crop: e.target.value }))}
                  className="w-full border border-[#c0d0e2] rounded-lg px-3 py-3 text-sm bg-white focus:outline-none focus:border-[#1a3a6b]"
                >
                  {state.cropPrices.map((cp) => (
                    <option key={cp.crop}>{cp.crop}</option>
                  ))}
                </select>
              </div>
              {/* Quantity */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">
                  Quantity (Quintals) / मात्रा
                </label>
                <input
                  value={bookForm.quantity}
                  onChange={(e) => setBookForm((f) => ({ ...f, quantity: e.target.value }))}
                  type="number"
                  className="w-full border border-[#c0d0e2] rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-[#1a3a6b]"
                  placeholder="e.g. 50"
                />
                {bookForm.quantity && (
                  <p className="text-xs text-[#4a6080] mt-1">
                    Estimated value: ₹{((state.cropPrices.find(c => c.crop === bookForm.crop)?.mspPerQ ?? 0) * parseInt(bookForm.quantity)).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
              {/* Centre */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Procurement Centre</label>
                <select
                  value={bookForm.centreId}
                  onChange={(e) => setBookForm((f) => ({ ...f, centreId: e.target.value }))}
                  className="w-full border border-[#c0d0e2] rounded-lg px-3 py-3 text-sm bg-white focus:outline-none focus:border-[#1a3a6b]"
                >
                  {state.centres.map((c) => (
                    <option key={c.id} value={c.id}>{c.id} — {c.name}</option>
                  ))}
                </select>
              </div>
              {/* Date */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Date / तारीख</label>
                <select
                  value={bookForm.date}
                  onChange={(e) => setBookForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full border border-[#c0d0e2] rounded-lg px-3 py-3 text-sm bg-white focus:outline-none focus:border-[#1a3a6b]"
                >
                  {["12 September 2026", "13 September 2026", "14 September 2026", "15 September 2026", "16 September 2026"].map(d => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              {/* Slots */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-2 block">Available Slots</label>
                <div className="grid grid-cols-2 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      disabled={!s.available}
                      onClick={() => s.available && setBookForm((f) => ({ ...f, slot: s.time }))}
                      className={`p-3 rounded-lg border-2 text-xs font-semibold transition-colors ${
                        !s.available
                          ? "border-[#e0e8f0] bg-[#f4f8fc] text-[#c0d0e2] cursor-not-allowed"
                          : bookForm.slot === s.time
                          ? "border-[#1a3a6b] bg-[#1a3a6b] text-white"
                          : "border-[#c0d0e2] bg-white text-[#1a2332] hover:border-[#1a3a6b]"
                      }`}
                    >
                      <p>{s.time}</p>
                      <p className={`text-[10px] mt-0.5 ${!s.available ? "text-[#c0d0e2]" : bookForm.slot === s.time ? "text-white/80" : "text-[#4a6080]"}`}>
                        {s.available ? "🟢 Available" : "🔴 Full"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              {/* Summary */}
              <div className="bg-[#e8eef8] border border-[#93c5fd] rounded-xl p-4 mb-4 text-sm">
                <p className="font-semibold text-[#1a3a6b] mb-2">Booking Summary</p>
                <div className="space-y-1 text-xs text-[#4a6080]">
                  <div className="flex justify-between"><span>Crop:</span><span className="font-semibold text-[#1a2332]">{bookForm.crop}</span></div>
                  <div className="flex justify-between"><span>Quantity:</span><span className="font-semibold text-[#1a2332]">{bookForm.quantity} Quintal</span></div>
                  <div className="flex justify-between"><span>Date:</span><span className="font-semibold text-[#1a2332]">{bookForm.date}</span></div>
                  <div className="flex justify-between"><span>Slot:</span><span className="font-semibold text-[#1a2332]">{bookForm.slot}</span></div>
                </div>
              </div>
              <button
                onClick={handleBookSlot}
                className="w-full bg-[#d4500a] text-white font-bold py-3.5 rounded-xl text-base"
              >
                Submit Booking Request →
              </button>
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "booking-confirmation") {
    const booking = newBooking ?? pendingBooking;
    if (!booking) return null;
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen animate-fade">
            <div className="bg-[#1a6b2e] text-white px-5 py-6 text-center">
              <div className="text-4xl mb-2">🎫</div>
              <h3 className="font-bold text-lg">Booking Submitted!</h3>
              <p className="text-[#a7d9b3] text-sm mt-0.5">🟡 Request Submitted — Awaiting Centre Decision</p>
            </div>
            <div className="px-5 py-5">
              <div className="bg-[#e6f4ea] border border-[#a7d9b3] rounded-xl p-4 mb-4 text-center">
                <p className="text-xs text-[#2d6a4f] mb-1 font-semibold">Booking ID</p>
                <p className="text-xl font-bold mono text-[#1a3a6b]">{booking.id}</p>
              </div>
              <div className="bg-white border border-[#c0d0e2] rounded-xl p-4 mb-4 text-sm space-y-2">
                {[
                  { k: "Farmer", v: farmer.name },
                  { k: "Crop", v: booking.crop },
                  { k: "Quantity", v: `${booking.quantity} Quintal` },
                  { k: "Centre", v: booking.centreName },
                  { k: "Date", v: booking.date },
                  { k: "Slot", v: booking.slot },
                  { k: "Status", v: "🟡 REQUEST SUBMITTED" },
                ].map((r) => (
                  <div key={r.k} className="flex justify-between items-start border-b border-[#e0e8f0] pb-2 last:border-0 last:pb-0">
                    <span className="text-[#4a6080] text-xs">{r.k}:</span>
                    <span className="font-semibold text-[#1a2332] text-xs text-right">{r.v}</span>
                  </div>
                ))}
              </div>
              {/* QR Code */}
              <div className="bg-white border border-[#c0d0e2] rounded-xl p-4 mb-4 text-center">
                <p className="text-xs font-semibold text-[#4a6080] mb-3">Booking QR Code</p>
                <div className="flex justify-center mb-2">
                  <QRCode value={booking.id} />
                </div>
                <p className="text-[10px] text-[#4a6080]">Show this QR at the centre for verification</p>
              </div>
              <button
                onClick={() => { setSelectedBooking(booking.id); setScreen("await-decision"); }}
                className="w-full bg-[#1a3a6b] text-white font-bold py-3 rounded-xl text-sm mb-2"
              >
                Track Booking Status →
              </button>
              <button
                onClick={() => setScreen("dashboard")}
                className="w-full border border-[#c0d0e2] text-[#4a6080] py-2.5 rounded-xl text-sm"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "my-bookings") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen animate-slide">
            <MobileHeader title="My Bookings / मेरी बुकिंग" onBack={() => setScreen("dashboard")} />
            <div className="px-4 py-3">
              {myBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white border border-[#c0d0e2] rounded-xl p-4 mb-3 cursor-pointer hover:border-[#1a3a6b] transition-colors"
                  onClick={() => { setSelectedBooking(b.id); setScreen("await-decision"); }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="mono text-xs font-bold text-[#1a3a6b]">{b.id}</p>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-sm font-semibold text-[#1a2332]">{b.crop} — {b.quantity}Q</p>
                  <p className="text-xs text-[#4a6080] mt-1">{b.date} · {b.slot}</p>
                  <p className="text-xs text-[#4a6080] mt-0.5 truncate">{b.centreName}</p>
                </div>
              ))}
              {myBookings.length === 0 && (
                <div className="text-center py-12 text-[#4a6080]">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="font-semibold">No bookings yet</p>
                  <p className="text-sm mt-1">Book your first procurement slot</p>
                </div>
              )}
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "await-decision") {
    const b = (selectedBooking ? state.bookings.find(bk => bk.id === selectedBooking) : null) ?? pendingBooking;
    if (!b) return null;
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen animate-slide">
            <MobileHeader title="Booking Status / बुकिंग स्थिति" onBack={() => setScreen("my-bookings")} />
            <div className="px-4 py-4">
              <div className={`rounded-xl p-4 mb-4 text-center ${
                b.status === "accepted" ? "bg-[#e6f4ea] border-2 border-[#a7d9b3]" :
                b.status === "rejected" ? "bg-[#fee2e2] border-2 border-[#fca5a5]" :
                b.status === "rescheduled" ? "bg-[#ede9fe] border-2 border-[#c4b5fd]" :
                "bg-[#fef3c7] border-2 border-[#fcd34d]"
              }`}>
                <p className="text-2xl mb-1">
                  {b.status === "accepted" ? "🟢" : b.status === "rejected" ? "🔴" : b.status === "rescheduled" ? "🔵" : "🟡"}
                </p>
                <p className="font-bold text-base text-[#1a2332] uppercase">
                  {b.status === "pending" ? "Awaiting Centre Decision" :
                   b.status === "accepted" ? "REQUEST ACCEPTED" :
                   b.status === "rejected" ? "REQUEST REJECTED" :
                   b.status === "rescheduled" ? "SLOT RESCHEDULED" : b.status.toUpperCase()}
                </p>
                {b.status === "accepted" && (
                  <p className="text-sm text-[#1a6b2e] mt-1">Your procurement request has been accepted.</p>
                )}
              </div>
              <div className="mono text-center text-[#1a3a6b] font-bold text-lg mb-4">{b.id}</div>
              <div className="bg-white border border-[#c0d0e2] rounded-xl p-4 mb-4 text-sm space-y-2">
                {[
                  { k: "Crop", v: `${b.crop} — ${b.quantity}Q` },
                  { k: "Centre", v: b.centreName },
                  { k: "Date", v: b.date },
                  { k: "Slot", v: b.slot },
                  { k: "KYC Status", v: b.kycVerified ? "✓ Verified" : "⚠ Pending" },
                ].map((r) => (
                  <div key={r.k} className="flex justify-between border-b border-[#e0e8f0] pb-2 last:border-0 last:pb-0">
                    <span className="text-[#4a6080] text-xs">{r.k}:</span>
                    <span className="font-semibold text-xs text-right text-[#1a2332]">{r.v}</span>
                  </div>
                ))}
              </div>
              {b.status === "rejected" && b.rejectionReason && (
                <div className="bg-[#fee2e2] border border-[#fca5a5] rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-[#b91c1c] mb-1">Rejection Reason:</p>
                  <p className="text-sm text-[#7f1d1d]">{b.rejectionReason}</p>
                </div>
              )}
              {b.status === "rescheduled" && (
                <div className="bg-[#ede9fe] border border-[#c4b5fd] rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-[#6d28d9] mb-2">Rescheduled Details:</p>
                  <div className="text-sm space-y-1">
                    <p className="text-[#4a6080]">Original: <span className="font-semibold text-[#1a2332]">{b.date} · {b.slot}</span></p>
                    <p className="text-[#4a6080]">New Date: <span className="font-semibold text-[#1a2332]">{b.rescheduleDate}</span></p>
                    <p className="text-[#4a6080]">New Slot: <span className="font-semibold text-[#1a2332]">{b.rescheduleSlot}</span></p>
                    <p className="text-[#4a6080]">Reason: <span className="font-semibold text-[#1a2332]">{b.rescheduleReason}</span></p>
                  </div>
                </div>
              )}
              {b.status === "accepted" && (
                <button
                  onClick={() => setScreen("queue-tracking")}
                  className="w-full bg-[#1a6b2e] text-white font-bold py-3 rounded-xl text-sm mb-2"
                >
                  🔢 View Queue Position →
                </button>
              )}
              {b.status === "completed" && (
                <button
                  onClick={() => setScreen("post-collection")}
                  className="w-full bg-[#1a3a6b] text-white font-bold py-3 rounded-xl text-sm mb-2"
                >
                  🧾 View Bill & Payment →
                </button>
              )}
              <button
                onClick={() => setScreen("grievance")}
                className="w-full border border-[#c0d0e2] text-[#4a6080] py-2.5 rounded-xl text-xs mt-1"
              >
                📋 File a Grievance
              </button>
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "queue-tracking") {
    const b = (selectedBooking ? state.bookings.find(bk => bk.id === selectedBooking) : null) ?? pendingBooking;
    const qPos = b?.queuePosition ?? 17;
    const qCurrent = b?.queueCurrent ?? 12;
    const waitMins = b?.estimatedWaitMins ?? 45;
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen animate-slide">
            <MobileHeader title="Queue Position / कतार स्थिति" onBack={() => setScreen("await-decision")} />
            <div className="px-4 py-5">
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#1a3a6b] text-white rounded-xl p-5 text-center">
                  <p className="text-xs text-[#93c5fd] mb-1 uppercase tracking-wide">YOUR QUEUE</p>
                  <p className="text-5xl font-bold">#{qPos}</p>
                  <p className="text-xs text-[#93c5fd] mt-1">Your position</p>
                </div>
                <div className="bg-[#e6f4ea] border-2 border-[#a7d9b3] rounded-xl p-5 text-center">
                  <p className="text-xs text-[#2d6a4f] mb-1 uppercase tracking-wide">NOW SERVING</p>
                  <p className="text-5xl font-bold text-[#1a6b2e]">#{qCurrent}</p>
                  <p className="text-xs text-[#2d6a4f] mt-1">Currently at centre</p>
                </div>
              </div>
              <div className="bg-[#fef3c7] border-2 border-[#fcd34d] rounded-xl p-4 mb-5 text-center">
                <p className="text-xs text-[#92400e] mb-1 uppercase tracking-wide font-semibold">Estimated Wait</p>
                <p className="text-4xl font-bold text-[#b45309]">{waitMins} min</p>
                <p className="text-xs text-[#92400e] mt-1">{qPos - qCurrent} farmers ahead of you</p>
              </div>
              {/* Queue visualization */}
              <div className="bg-white border border-[#c0d0e2] rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-[#4a6080] mb-3 uppercase tracking-wide">Queue Progress</p>
                <div className="flex gap-1 flex-wrap">
                  {Array.from({ length: Math.min(qPos, 20) }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded text-[8px] flex items-center justify-center font-bold ${
                        i + 1 < qCurrent ? "bg-[#e0e8f0] text-[#4a6080]" :
                        i + 1 === qCurrent ? "bg-[#1a6b2e] text-white" :
                        i + 1 === qPos ? "bg-[#d4500a] text-white" :
                        "bg-[#e8eef8] text-[#1a3a6b]"
                      }`}
                    >
                      {i + 1 === qCurrent ? "▶" : i + 1 === qPos ? "★" : i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-3 text-[10px] text-[#4a6080]">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#1a6b2e] rounded inline-block" /> Now serving</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#d4500a] rounded inline-block" /> You</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#e8eef8] border border-[#93c5fd] rounded inline-block" /> Waiting</span>
                </div>
              </div>
              <div className="bg-white border border-[#c0d0e2] rounded-xl p-4 mb-4 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#4a6080]">Booking ID:</span>
                  <span className="mono font-bold text-[#1a3a6b]">{b?.id ?? "KS-2026-001284"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4a6080]">Centre:</span>
                  <span className="font-semibold text-right max-w-[180px]">{b?.centreName ?? "Burdwan Centre"}</span>
                </div>
              </div>
              <p className="text-xs text-center text-[#4a6080]">
                🔔 You will receive SMS notification when it's your turn
              </p>
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "post-collection") {
    const txn = state.transactions.find(t => t.farmerId === "F001") ?? completedTxn;
    if (!txn) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
          <div className="mobile-frame">
            <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
            <div className="mobile-screen animate-slide flex flex-col items-center justify-center px-8 py-12 text-center min-h-[600px] bg-white">
              <div className="text-4xl mb-4">⏳</div>
              <p className="font-bold text-[#1a2332]">No completed transactions yet</p>
              <p className="text-sm text-[#4a6080] mt-2">Complete your booking and visit the centre</p>
              <button onClick={() => setScreen("dashboard")} className="mt-6 btn-gov-secondary">Back to Dashboard</button>
            </div>
            <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen animate-fade">
            <MobileHeader title="Post-Collection / संग्रह के बाद" onBack={() => setScreen("dashboard")} />
            <div className="px-4 py-4">
              {/* Weighment */}
              <div className="bg-white border border-[#c0d0e2] rounded-xl p-4 mb-3">
                <p className="font-semibold text-sm text-[#1a2332] mb-3 flex items-center gap-2">
                  ⚖️ Weighment Details
                  <span className="text-[10px] badge-completed px-2 py-0.5 rounded-full font-semibold">Verified</span>
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#4a6080] text-xs">Crop:</span>
                    <span className="font-semibold">{txn.crop}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a6080] text-xs">Scheduled Qty:</span>
                    <span className="font-semibold">{txn.scheduledQty} Q</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a6080] text-xs">Actual Qty:</span>
                    <span className="font-bold text-[#1a3a6b]">{txn.actualQty} Q</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a6080] text-xs">Quality Grade:</span>
                    <span className="font-bold text-[#1a6b2e]">Grade {txn.qualityGrade}</span>
                  </div>
                </div>
              </div>
              {/* Bill */}
              <div className="bg-white border border-[#c0d0e2] rounded-xl p-4 mb-3">
                <p className="font-semibold text-sm text-[#1a2332] mb-3 flex items-center gap-2">
                  🧾 Digital Bill
                  <span className="text-[10px] badge-verified px-2 py-0.5 rounded-full font-semibold">Generated</span>
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#4a6080]">
                    <span>Transaction ID:</span>
                    <span className="mono font-bold text-[#1a3a6b]">{txn.id}</span>
                  </div>
                  <div className="flex justify-between text-[#4a6080]">
                    <span>Centre:</span>
                    <span className="text-right font-semibold text-[#1a2332] max-w-[160px]">{txn.centreName}</span>
                  </div>
                  <div className="border-t border-[#e0e8f0] pt-2 mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#4a6080]">Price (MSP):</span>
                      <span className="font-semibold">₹{txn.pricePerQ.toLocaleString("en-IN")}/Q</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4a6080]">{txn.actualQty}Q × ₹{txn.pricePerQ.toLocaleString("en-IN")}:</span>
                      <span className="font-semibold">{formatINR(txn.grossAmount)}</span>
                    </div>
                    <div className="flex justify-between text-[#b91c1c]">
                      <span>Quality Deduction:</span>
                      <span className="font-semibold">− {formatINR(txn.qualityDeduction)}</span>
                    </div>
                    {txn.otherDeduction > 0 && (
                      <div className="flex justify-between text-[#b91c1c]">
                        <span>Other Deductions:</span>
                        <span className="font-semibold">− {formatINR(txn.otherDeduction)}</span>
                      </div>
                    )}
                    <div className="border-t border-[#e0e8f0] pt-2 flex justify-between text-base font-bold">
                      <span className="text-[#1a2332]">NET PAYABLE:</span>
                      <span className="text-[#1a6b2e]">{formatINR(txn.netAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Payment */}
              <div className={`rounded-xl p-4 mb-4 border-2 ${txn.paymentStatus === "credited" ? "bg-[#e6f4ea] border-[#a7d9b3]" : "bg-[#fef3c7] border-[#fcd34d]"}`}>
                <p className="font-semibold text-sm text-[#1a2332] mb-3 flex items-center gap-2">
                  💳 DBT Payment Status
                </p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#4a6080]">Bank Account:</span>
                    <span className="mono font-bold">{farmer.bankAccountMasked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a6080]">IFSC:</span>
                    <span className="mono font-bold">{farmer.ifscMasked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a6080]">UTR Number:</span>
                    <span className="mono font-bold text-[10px]">{txn.utrNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a6080]">PFMS Reference:</span>
                    <span className="mono text-[10px] font-bold">{txn.pfmsRef}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#e0e8f0] pt-2 mt-2">
                    <span className="font-semibold text-[#1a2332]">Payment Status:</span>
                    <StatusBadge status={txn.paymentStatus} />
                  </div>
                </div>
                <p className="text-[10px] text-[#4a6080] mt-2 italic">
                  PFMS/DBT integration-ready — demo mode simulates settlement response.
                </p>
              </div>
              <button onClick={() => setScreen("dashboard")} className="w-full btn-gov-secondary text-sm py-2.5 rounded-xl">
                ← Back to Dashboard
              </button>
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "notifications") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen animate-slide">
            <MobileHeader title="Notifications / सूचनाएं" onBack={() => setScreen("dashboard")} />
            <div className="px-4 py-3">
              {myNotifications.map((n) => (
                <div key={n.id} className={`rounded-xl p-4 mb-3 border ${n.read ? "bg-white border-[#e0e8f0]" : "bg-[#e8eef8] border-[#93c5fd]"}`}>
                  <div className="flex items-start justify-between mb-1">
                    <span className={`text-[10px] font-semibold uppercase tracking-wide ${n.read ? "text-[#4a6080]" : "text-[#1a3a6b]"}`}>
                      {n.type === "booking" ? "📋 Booking" : n.type === "acceptance" ? "✅ Accepted" : n.type === "payment" ? "💳 Payment" : "🔔 Update"}
                    </span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-[#d4500a]" />}
                  </div>
                  <p className="text-sm text-[#1a2332] mb-1">{n.message}</p>
                  <p className="text-xs text-[#4a6080] hindi">{n.hindi}</p>
                  <p className="text-[10px] text-[#4a6080] mt-1">
                    {new Date(n.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "grievance") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen animate-slide">
            <MobileHeader title="File Grievance / शिकायत दर्ज करें" onBack={() => setScreen("dashboard")} />
            <div className="px-4 py-4">
              {grievanceSubmitted ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">✅</div>
                  <p className="font-bold text-lg text-[#1a6b2e]">Grievance Filed!</p>
                  <p className="text-sm text-[#4a6080] mt-2 mb-4">
                    Your grievance has been registered. You will receive updates via SMS.
                  </p>
                  <div className="bg-[#e6f4ea] border border-[#a7d9b3] rounded-xl p-4 mb-4">
                    <p className="text-xs text-[#2d6a4f]">Grievance ID:</p>
                    <p className="mono font-bold text-[#1a3a6b] text-lg">{grievanceId}</p>
                    <div className="mt-2 flex items-center justify-center gap-2 text-xs text-[#2d6a4f]">
                      <span>Status:</span>
                      <StatusBadge status="registered" />
                    </div>
                  </div>
                  <button onClick={() => { setGrievanceSubmitted(false); setScreen("dashboard"); }} className="btn-gov-secondary text-sm">
                    Back to Dashboard
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-[#e8eef8] border border-[#93c5fd] rounded-lg p-3 mb-4 text-xs text-[#1a3a6b]">
                    <p className="font-semibold">CPGRAMS-style Grievance System</p>
                    <p className="text-[#4a6080] mt-0.5">Your grievance will be tracked with a GRV-YYYY-XXXXX ID</p>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Category</label>
                    <select
                      value={grievanceForm.category}
                      onChange={(e) => setGrievanceForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full border border-[#c0d0e2] rounded-lg px-3 py-3 text-sm bg-white focus:outline-none focus:border-[#1a3a6b]"
                    >
                      {["Booking", "Payment", "Quality Dispute", "Agent Behaviour", "Other"].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Description</label>
                    <textarea
                      value={grievanceForm.description}
                      onChange={(e) => setGrievanceForm((f) => ({ ...f, description: e.target.value }))}
                      rows={4}
                      className="w-full border border-[#c0d0e2] rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-[#1a3a6b] resize-none"
                      placeholder="Describe your issue..."
                    />
                  </div>
                  <div className="mb-5">
                    <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Booking ID (Optional)</label>
                    <input
                      value={grievanceBookingId}
                      onChange={(e) => setGrievanceBookingId(e.target.value)}
                      className="w-full border border-[#c0d0e2] rounded-lg px-3 py-3 text-sm mono focus:outline-none focus:border-[#1a3a6b]"
                      placeholder="KS-YYYY-XXXXXX"
                    />
                  </div>
                  <button
                    onClick={() => {
                      dispatch({
                        type: "CREATE_GRIEVANCE",
                        grievance: {
                          id: grievanceId,
                          farmerId: "F001",
                          farmerName: farmer.name,
                          bookingId: grievanceBookingId || undefined,
                          category: grievanceForm.category,
                          description: grievanceForm.description,
                          status: "registered",
                          createdAt: new Date().toISOString(),
                        },
                      });
                      setGrievanceSubmitted(true);
                    }}
                    disabled={!grievanceForm.description}
                    className={`w-full font-bold py-3.5 rounded-xl text-base ${grievanceForm.description ? "bg-[#d4500a] text-white" : "bg-[#c0d0e2] text-[#4a6080] cursor-not-allowed"}`}
                  >
                    Submit Grievance →
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  if (screen === "voice-assistant") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2f7] py-8">
        <div className="mobile-frame">
          <div className="mobile-notch"><div className="mobile-notch-pill" /></div>
          <div className="mobile-screen animate-fade bg-gradient-to-b from-[#0e2247] to-[#1a3a6b] text-white">
            <div className="px-5 pt-6 pb-4 flex items-center gap-3">
              <button onClick={() => setScreen("dashboard")} className="text-white/80">←</button>
              <p className="font-semibold">Voice Assistant / आवाज सहायक</p>
            </div>
            <div className="px-5 py-4">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-4">
                <p className="text-xs text-[#93c5fd] mb-1 font-semibold">Bhashini API — Multilingual Voice</p>
                <p className="text-xs text-[#93c5fd]">Supports Hindi, Bengali, Tamil, Telugu and 10+ Indian languages</p>
              </div>
              <div className="text-center py-8">
                <button
                  onClick={simulateVoice}
                  className={`w-28 h-28 rounded-full flex flex-col items-center justify-center mx-auto mb-4 transition-all ${voiceActive ? "bg-[#d4500a] animate-pulse" : "bg-white/20 border-4 border-white/40 hover:bg-white/30"}`}
                >
                  <span className="text-4xl mb-1">🎙️</span>
                  <span className="text-xs font-semibold">
                    {voiceActive ? "Listening..." : "बोलकर पूछें"}
                  </span>
                </button>
                {voiceText && (
                  <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-left animate-fade">
                    <p className="text-xs text-[#93c5fd] mb-1">Response:</p>
                    <p className="text-sm hindi font-medium">{voiceText}</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {[
                  { q: "मेरा स्लॉट कब है?", a: "आपका स्लॉट 12 सितंबर को सुबह 10:00 बजे है।" },
                  { q: "मेरी पेमेंट कब आएगी?", a: "आपकी पेमेंट अभी प्रोसेसिंग में है।" },
                  { q: "केंद्र कहाँ है?", a: "Burdwan Wheat Centre, 4.2 km दूर है।" },
                ].map((ex) => (
                  <div key={ex.q} className="bg-white/10 border border-white/15 rounded-xl p-3">
                    <p className="text-xs text-[#93c5fd] mb-0.5 hindi">"{ex.q}"</p>
                    <p className="text-xs text-white/80 hindi">→ {ex.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mobile-home-indicator"><div className="mobile-home-pill" /></div>
        </div>
      </div>
    );
  }

  return null;
}
