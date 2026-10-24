import { useState } from "react";
import { useAuth, FarmerUser } from "../auth";
import { useStore, formatINR } from "../store";
import { t, CROPS } from "../i18n";

type Screen = "home" | "ai_booking" | "nearby" | "bookings" | "sales" | "ai_analysis" | "bills" | "notifications" | "complaint" | "voice" | "profile";

const CENTRES = [
  { id: "CTR-024", name: "State Agri Warehouse Complex", dist: "1.2 km", slots: 6, crop: "Wheat, Paddy", open: "06:00 – 18:00", type: "govt" },
  { id: "CTR-031", name: "Farmers Co-op Centre North", dist: "3.8 km", slots: 2, crop: "Maize, Gram", open: "07:00 – 17:00", type: "private" },
  { id: "CTR-055", name: "Krishak Mandi Hub", dist: "5.2 km", slots: 8, crop: "Rice, Bajra", open: "05:30 – 20:00", type: "govt" },
];

const SLOT_TIMES = ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];
const SLOT_AVAIL = [3,2,0,1,3,4,2,0,1,3,2,1];

const SALES = [
  { id: "TXN-2026-14821", date: "2026-08-10", crop: "Wheat", qty: 48, rate: 2585, net: 118780, centre: "CTR-024", status: "credited" },
  { id: "TXN-2026-09234", date: "2026-06-22", crop: "Paddy", qty: 62, rate: 2183, net: 124226, centre: "CTR-031", status: "credited" },
  { id: "TXN-2025-88012", date: "2025-11-05", crop: "Gram", qty: 28, rate: 5440, net: 135520, centre: "CTR-024", status: "credited" },
];

interface FarmerDashboardProps { onDemoMode?: () => void; }
export default function FarmerDashboard({ onDemoMode }: FarmerDashboardProps) {
  const { user, lang, logout } = useAuth();
  const farmer = user as FarmerUser;
  const { state: storeState, dispatch } = useStore();
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedCentre, setSelectedCentre] = useState(CENTRES[0]);
  const [crop, setCrop] = useState("Wheat");
  const [qty, setQty] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [harvestTime, setHarvestTime] = useState("09:00");
  const [aiRecommended, setAiRecommended] = useState(false);
  const [aiSlot, setAiSlot] = useState("");
  const [aiCentre, setAiCentre] = useState(CENTRES[0]);
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingId] = useState(() => "KS-2026-" + Math.floor(Math.random() * 900000 + 100000));
  const [complaintText, setComplaintText] = useState("");
  const [complaintCentre, setComplaintCentre] = useState(CENTRES[0].id);
  const [complaintFiled, setComplaintFiled] = useState(false);
  const [grvId] = useState(() => "GRV-2026-" + Math.floor(Math.random() * 90000 + 10000));
  const [voiceActive, setVoiceActive] = useState(false);

  const myBookings = storeState.bookings.filter(b => b.farmerId === "F001" || b.farmerId === "F002");
  const myTransactions = storeState.transactions.slice(0, 3);

  function handleAiBooking() {
    if (!harvestDate || !crop || !qty) return;
    const bestSlot = SLOT_TIMES.find((_, i) => SLOT_AVAIL[i] > 0) || "09:00";
    setAiSlot(bestSlot);
    setAiCentre(CENTRES[0]);
    setAiRecommended(true);
  }

  function confirmAiBooking() {
    setBookingDone(true);
    dispatch({
      type: "CREATE_BOOKING",
      booking: {
        id: bookingId,
        farmerId: farmer.id,
        farmerName: farmer.name,
        centreId: aiCentre.id,
        centreName: aiCentre.name,
        crop,
        quantity: parseFloat(qty) || 10,
        date: harvestDate,
        slot: aiSlot,
        status: "pending",
        kycVerified: farmer.kycStatus === "verified",
        createdAt: new Date().toISOString(),
      }
    });
  }

  const NavItem = ({ id, icon, label }: { id: Screen; icon: string; label: string }) => (
    <button
      onClick={() => setScreen(id)}
      className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all ${screen === id ? "text-[#d4500a]" : "text-gray-400 hover:text-[#1a3a6b]"}`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="mobile-frame">
      <div className="mobile-screen flex flex-col bg-[#f5f7fa]">
        {/* Header */}
        <div className="bg-[#1a3a6b] px-4 pt-8 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-xs">{t("welcomeBack", lang)}</div>
              <div className="text-white font-bold text-base">{farmer.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${farmer.kycStatus === "verified" ? "bg-green-500 text-white" : "bg-yellow-400 text-[#1a3a6b]"}`}>
                  {farmer.kycStatus === "verified" ? "✓ KYC" : "⏳ KYC Pending"}
                </span>
                {farmer.dbtLinked && <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded font-semibold">DBT ✓</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setScreen("notifications")} className="text-white relative">
                <span className="text-2xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d4500a] rounded-full text-[9px] text-white flex items-center justify-center font-bold">3</span>
              </button>
              {onDemoMode && (
                <button onClick={onDemoMode} className="bg-white/20 text-white text-xs px-2 py-1 rounded-lg font-semibold hover:bg-white/30">SIH Demo</button>
              )}
              <button onClick={logout} className="bg-white/20 text-white text-xs px-2 py-1 rounded-lg font-semibold hover:bg-white/30">
                {t("logout", lang)}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {screen === "home" && (
            <div className="p-4 space-y-4">
              <div className="bg-gradient-to-r from-[#1a3a6b] to-[#2a5298] rounded-2xl p-4 text-white">
                <div className="text-xs opacity-70 mb-1">Quick Actions</div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button onClick={() => setScreen("ai_booking")} className="bg-white/20 hover:bg-white/30 rounded-xl p-3 text-left transition-all">
                    <div className="text-2xl mb-1">🤖</div>
                    <div className="text-xs font-bold">AI Auto-Book</div>
                    <div className="text-xs opacity-70">Smart slot finder</div>
                  </button>
                  <button onClick={() => setScreen("nearby")} className="bg-white/20 hover:bg-white/30 rounded-xl p-3 text-left transition-all">
                    <div className="text-2xl mb-1">🗺</div>
                    <div className="text-xs font-bold">Nearby Centres</div>
                    <div className="text-xs opacity-70">3 centres near you</div>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="text-xs font-bold text-[#1a3a6b] mb-3">Current MSP Rates</div>
                <div className="space-y-2">
                  {storeState.cropPrices.slice(0, 4).map((cp, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-700">{cp.crop}</span>
                      <span className="font-bold text-[#1a3a6b] text-sm">{formatINR(cp.mspPerQ)}<span className="text-xs text-gray-400 font-normal">/Q</span></span>
                    </div>
                  ))}
                </div>
              </div>

              {myBookings.length > 0 && (
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-bold text-[#1a3a6b]">Recent Bookings</div>
                    <button onClick={() => setScreen("bookings")} className="text-xs text-[#d4500a] font-semibold">See all</button>
                  </div>
                  {myBookings.slice(0, 2).map(b => (
                    <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <div className="text-xs font-semibold text-gray-700">{b.crop} · {b.quantity}Q</div>
                        <div className="text-xs text-gray-400">{b.date} {b.slot}</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        b.status === "accepted" ? "bg-green-100 text-green-700" :
                        b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        b.status === "completed" ? "bg-blue-100 text-blue-700" :
                        "bg-red-100 text-red-700"
                      }`}>{b.status}</span>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => setScreen("ai_analysis")} className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl p-4 text-left">
                <div className="text-2xl mb-1">📊</div>
                <div className="font-bold text-sm">AI Profit & Loss Analysis</div>
                <div className="text-xs opacity-80 mt-0.5">Compare this year vs last year performance →</div>
              </button>
            </div>
          )}

          {screen === "ai_booking" && (
            <div className="p-4 space-y-4">
              <div className="text-sm font-bold text-[#1a3a6b]">🤖 {t("aiBooking", lang)}</div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">{t("aiBookingDesc", lang)}</div>

              {!bookingDone ? (
                !aiRecommended ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">{t("cropType", lang)}</label>
                      <select value={crop} onChange={e => setCrop(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white">
                        {CROPS.slice(0, 12).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">{t("quantity", lang)}</label>
                      <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="e.g. 50" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">{t("harvestDate", lang)}</label>
                      <input type="date" value={harvestDate} onChange={e => setHarvestDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">{t("harvestTime", lang)}</label>
                      <select value={harvestTime} onChange={e => setHarvestTime(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white">
                        {SLOT_TIMES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <button onClick={handleAiBooking} disabled={!harvestDate || !qty} className="w-full py-3 bg-[#1a3a6b] text-white rounded-xl font-semibold disabled:opacity-40">
                      🤖 {t("findSlots", lang)}
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-300 rounded-2xl p-4">
                      <div className="text-xs font-bold text-green-700 mb-2">🤖 AI Recommendation Ready</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Centre:</span><span className="font-bold text-[#1a3a6b]">{aiCentre.name}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Distance:</span><span className="font-semibold">{aiCentre.dist}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Slot:</span><span className="font-bold text-[#d4500a]">{harvestDate} · {aiSlot}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Crop:</span><span className="font-semibold">{crop} · {qty}Q</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Est. MSP:</span><span className="font-bold text-green-700">{formatINR((storeState.cropPrices.find(cp => cp.crop.toLowerCase().includes(crop.toLowerCase()))?.mspPerQ || 2585) * parseFloat(qty || "0"))}</span></div>
                      </div>
                    </div>
                    <button onClick={confirmAiBooking} className="w-full py-3 bg-[#d4500a] text-white rounded-xl font-bold">
                      ✓ {t("confirmBooking", lang)}
                    </button>
                    <button onClick={() => setAiRecommended(false)} className="w-full py-2 text-sm text-gray-500 underline">Change preferences</button>
                  </div>
                )
              ) : (
                <div className="bg-green-50 border border-green-300 rounded-2xl p-4 text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <div className="font-bold text-green-700">Booking Confirmed!</div>
                  <div className="text-xs text-gray-600 mt-1">Booking ID: <span className="font-mono font-bold">{bookingId}</span></div>
                  <div className="text-xs text-gray-500 mt-1">SMS sent to +91 {farmer.phone}</div>
                  <button onClick={() => setScreen("bookings")} className="mt-4 px-4 py-2 bg-[#1a3a6b] text-white rounded-lg text-xs font-semibold">View My Bookings</button>
                </div>
              )}
            </div>
          )}

          {screen === "nearby" && (
            <div className="p-4 space-y-3">
              <div className="text-sm font-bold text-[#1a3a6b]">🗺 {t("nearbyCentres", lang)}</div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl h-32 flex items-center justify-center text-center">
                <div>
                  <div className="text-2xl">🗺</div>
                  <div className="text-xs text-gray-500 mt-1">Map · 3 centres within 6 km</div>
                  <div className="text-xs text-[#d4500a] mt-0.5">PostGIS-powered · Real-time slots</div>
                </div>
              </div>
              {CENTRES.map(c => (
                <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-1.5 py-0.5 rounded font-semibold bg-blue-100 text-blue-800">{c.type === "govt" ? "🏛 Govt" : "🏬 Private"}</span>
                        <span className="text-xs text-gray-400">{c.dist}</span>
                      </div>
                      <div className="font-semibold text-[#1a3a6b] text-sm mt-1">{c.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{c.crop}</div>
                      <div className="text-xs text-gray-400">{c.open}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-lg font-bold ${c.slots > 3 ? "text-green-600" : c.slots > 0 ? "text-yellow-600" : "text-red-500"}`}>{c.slots}</div>
                      <div className="text-xs text-gray-400">{t("slotsAvailable", lang)}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => { setSelectedCentre(c); setScreen("ai_booking"); }} className="flex-1 py-2 bg-[#1a3a6b] text-white rounded-lg text-xs font-semibold">{t("bookNow", lang)}</button>
                    <button className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600">📞 Contact</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {screen === "bookings" && (
            <div className="p-4 space-y-3">
              <div className="text-sm font-bold text-[#1a3a6b]">📋 {t("myBookings", lang)}</div>
              {storeState.bookings.slice(0, 4).map(b => (
                <div key={b.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-gray-400 font-mono">{b.id}</div>
                      <div className="font-semibold text-[#1a3a6b] text-sm mt-0.5">{b.crop}</div>
                      <div className="text-xs text-gray-500">{b.centreName}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{b.date} · {b.slot} · {b.quantity}Q</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${
                      b.status === "accepted" ? "bg-green-100 text-green-700" :
                      b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      b.status === "completed" ? "bg-blue-100 text-blue-700" :
                      "bg-red-100 text-red-700"
                    }`}>{b.status}</span>
                  </div>
                  {b.status === "rejected" && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg p-2">Centre rejected this booking. Please rebook at another slot or centre.</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {screen === "sales" && (
            <div className="p-4 space-y-3">
              <div className="text-sm font-bold text-[#1a3a6b]">📈 {t("salesHistory", lang)}</div>
              {SALES.map(s => (
                <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-gray-400 font-mono">{s.id}</div>
                      <div className="font-semibold text-[#1a3a6b] text-sm mt-0.5">{s.crop} · {s.qty}Q</div>
                      <div className="text-xs text-gray-500">{s.centre} · {s.date}</div>
                      <div className="text-xs text-gray-400">Rate: {formatINR(s.rate)}/Q</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-700 text-sm">{formatINR(s.net)}</div>
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-semibold">✓ Credited</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {screen === "ai_analysis" && (
            <div className="p-4 space-y-4">
              <div className="text-sm font-bold text-[#1a3a6b]">📊 {t("aiAnalysis", lang)}</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500">{t("profitThisYear", lang)}</div>
                  <div className="text-lg font-bold text-green-700 mt-1">₹2,43,006</div>
                  <div className="text-xs text-green-600 mt-0.5">▲ 18.4%</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500">{t("profitLastYear", lang)}</div>
                  <div className="text-lg font-bold text-blue-700 mt-1">₹2,05,120</div>
                  <div className="text-xs text-gray-400 mt-0.5">FY 2024–25</div>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
                <div className="text-xs font-bold text-purple-800 mb-2">🤖 {t("aiInsight", lang)}</div>
                <div className="text-xs text-gray-700 space-y-1.5">
                  <p>• Your Wheat yield improved 12% due to early slot booking — MSP rates were ₹2,585/Q this season, up from ₹2,275/Q last year.</p>
                  <p>• Gram fetched highest margin at ₹5,440/Q (38% above your cost estimate of ₹3,940/Q).</p>
                  <p>• Recommend: Book slots 3 weeks before harvest for Rabi season to avoid peak queue congestion at CTR-024.</p>
                  <p>• Consider diversifying to Mustard — MSP up 8% this year, high demand at nearby centres.</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="text-xs font-bold text-[#1a3a6b] mb-3">Crop-wise Performance</div>
                {[
                  { crop: "Wheat", pct: 78, color: "bg-yellow-400" },
                  { crop: "Paddy", pct: 65, color: "bg-green-400" },
                  { crop: "Gram", pct: 90, color: "bg-orange-400" },
                ].map(c => (
                  <div key={c.crop} className="mb-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{c.crop}</span><span>{c.pct}% of target</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {screen === "bills" && (
            <div className="p-4 space-y-3">
              <div className="text-sm font-bold text-[#1a3a6b]">🧾 {t("bills", lang)}</div>
              {storeState.transactions.map(txn => (
                <div key={txn.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-mono text-xs text-gray-400">{txn.id}</div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">PFMS Credited</span>
                  </div>
                  <div className="text-sm font-semibold text-[#1a3a6b]">{txn.crop}</div>
                  <div className="mt-2 space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between"><span>Gross ({txn.actualQty}Q × {formatINR(txn.pricePerQ)})</span><span>{formatINR(txn.grossAmount)}</span></div>
                    <div className="flex justify-between text-red-600"><span>Deductions</span><span>-{formatINR(txn.qualityDeduction + txn.otherDeduction)}</span></div>
                    <div className="flex justify-between font-bold text-[#1a3a6b] text-sm border-t border-gray-100 pt-1 mt-1"><span>Net Paid</span><span>{formatINR(txn.netAmount)}</span></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">UTR: <span className="font-mono">{txn.utrNumber}</span></div>
                </div>
              ))}
            </div>
          )}

          {screen === "notifications" && (
            <div className="p-4 space-y-3">
              <div className="text-sm font-bold text-[#1a3a6b]">🔔 {t("notifications", lang)}</div>
              {[
                { title: "Booking Accepted", body: "Your Wheat booking at CTR-024 for 2026-09-12 has been accepted.", time: "2 hrs ago", type: "success" },
                { title: "Payment Credited", body: "₹1,18,780 credited to your account via PFMS (UTR: PFMS2026082201843).", time: "3 days ago", type: "info" },
                { title: "MSP Rate Update", body: "Wheat MSP revised to ₹2,585/Q for Rabi 2026-27. Book early!", time: "1 week ago", type: "warn" },
              ].map((n, i) => (
                <div key={i} className={`bg-white rounded-2xl p-4 border ${n.type === "success" ? "border-green-200" : n.type === "info" ? "border-blue-200" : "border-yellow-200"}`}>
                  <div className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">{n.type === "success" ? "✅" : n.type === "info" ? "💰" : "📢"}</span>
                    <div>
                      <div className="font-semibold text-sm text-[#1a3a6b]">{n.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{n.body}</div>
                      <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {screen === "complaint" && (
            <div className="p-4 space-y-4">
              <div className="text-sm font-bold text-[#1a3a6b]">📣 {t("raiseComplaint", lang)}</div>
              {!complaintFiled ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">Against Centre</label>
                    <select value={complaintCentre} onChange={e => setComplaintCentre(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white">
                      {CENTRES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">Complaint Details</label>
                    <textarea
                      value={complaintText} onChange={e => setComplaintText(e.target.value)}
                      rows={4} placeholder="Describe your issue in detail..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none"
                    />
                  </div>
                  <button onClick={() => { if (complaintText.length > 10) setComplaintFiled(true); }} disabled={complaintText.length < 10} className="w-full py-3 bg-[#d4500a] text-white rounded-xl font-semibold disabled:opacity-40">
                    Submit Complaint
                  </button>
                </>
              ) : (
                <div className="bg-green-50 border border-green-300 rounded-2xl p-5 text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <div className="font-bold text-green-700">{t("complaintFiled", lang)}</div>
                  <div className="text-xs text-gray-500 mt-2">{t("grievanceId", lang)}: <span className="font-mono font-bold text-[#1a3a6b]">{grvId}</span></div>
                  <div className="text-xs text-gray-400 mt-1">Resolution within 7 working days via CPGRAMS</div>
                </div>
              )}
            </div>
          )}

          {screen === "voice" && (
            <div className="p-4 space-y-4">
              <div className="text-sm font-bold text-[#1a3a6b]">🎤 {t("voiceAssistant", lang)}</div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="text-4xl mb-3">{voiceActive ? "🔴" : "🎙"}</div>
                <div className="font-semibold text-[#1a3a6b]">{voiceActive ? "Listening..." : "Tap to speak"}</div>
                <div className="text-xs text-gray-400 mt-1">Bhashini Voice API — All 11 Indian languages</div>
                <button
                  onClick={() => setVoiceActive(!voiceActive)}
                  className={`mt-4 w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl shadow-lg ${voiceActive ? "bg-red-500" : "bg-[#1a3a6b]"} transition-all`}
                >
                  {voiceActive ? "⏹" : "🎤"}
                </button>
                {voiceActive && <div className="mt-3 text-xs text-gray-500 animate-pulse">Processing with Bhashini AI...</div>}
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="text-xs font-bold text-[#1a3a6b] mb-2">Try saying:</div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>• "Book a slot for Wheat on Friday"</div>
                  <div>• "What is today's MSP rate for Paddy?"</div>
                  <div>• "Show me nearby procurement centres"</div>
                  <div>• "गेहूं के लिए स्लॉट बुक करो" (Hindi)</div>
                  <div>• "ஒரு ஸ்லாட் பதிவு செய்யுங்கள்" (Tamil)</div>
                </div>
              </div>
            </div>
          )}

          {screen === "profile" && (
            <div className="p-4 space-y-4">
              <div className="text-sm font-bold text-[#1a3a6b]">👤 {t("profile", lang)}</div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-2.5">
                {[
                  ["Name", farmer.name],
                  ["Phone", "+91 " + farmer.phone],
                  ["Aadhaar", farmer.aadhaarMasked],
                  ["State", farmer.state + ", " + farmer.district],
                  ["Block / Village", farmer.block + " / " + farmer.village],
                  ["Land", farmer.landAcres + " Acres"],
                  ["Bank", farmer.bankMasked + " · " + farmer.ifscMasked],
                  ["DBT Status", farmer.dbtLinked ? "✓ Linked" : "Not Linked"],
                  ["KYC", farmer.kycStatus === "verified" ? "✓ Verified" : "Pending"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between text-sm">
                    <span className="text-gray-400 text-xs">{label}</span>
                    <span className="font-semibold text-[#1a3a6b] text-xs text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>
              <button onClick={logout} className="w-full py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl font-semibold text-sm">
                {t("logout", lang)}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <div className="bg-white border-t border-gray-100 px-2 py-1.5 flex justify-around flex-shrink-0">
          <NavItem id="home" icon="🏠" label={t("dashboard", lang).slice(0, 6)} />
          <NavItem id="ai_booking" icon="🤖" label="AI Book" />
          <NavItem id="nearby" icon="🗺" label="Centres" />
          <NavItem id="bookings" icon="📋" label="Bookings" />
          <NavItem id="sales" icon="📈" label="Sales" />
          <NavItem id="bills" icon="🧾" label="Bills" />
          <NavItem id="complaint" icon="📣" label="Griev." />
          <NavItem id="voice" icon="🎤" label="Voice" />
          <NavItem id="profile" icon="👤" label="Profile" />
        </div>
      </div>
    </div>
  );
}
