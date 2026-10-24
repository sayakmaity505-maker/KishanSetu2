import { useState } from "react";
import { useAuth, AgentUser } from "../auth";
import { useStore, formatINR } from "../store";
import { t } from "../i18n";

type Screen = "home" | "queue" | "manual_book" | "map" | "bill" | "prices" | "farmer_docs" | "sales" | "notifications" | "profile";

const FARMER_TOKENS = [
  { token: 1, name: "Ramesh Kumar", crop: "Wheat", qty: 48, harvestTime: "06:30", dist: "1.2km", status: "arrived" },
  { token: 2, name: "Priya Devi", crop: "Paddy", qty: 32, harvestTime: "07:00", dist: "0.8km", status: "en_route" },
  { token: 3, name: "Mohan Singh", crop: "Maize", qty: 65, harvestTime: "08:30", dist: "3.5km", status: "en_route" },
  { token: 4, name: "Sunita Bai", crop: "Gram", qty: 21, harvestTime: "09:00", dist: "5.1km", status: "booked" },
  { token: 5, name: "Rajiv Yadav", crop: "Wheat", qty: 55, harvestTime: "10:00", dist: "2.9km", status: "booked" },
];

const CROPS_PRICES = [
  { id: "C1", name: "Wheat", msp: 2585, centre_rate: 2590 },
  { id: "C2", name: "Paddy", msp: 2183, centre_rate: 2183 },
  { id: "C3", name: "Maize", msp: 2090, centre_rate: 2100 },
  { id: "C4", name: "Gram", msp: 5440, centre_rate: 5440 },
  { id: "C5", name: "Rice", msp: 2300, centre_rate: 2320 },
];

interface AgentDashboardProps { onDemoMode?: () => void; }
export default function AgentDashboard({ onDemoMode }: AgentDashboardProps) {
  const { user, lang, logout } = useAuth();
  const agent = user as AgentUser;
  const { state: storeState, dispatch } = useStore();
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedBooking, setSelectedBooking] = useState(storeState.bookings[0]);
  const [cropPrices, setCropPrices] = useState(CROPS_PRICES);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");
  const [billFarmer, setBillFarmer] = useState(FARMER_TOKENS[0].name);
  const [billCrop, setBillCrop] = useState("Wheat");
  const [billQty, setBillQty] = useState("");
  const [billGrade, setBillGrade] = useState("A");
  const [billDeduct, setBillDeduct] = useState("2");
  const [billGenerated, setBillGenerated] = useState(false);
  const [billId] = useState(() => "BILL-2026-" + Math.floor(Math.random() * 90000 + 10000));
  const [flaggedFarmers, setFlaggedFarmers] = useState<Record<string, boolean>>({});
  const [suspendedFarmers, setSuspendedFarmers] = useState<Record<string, boolean>>({});
  const [manualName, setManualName] = useState("");
  const [manualCrop, setManualCrop] = useState("Wheat");
  const [manualQty, setManualQty] = useState("");
  const [manualDate, setManualDate] = useState("");
  const [manualTime, setManualTime] = useState("09:00");
  const [manualBooked, setManualBooked] = useState(false);

  const pendingBookings = storeState.bookings.filter(b => b.status === "pending");
  const rate = cropPrices.find(c => c.name === billCrop)?.centre_rate || 2585;
  const gross = (parseFloat(billQty) || 0) * rate;
  const deductPct = parseFloat(billDeduct) || 0;
  const deductions = gross * deductPct / 100;
  const net = gross - deductions;

  function handleAccept(bookingId: string) {
    dispatch({ type: "UPDATE_BOOKING_STATUS", bookingId, status: "accepted" });
  }
  function handleReject(bookingId: string) {
    dispatch({ type: "UPDATE_BOOKING_STATUS", bookingId, status: "rejected" });
  }
  function handlePriceUpdate(id: string) {
    setCropPrices(prev => prev.map(c => c.id === id ? { ...c, centre_rate: parseFloat(editVal) || c.msp } : c));
    setEditingPrice(null);
  }
  function handleGenerateBill() {
    if (!billQty) return;
    setBillGenerated(true);
    dispatch({
      type: "CREATE_TRANSACTION",
      transaction: {
        id: billId,
        bookingId: selectedBooking?.id || "N/A",
        farmerId: "F001",
        farmerName: billFarmer,
        centreId: agent.id,
        centreName: agent.centreName,
        crop: billCrop,
        scheduledQty: parseFloat(billQty),
        actualQty: parseFloat(billQty),
        qualityGrade: billGrade,
        pricePerQ: rate,
        grossAmount: gross,
        qualityDeduction: deductions,
        otherDeduction: 0,
        netAmount: net,
        agentId: agent.id,
        paymentStatus: "processing",
        utrNumber: "UTR" + Date.now(),
        pfmsRef: "PFMS2026" + Math.floor(Math.random() * 100000000),
        createdAt: new Date().toISOString(),
      }
    });
  }

  const NavItem = ({ id, icon, label }: { id: Screen; icon: string; label: string }) => (
    <button onClick={() => setScreen(id)} className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all ${screen === id ? "text-[#d4500a]" : "text-gray-400 hover:text-[#1a3a6b]"}`}>
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
              <div className="text-white/70 text-xs">Agent · {agent.centreName}</div>
              <div className="text-white font-bold text-base">{agent.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${agent.documentsStatus === "verified" ? "bg-green-500 text-white" : agent.documentsStatus === "under_review" ? "bg-yellow-400 text-[#1a3a6b]" : "bg-orange-400 text-white"}`}>
                  {agent.documentsStatus === "verified" ? "✓ Verified" : agent.documentsStatus === "under_review" ? "⏳ Under Review" : "⚠ Docs Pending"}
                </span>
                <span className="text-xs text-blue-200">{agent.centreType === "govt" ? "🏛 Govt" : "🏬 Private"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setScreen("notifications")} className="text-white relative">
                <span className="text-2xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d4500a] rounded-full text-[9px] text-white flex items-center justify-center font-bold">{pendingBookings.length}</span>
              </button>
              {onDemoMode && <button onClick={onDemoMode} className="bg-white/20 text-white text-xs px-2 py-1 rounded-lg font-semibold hover:bg-white/30">SIH Demo</button>}
              <button onClick={logout} className="bg-white/20 text-white text-xs px-2 py-1 rounded-lg font-semibold hover:bg-white/30">{t("logout", lang)}</button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {screen === "home" && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Today's Queue", value: FARMER_TOKENS.length, icon: "👥", color: "bg-blue-50 border-blue-200" },
                  { label: "Pending Approvals", value: pendingBookings.length, icon: "⏳", color: "bg-yellow-50 border-yellow-200" },
                  { label: "Completed Today", value: 3, icon: "✅", color: "bg-green-50 border-green-200" },
                  { label: "Total Procured", value: "240 Q", icon: "🌾", color: "bg-orange-50 border-orange-200" },
                ].map(stat => (
                  <div key={stat.label} className={`${stat.color} border rounded-2xl p-3 text-center`}>
                    <div className="text-2xl">{stat.icon}</div>
                    <div className="text-xl font-bold text-[#1a3a6b] mt-0.5">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-xs font-bold text-[#1a3a6b]">Live Queue (Next 3)</div>
                  <button onClick={() => setScreen("queue")} className="text-xs text-[#d4500a] font-semibold">View All →</button>
                </div>
                {FARMER_TOKENS.slice(0, 3).map(tk => (
                  <div key={tk.token} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-7 h-7 rounded-full bg-[#1a3a6b] flex items-center justify-center text-white text-xs font-bold">{tk.token}</div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-700">{tk.name}</div>
                      <div className="text-xs text-gray-400">{tk.crop} · {tk.qty}Q · ETA {tk.harvestTime}</div>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${tk.status === "arrived" ? "bg-green-100 text-green-700" : tk.status === "en_route" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                      {tk.status === "arrived" ? "Here" : tk.status === "en_route" ? "En Route" : "Booked"}
                    </span>
                  </div>
                ))}
              </div>

              {pendingBookings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                  <div className="text-xs font-bold text-yellow-800 mb-2">⚠ {pendingBookings.length} Booking(s) Need Approval</div>
                  {pendingBookings.slice(0, 2).map(b => (
                    <div key={b.id} className="flex items-center gap-2 mb-2">
                      <div className="flex-1 text-xs">
                        <div className="font-semibold">{b.farmerName} · {b.crop} · {b.quantity}Q</div>
                        <div className="text-gray-500">{b.date} {b.slot}</div>
                      </div>
                      <button onClick={() => handleAccept(b.id)} className="px-2 py-1 bg-green-500 text-white rounded text-xs font-semibold">✓</button>
                      <button onClick={() => handleReject(b.id)} className="px-2 py-1 bg-red-400 text-white rounded text-xs font-semibold">✗</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {screen === "queue" && (
            <div className="p-4 space-y-3">
              <div className="text-sm font-bold text-[#1a3a6b]">👥 {t("manageQueue", lang)}</div>
              {FARMER_TOKENS.map(tk => (
                <div key={tk.token} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a3a6b] flex items-center justify-center text-white font-bold text-base flex-shrink-0">{tk.token}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-[#1a3a6b]">{tk.name}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${tk.status === "arrived" ? "bg-green-100 text-green-700" : tk.status === "en_route" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                          {tk.status === "arrived" ? "Arrived" : tk.status === "en_route" ? "En Route" : "Scheduled"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{tk.crop} · {tk.qty} Quintals · ETA {tk.harvestTime}</div>
                      <div className="text-xs text-gray-400">{tk.dist} from centre</div>
                    </div>
                  </div>
                  {tk.status === "arrived" && (
                    <button onClick={() => { setBillFarmer(tk.name); setBillCrop(tk.crop); setScreen("bill"); }} className="mt-3 w-full py-2 bg-[#d4500a] text-white rounded-xl text-xs font-bold">
                      {t("generateBill", lang)} →
                    </button>
                  )}
                </div>
              ))}

              <div className="text-xs font-bold text-[#1a3a6b] pt-2">Pending Bookings</div>
              {storeState.bookings.filter(b => b.status === "pending").map(b => (
                <div key={b.id} className="bg-white rounded-2xl p-4 border border-yellow-200 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-sm text-[#1a3a6b]">{b.farmerName}</div>
                      <div className="text-xs text-gray-500">{b.crop} · {b.quantity}Q</div>
                      <div className="text-xs text-gray-400">{b.date} · {b.slot}</div>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => handleAccept(b.id)} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold">Accept</button>
                      <button onClick={() => handleReject(b.id)} className="px-3 py-1.5 bg-red-400 text-white rounded-lg text-xs font-semibold">Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {screen === "manual_book" && (
            <div className="p-4 space-y-4">
              <div className="text-sm font-bold text-[#1a3a6b]">📅 Manual Slot Booking (for farmer)</div>
              {!manualBooked ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">Farmer Name</label>
                    <input value={manualName} onChange={e => setManualName(e.target.value)} placeholder="Farmer full name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">Crop</label>
                    <select value={manualCrop} onChange={e => setManualCrop(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white">
                      {CROPS_PRICES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">Quantity (Quintals)</label>
                    <input type="number" value={manualQty} onChange={e => setManualQty(e.target.value)} placeholder="e.g. 50" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">Date</label>
                    <input type="date" value={manualDate} onChange={e => setManualDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">Time Slot</label>
                    <select value={manualTime} onChange={e => setManualTime(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white">
                      {["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      if (manualName && manualQty && manualDate) {
                        dispatch({ type: "CREATE_BOOKING", booking: { id: "KS-2026-" + Math.floor(Math.random()*900000+100000), farmerId: "manual", farmerName: manualName, centreId: agent.id, centreName: agent.centreName, crop: manualCrop, quantity: parseFloat(manualQty), date: manualDate, slot: manualTime, status: "accepted", kycVerified: true, createdAt: new Date().toISOString() } });
                        setManualBooked(true);
                      }
                    }}
                    disabled={!manualName || !manualQty || !manualDate}
                    className="w-full py-3 bg-[#d4500a] text-white rounded-xl font-bold disabled:opacity-40"
                  >
                    Book Slot →
                  </button>
                </>
              ) : (
                <div className="bg-green-50 border border-green-300 rounded-2xl p-5 text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <div className="font-bold text-green-700">Slot Booked for {manualName}</div>
                  <div className="text-xs text-gray-500 mt-1">{manualCrop} · {manualQty}Q · {manualDate} {manualTime}</div>
                  <div className="text-xs text-gray-400 mt-1">SMS sent to farmer</div>
                  <button onClick={() => { setManualBooked(false); setManualName(""); setManualQty(""); setManualDate(""); }} className="mt-4 px-4 py-2 bg-[#1a3a6b] text-white rounded-lg text-xs font-semibold">Book Another</button>
                </div>
              )}
            </div>
          )}

          {screen === "map" && (
            <div className="p-4 space-y-4">
              <div className="text-sm font-bold text-[#1a3a6b]">🗺 Real-time Farmer Map</div>
              <div className="bg-white rounded-2xl border border-gray-200 h-52 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50" />
                <div className="relative text-center">
                  <div className="text-3xl">🗺</div>
                  <div className="text-xs text-gray-500 mt-1">PostGIS live map</div>
                  <div className="text-xs text-[#d4500a]">{FARMER_TOKENS.length} farmer tokens active</div>
                </div>
                {FARMER_TOKENS.map((tk, i) => (
                  <div
                    key={tk.token}
                    className="absolute"
                    style={{ left: `${20 + i * 14}%`, top: `${30 + (i % 2) * 25}%` }}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold shadow-md ${tk.status === "arrived" ? "bg-green-500 text-white" : tk.status === "en_route" ? "bg-blue-500 text-white" : "bg-gray-400 text-white"}`}>
                      {tk.token}
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-2 right-2 text-3xl">🏢</div>
              </div>
              <div className="space-y-2">
                {FARMER_TOKENS.map(tk => (
                  <div key={tk.token} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${tk.status === "arrived" ? "bg-green-500" : tk.status === "en_route" ? "bg-blue-500" : "bg-gray-400"}`}>{tk.token}</div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-[#1a3a6b]">{tk.name}</div>
                      <div className="text-xs text-gray-400">{tk.crop} · {tk.qty}Q · {tk.dist}</div>
                    </div>
                    <div className="text-xs text-gray-500">ETA {tk.harvestTime}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {screen === "bill" && (
            <div className="p-4 space-y-4">
              <div className="text-sm font-bold text-[#1a3a6b]">🧾 {t("generateBill", lang)}</div>
              {!billGenerated ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">Farmer Name</label>
                    <select value={billFarmer} onChange={e => setBillFarmer(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white">
                      {FARMER_TOKENS.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">Crop</label>
                    <select value={billCrop} onChange={e => setBillCrop(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white">
                      {CROPS_PRICES.map(c => <option key={c.id} value={c.name}>{c.name} (₹{c.centre_rate}/Q)</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">Actual Weight (Quintals)</label>
                    <input type="number" value={billQty} onChange={e => setBillQty(e.target.value)} placeholder="e.g. 48" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">Quality Grade</label>
                    <select value={billGrade} onChange={e => setBillGrade(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white">
                      {["A","B","C"].map(g => <option key={g} value={g}>Grade {g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a3a6b] mb-1">Deductions (%)</label>
                    <input type="number" min="0" max="20" value={billDeduct} onChange={e => setBillDeduct(e.target.value)} placeholder="e.g. 2" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
                  </div>
                  {billQty && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm space-y-1.5">
                      <div className="flex justify-between text-gray-600"><span>Gross ({billQty}Q × ₹{rate})</span><span>{formatINR(gross)}</span></div>
                      <div className="flex justify-between text-red-600"><span>Deductions ({billDeduct}%)</span><span>-{formatINR(deductions)}</span></div>
                      <div className="flex justify-between font-bold text-[#1a3a6b] text-base border-t border-gray-200 pt-2"><span>Net Payable</span><span>{formatINR(net)}</span></div>
                    </div>
                  )}
                  <button onClick={handleGenerateBill} disabled={!billQty} className="w-full py-3 bg-[#d4500a] text-white rounded-xl font-bold disabled:opacity-40">
                    Generate Bill & Initiate PFMS →
                  </button>
                </>
              ) : (
                <div className="bg-green-50 border border-green-300 rounded-2xl p-5 space-y-3">
                  <div className="text-center">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="font-bold text-green-700">{t("billGenerated", lang)}</div>
                    <div className="text-xs text-gray-500 mt-1 font-mono">{billId}</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-xs text-gray-700 space-y-1.5">
                    <div className="flex justify-between"><span>Farmer:</span><span className="font-semibold">{billFarmer}</span></div>
                    <div className="flex justify-between"><span>Crop:</span><span className="font-semibold">{billCrop} · {billQty}Q · Grade {billGrade}</span></div>
                    <div className="flex justify-between"><span>Gross:</span><span>{formatINR(gross)}</span></div>
                    <div className="flex justify-between text-red-600"><span>Deductions:</span><span>-{formatINR(deductions)}</span></div>
                    <div className="flex justify-between font-bold text-[#1a3a6b] text-sm border-t pt-2"><span>Net Paid:</span><span>{formatINR(net)}</span></div>
                    <div className="flex justify-between text-green-700"><span>Status:</span><span className="font-semibold">⏳ Processing via PFMS/DBT</span></div>
                  </div>
                  <button onClick={() => { setBillGenerated(false); setBillQty(""); }} className="w-full py-2 bg-[#1a3a6b] text-white rounded-xl text-xs font-semibold">Generate Next Bill</button>
                </div>
              )}
            </div>
          )}

          {screen === "prices" && (
            <div className="p-4 space-y-3">
              <div className="text-sm font-bold text-[#1a3a6b]">💰 {t("editPrices", lang)}</div>
              <div className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-xl p-3">Centre rate must be ≥ MSP. Changes logged and auditable.</div>
              {cropPrices.map(cp => (
                <div key={cp.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#1a3a6b]">{cp.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">MSP: {formatINR(cp.msp)}/Q</div>
                    </div>
                    <div className="text-right">
                      {editingPrice === cp.id ? (
                        <div className="flex gap-2 items-center">
                          <input type="number" value={editVal} onChange={e => setEditVal(e.target.value)} className="w-20 border border-[#1a3a6b] rounded-lg px-2 py-1 text-xs text-right" />
                          <button onClick={() => handlePriceUpdate(cp.id)} className="text-xs bg-green-500 text-white px-2 py-1 rounded font-semibold">✓</button>
                          <button onClick={() => setEditingPrice(null)} className="text-xs text-gray-400">✗</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-[#1a3a6b]">{formatINR(cp.centre_rate)}/Q</div>
                          <button onClick={() => { setEditingPrice(cp.id); setEditVal(String(cp.centre_rate)); }} className="text-xs bg-blue-50 border border-blue-200 text-[#1a3a6b] px-2 py-1 rounded-lg">Edit</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {screen === "farmer_docs" && (
            <div className="p-4 space-y-3">
              <div className="text-sm font-bold text-[#1a3a6b]">📄 {t("farmerDocs", lang)}</div>
              <div className="text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-xl p-3">⚠ Flagging a document as suspicious will trigger SMS notification to the farmer and queue suspension review by the State Nodal Agency.</div>
              {storeState.farmers.slice(0, 4).map(f => {
                const isFlagged = flaggedFarmers[f.id];
                const isSuspended = suspendedFarmers[f.id];
                return (
                  <div key={f.id} className={`bg-white rounded-2xl p-4 border shadow-sm ${isSuspended ? "border-red-300 bg-red-50" : isFlagged ? "border-orange-300" : "border-gray-100"}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-sm text-[#1a3a6b]">{f.name}</div>
                        <div className="text-xs text-gray-400">{f.id} · Aadhaar: {f.aadhaarMasked}</div>
                        <div className="text-xs text-gray-400">{f.village}, {f.district}</div>
                        <div className="text-xs text-gray-500 mt-1">{f.landAcres} acres</div>
                      </div>
                      <div>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${f.kycStatus === "verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {f.kycStatus === "verified" ? "✓ KYC" : "⏳ Pending"}
                        </span>
                      </div>
                    </div>
                    {isSuspended ? (
                      <div className="mt-2 text-xs text-red-700 font-semibold">⛔ Account Suspended — SMS sent</div>
                    ) : (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => setFlaggedFarmers(prev => ({ ...prev, [f.id]: !isFlagged }))}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${isFlagged ? "bg-orange-100 border-orange-300 text-orange-700" : "border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600"}`}
                        >
                          {isFlagged ? "⚑ Flagged" : t("flagDocument", lang)}
                        </button>
                        {isFlagged && (
                          <button
                            onClick={() => setSuspendedFarmers(prev => ({ ...prev, [f.id]: true }))}
                            className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-red-100 border border-red-300 text-red-700"
                          >
                            {t("suspendFarmer", lang)}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {screen === "sales" && (
            <div className="p-4 space-y-3">
              <div className="text-sm font-bold text-[#1a3a6b]">📊 {t("salesRecords", lang)}</div>
              {storeState.transactions.map(txn => (
                <div key={txn.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                  <div className="font-mono text-xs text-gray-400">{txn.id}</div>
                  <div className="font-semibold text-sm text-[#1a3a6b] mt-1">{txn.farmerName} · {txn.crop}</div>
                  <div className="text-xs text-gray-500">{txn.actualQty}Q · Rate {formatINR(txn.pricePerQ)}/Q</div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-xs text-gray-400">PFMS: <span className="font-mono">{txn.pfmsRef}</span></div>
                    <span className="font-bold text-[#1a3a6b]">{formatINR(txn.netAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {screen === "notifications" && (
            <div className="p-4 space-y-3">
              <div className="text-sm font-bold text-[#1a3a6b]">🔔 {t("notifications", lang)}</div>
              {[
                { title: "New Booking Request", body: "Ramesh Kumar wants to book a slot for Wheat (48Q) on 2026-09-12 at 06:00.", time: "5 min ago", type: "warn" },
                { title: "PFMS Payment Processed", body: "₹1,18,780 transferred via PFMS for Booking KS-2026-001284. UTR: PFMS2026090901843", time: "2 hrs ago", type: "success" },
                { title: "Document Verification Alert", body: "State Nodal Agency flagged Priya Devi's land records for additional verification.", time: "1 day ago", type: "alert" },
              ].map((n, i) => (
                <div key={i} className={`bg-white rounded-2xl p-4 border ${n.type === "success" ? "border-green-200" : n.type === "warn" ? "border-yellow-200" : "border-red-200"}`}>
                  <div className="flex gap-3">
                    <span className="text-2xl">{n.type === "success" ? "💰" : n.type === "warn" ? "📋" : "⚠"}</span>
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

          {screen === "profile" && (
            <div className="p-4 space-y-4">
              <div className="text-sm font-bold text-[#1a3a6b]">👤 Agent Profile</div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-2.5">
                {[
                  ["Agent Name", agent.name],
                  ["Phone", "+91 " + agent.phone],
                  ["Aadhaar", agent.aadhaarMasked],
                  ["Centre Name", agent.centreName],
                  ["Centre Type", agent.centreType === "govt" ? "🏛 Government" : "🏬 Private"],
                  ["State", agent.state + ", " + agent.district],
                  ["Block", agent.block],
                  ["Address", agent.address],
                  ["PIN Code", agent.pincode],
                  ["GPS", agent.lat ? `${agent.lat?.toFixed(4)}°N, ${agent.lng?.toFixed(4)}°E` : "Not set"],
                  ["Doc Status", agent.documentsStatus],
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
        <div className="bg-white border-t border-gray-100 px-1 py-1.5 flex justify-around flex-shrink-0">
          <NavItem id="home" icon="🏠" label="Home" />
          <NavItem id="queue" icon="👥" label="Queue" />
          <NavItem id="manual_book" icon="📅" label="Book" />
          <NavItem id="map" icon="🗺" label="Map" />
          <NavItem id="bill" icon="🧾" label="Bill" />
          <NavItem id="prices" icon="💰" label="Prices" />
          <NavItem id="farmer_docs" icon="📄" label="Docs" />
          <NavItem id="sales" icon="📊" label="Sales" />
          <NavItem id="profile" icon="👤" label="Profile" />
        </div>
      </div>
    </div>
  );
}
