import { useState } from "react";
import { useAuth, AgentUser } from "../auth";
import { useLang } from "../hooks/useLang";
import { useStore } from "../store";
import { CROPS } from "../i18n";
import KishanSetuLogo from "../components/KishanSetuLogo";
import BhashiniAssistant from "../components/BhashiniAssistant";

interface Props {
  onHome: () => void;
  onLogout: () => void;
}

type Screen = "home" | "queue" | "book" | "bill" | "prices" | "farmers" | "profile" | "map" | "blacklist";

const DEMO_FARMERS = [
  { id:"KF-543210", name:"Ramesh Kumar", mob:"9876543210", crop:"Wheat", qty:2.5, kyc:"verified",
    status:"waiting", state:"Uttar Pradesh", district:"Lucknow", village:"Khanpur",
    lat:26.88, lng:80.97, aadhaar:"XXXX XXXX 4321", land:3.5, bank:"XXXXXXXX4821",
    kisanCard:"KCC-UP-2024-98765", dbt:true, requestedAt:"2026-09-10T09:15:00",
    docs:{ aadhaar:"verified", land_record:"verified", bank:"verified", kisan_card:"verified" } },
  { id:"KF-221198", name:"Suman Devi", mob:"9765432101", crop:"Rice", qty:1.8, kyc:"pending",
    status:"waiting", state:"Uttar Pradesh", district:"Lucknow", village:"Mati",
    lat:26.83, lng:80.90, aadhaar:"XXXX XXXX 7654", land:1.2, bank:"XXXXXXXX9012",
    kisanCard:"", dbt:false, requestedAt:"2026-09-10T09:22:00",
    docs:{ aadhaar:"pending", land_record:"verified", bank:"pending", kisan_card:"missing" } },
  { id:"KF-110234", name:"Mohan Lal", mob:"9654321012", crop:"Maize", qty:3.2, kyc:"verified",
    status:"in-progress", state:"Uttar Pradesh", district:"Lucknow", village:"Bakshi Ka Talab",
    lat:26.91, lng:80.99, aadhaar:"XXXX XXXX 1122", land:8.0, bank:"XXXXXXXX3344",
    kisanCard:"KCC-UP-2023-56789", dbt:true, requestedAt:"2026-09-10T08:45:00",
    docs:{ aadhaar:"verified", land_record:"verified", bank:"verified", kisan_card:"verified" } },
];

const AGENT_CENTRE = {
  lat: 26.85, lng: 80.95,
};

type FarmerRecord = typeof DEMO_FARMERS[0];

function FarmerDetailModal({ farmer, onClose, onAccept, onReject }: {
  farmer: FarmerRecord; onClose: () => void;
  onAccept: () => void; onReject: () => void;
}) {
  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="h-1 flex">
          <div className="flex-1" style={{ background:"#FF6B00" }} />
          <div className="flex-1 bg-white" />
          <div className="flex-1" style={{ background:"#138808" }} />
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-xl" style={{ color:"#1a0a00" }}>{farmer.name}</h3>
              <p className="text-sm text-gray-400">{farmer.id}</p>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-600 text-2xl leading-none">×</button>
          </div>

          {/* Contact details */}
          <div className="rounded-xl p-4 border-2 mb-4" style={{ background:"#E6F9E6", borderColor:"#138808" }}>
            <div className="font-bold text-sm mb-2" style={{ color:"#138808" }}>📞 Farmer Contact Details</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold" style={{ color:"#1a0a00" }}>{farmer.name}</div>
                <div style={{ color:"#138808", fontSize:14 }}>{farmer.mob}</div>
                <div className="text-xs text-gray-400">{farmer.village}, {farmer.district}</div>
              </div>
              <a href={`tel:+91${farmer.mob}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white"
                style={{ background:"#138808" }}>
                📞 Call
              </a>
            </div>
          </div>

          {/* Farmer details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              ["Crop", farmer.crop+" · "+farmer.qty+" Q"],
              ["Land", farmer.land+" Acres"],
              ["Aadhaar", farmer.aadhaar],
              ["Bank", farmer.bank],
              ["Kisan Card", farmer.kisanCard || "Not provided"],
              ["DBT Linked", farmer.dbt ? "✓ Yes" : "No"],
              ["Requested", new Date(farmer.requestedAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})],
              ["Location", farmer.village+", "+farmer.district],
            ].map(([k,v]) => (
              <div key={k as string} className="rounded-xl p-3" style={{ background:"#FFF9F3" }}>
                <div className="text-xs text-gray-400 mb-0.5">{k}</div>
                <div className="font-bold text-sm" style={{ color:"#1a0a00" }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Document verification status */}
          <div className="rounded-xl p-4 border mb-4" style={{ borderColor:"#FFE0C0", background:"#FFF9F3" }}>
            <div className="font-bold text-sm mb-3" style={{ color:"#FF6B00" }}>📋 Document Verification Status</div>
            <div className="space-y-2">
              {[
                ["Aadhaar Card", farmer.docs.aadhaar],
                ["Land Record (Khatauni)", farmer.docs.land_record],
                ["Bank Account / Passbook", farmer.docs.bank],
                ["Kisan Card / PM-KISAN", farmer.docs.kisan_card],
              ].map(([doc, status]) => (
                <div key={doc as string} className="flex items-center justify-between py-1 border-b" style={{ borderColor:"#FFE8D0" }}>
                  <span className="text-sm text-gray-600">{doc}</span>
                  <span className={status==="verified"?"badge-verified":status==="pending"?"badge-pending":"badge-danger"}>
                    {status === "missing" ? "⚠ Missing" : status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Request location on map */}
          <div className="rounded-xl overflow-hidden border-2 mb-5" style={{ borderColor:"#FFE0C0", height:120, position:"relative" }}>
            <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,#000080 0%,#138808 100%)", opacity:0.85 }} />
            <div className="absolute inset-0 flex items-center justify-center text-white/60 text-xs">
              Request Origin Map
            </div>
            {/* Centre dot */}
            <div className="absolute" style={{ top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}>
              <div className="w-4 h-4 rounded-full bg-white border-2 border-orange-500 shadow-lg" title="Procurement Centre" />
            </div>
            {/* Farmer dot with distance indicator */}
            <div className="absolute" style={{
              top:`${50 + (farmer.lat - AGENT_CENTRE.lat) * -800}%`,
              left:`${50 + (farmer.lng - AGENT_CENTRE.lng) * 800}%`,
              transform:"translate(-50%,-50%)"
            }}>
              <div className="w-3 h-3 rounded-full bg-green-400 border-2 border-white shadow" title={farmer.name} />
            </div>
            <div className="absolute bottom-2 left-3 text-[10px] text-white/60 font-mono">
              📍 {farmer.lat.toFixed(3)}°N, {farmer.lng.toFixed(3)}°E
            </div>
            <div className="absolute bottom-2 right-3 text-[10px] text-white/60">
              🏛 Centre: {AGENT_CENTRE.lat.toFixed(3)}°N
            </div>
          </div>

          {/* Accept / Reject actions */}
          <div className="flex gap-3">
            <button onClick={() => { onReject(); onClose(); }}
              className="flex-1 py-3 rounded-xl font-bold text-sm border-2"
              style={{ borderColor:"#b91c1c", color:"#b91c1c" }}>
              ✕ Reject / Flag
            </button>
            <button onClick={() => { onAccept(); onClose(); }}
              className="flex-1 py-3 rounded-xl font-bold text-sm text-white"
              style={{ background:"linear-gradient(135deg,#138808,#1eaf0a)", boxShadow:"0 4px 12px rgba(19,136,8,0.3)" }}>
              ✓ Accept Farmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Crop Price Editor ────────────────────────────────────────────────
function CropPriceEditor() {
  const { state } = useStore();
  const [editId, setEditId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editSeason, setEditSeason] = useState("");
  const [newCrop, setNewCrop] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newSeason, setNewSeason] = useState("Kharif 2025-26");
  const [saved, setSaved] = useState<string | null>(null);
  // Local overrides for edited prices (persisted in component state)
  const [priceOverrides, setPriceOverrides] = useState<Record<string, { mspPerQ: number; season: string }>>({});
  const [extraCrops, setExtraCrops] = useState<{ crop: string; mspPerQ: number; season: string }[]>([]);

  function saveEdit(crop: string) {
    const p = parseFloat(editPrice);
    if (!p || p <= 0) return;
    setPriceOverrides(prev => ({ ...prev, [crop]: { mspPerQ: p, season: editSeason } }));
    setEditId(null); setSaved(crop);
    setTimeout(() => setSaved(null), 2000);
  }

  function addCrop() {
    if (!newCrop.trim() || !newPrice) return;
    setExtraCrops(prev => [...prev, { crop: newCrop.trim(), mspPerQ: parseFloat(newPrice), season: newSeason }]);
    setSaved("added"); setTimeout(() => setSaved(null), 2000);
    setNewCrop(""); setNewPrice("");
  }

  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-sm text-gray-500">As a procurement agent, you can update the price you offer for each crop. Changes are visible to farmers browsing your centre.</p>
      {saved && <div className="rounded-xl px-4 py-3 text-sm font-bold text-green-800 bg-green-50 border-2 border-green-300">✓ Price updated and visible to farmers</div>}

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor:"#FFE0C0" }}>
        <table className="data-table w-full">
          <thead><tr><th>Crop</th><th>Centre Price (₹/Q)</th><th>Season</th><th>Action</th></tr></thead>
          <tbody>
            {[...state.cropPrices.map(cp => ({ ...cp, ...(priceOverrides[cp.crop] ?? {}) })), ...extraCrops].map(cp => (
              <tr key={cp.crop}>
                <td className="font-bold">{cp.crop}</td>
                <td>
                  {editId === cp.crop ? (
                    <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)}
                      className="w-28 border-2 border-orange-300 rounded-lg px-2 py-1 text-sm focus:outline-none bg-white"
                      autoFocus />
                  ) : (
                    <span className={`font-mono font-bold ${priceOverrides[cp.crop] ? "text-orange-600" : "text-green-700"}`}>
                      ₹{cp.mspPerQ.toLocaleString()}{priceOverrides[cp.crop] && <span className="text-xs ml-1 text-orange-400">(edited)</span>}
                    </span>
                  )}
                </td>
                <td>
                  {editId === cp.crop ? (
                    <input value={editSeason} onChange={e => setEditSeason(e.target.value)}
                      className="w-36 border-2 border-orange-300 rounded-lg px-2 py-1 text-sm focus:outline-none bg-white" />
                  ) : (
                    <span className="text-gray-400 text-xs">{cp.season}</span>
                  )}
                </td>
                <td>
                  {editId === cp.crop ? (
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(cp.crop)}
                        className="text-xs font-bold px-2 py-1 rounded-lg text-white" style={{ background:"#138808" }}>Save</button>
                      <button onClick={() => setEditId(null)}
                        className="text-xs font-bold px-2 py-1 rounded-lg border" style={{ color:"#7a5a3a" }}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditId(cp.crop); setEditPrice(cp.mspPerQ.toString()); setEditSeason(cp.season); }}
                      className="text-xs font-bold px-2 py-1 rounded-lg border-2" style={{ borderColor:"#FF6B00", color:"#FF6B00" }}>
                      ✏ Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-2xl border p-5" style={{ borderColor:"#FFE0C0" }}>
        <div className="font-bold text-sm mb-4" style={{ color:"#1a0a00" }}>+ Add New Crop Price</div>
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-bold mb-1" style={{ color:"#FF6B00" }}>Crop Name</label>
            <input value={newCrop} onChange={e => setNewCrop(e.target.value)} placeholder="e.g. Jowar"
              className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1" style={{ color:"#FF6B00" }}>Price (₹/Q)</label>
            <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="e.g. 2400"
              className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1" style={{ color:"#FF6B00" }}>Season</label>
            <input value={newSeason} onChange={e => setNewSeason(e.target.value)} placeholder="Season"
              className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white" />
          </div>
        </div>
        <button onClick={addCrop} disabled={!newCrop.trim() || !newPrice}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-40"
          style={{ background:"linear-gradient(135deg,#138808,#1eaf0a)" }}>
          + Add Crop Price
        </button>
      </div>
      <p className="text-xs text-gray-400">MSP (Minimum Support Price) is set by Government of India. Your centre price must be at or above MSP. Admin can review price changes.</p>
    </div>
  );
}

// ── Blacklist / Flag Farmer Panel ─────────────────────────────────────
type FarmerRec = { id: string; name: string; mob: string; crop: string; qty: number; kyc: string; status: any; docs: any; };

function BlacklistPanel({ farmerStatuses, onReject, onView }: {
  farmerStatuses: Record<string, string>;
  onReject: (id: string) => void;
  onView: (f: any) => void;
}) {
  const DEMO_FARMERS_BL = [
    { id:"KF-543210", name:"Ramesh Kumar", mob:"9876543210", crop:"Wheat", qty:2.5, kyc:"verified",
      status:"waiting", reason:"", suspended:false,
      docs:{ aadhaar:"verified", land_record:"verified", bank:"verified", kisan_card:"verified" } },
    { id:"KF-221198", name:"Suman Devi", mob:"9765432101", crop:"Rice", qty:1.8, kyc:"pending",
      status:"waiting", reason:"", suspended:false,
      docs:{ aadhaar:"pending", land_record:"verified", bank:"pending", kisan_card:"missing" } },
    { id:"KF-110234", name:"Mohan Lal", mob:"9654321012", crop:"Maize", qty:3.2, kyc:"verified",
      status:"in-progress", reason:"", suspended:false,
      docs:{ aadhaar:"verified", land_record:"verified", bank:"verified", kisan_card:"verified" } },
  ];

  const [flagged, setFlagged] = useState<Record<string, { reason: string; suspended: boolean; submitting: boolean }>>({});
  const [editReason, setEditReason] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  function submitFlag(id: string, name: string) {
    const reason = editReason[id] || "Suspicious document — reverification required";
    setFlagged(p => ({ ...p, [id]: { reason, suspended: true, submitting: false } }));
    onReject(id);
    setDone(name); setShowForm(null);
    setTimeout(() => setDone(null), 3000);
  }

  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-sm text-gray-500">Flag a farmer for reverification. Their KishanSetu account will be suspended until the admin verifies their documents. This action is logged and reviewed by the admin console.</p>
      {done && (
        <div className="rounded-xl px-4 py-3 text-sm font-bold border-2" style={{ background:"#FFF0F0", borderColor:"#fca5a5", color:"#b91c1c" }}>
          🚫 {done}'s account has been flagged for reverification. Account suspended until admin review.
        </div>
      )}
      <div className="space-y-3">
        {DEMO_FARMERS_BL.map(f => {
          const isFlagged = !!flagged[f.id]?.suspended;
          return (
            <div key={f.id} className={`bg-white rounded-2xl border-2 p-4 ${isFlagged ? "border-red-300 bg-red-50" : "border-orange-100"}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: isFlagged ? "#b91c1c" : "#FF6B00" }}>
                  {f.name[0]}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm" style={{ color:"#1a0a00" }}>{f.name}</div>
                  <div className="text-xs text-gray-400">{f.id} · {f.crop} · 📞 {f.mob}</div>
                </div>
                {isFlagged ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700">🚫 Suspended</span>
                ) : (
                  <button onClick={() => setShowForm(showForm === f.id ? null : f.id)}
                    className="text-xs font-bold px-3 py-2 rounded-xl border-2 transition-colors"
                    style={{ borderColor:"#b91c1c", color:"#b91c1c" }}>
                    🚫 Flag Farmer
                  </button>
                )}
              </div>

              <div className="flex gap-2 text-xs mb-2">
                {Object.entries(f.docs).map(([doc, status]) => (
                  <span key={doc} className={`px-2 py-0.5 rounded-full font-bold ${status==="verified"?"bg-green-50 text-green-700":status==="pending"?"bg-yellow-50 text-yellow-700":"bg-red-50 text-red-700"}`}>
                    {doc.replace("_"," ")} {status==="verified"?"✓":status==="missing"?"⚠":"?"}
                  </span>
                ))}
              </div>

              {isFlagged && (
                <div className="text-xs p-3 rounded-xl border" style={{ background:"#FFF0F0", borderColor:"#fca5a5", color:"#7a0000" }}>
                  <strong>Reason:</strong> {flagged[f.id].reason}<br/>
                  <span className="text-gray-400">Pending admin reverification. Farmer cannot access platform until resolved.</span>
                </div>
              )}

              {showForm === f.id && !isFlagged && (
                <div className="mt-3 p-4 rounded-xl border-2 space-y-3" style={{ background:"#FFF5F5", borderColor:"#fca5a5" }}>
                  <p className="text-xs font-bold" style={{ color:"#b91c1c" }}>⚠ Flagging will suspend this farmer's account pending admin review</p>
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color:"#b91c1c" }}>Reason for flagging *</label>
                    <textarea value={editReason[f.id] || ""} onChange={e => setEditReason(p => ({ ...p, [f.id]: e.target.value }))}
                      placeholder="Describe the issue (e.g. fake land record, mismatched Aadhaar details, duplicate account...)"
                      className="w-full border-2 border-red-200 focus:border-red-400 rounded-xl px-3 py-2 text-xs focus:outline-none bg-white resize-none"
                      rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowForm(null)}
                      className="flex-1 py-2 text-xs rounded-xl border-2" style={{ borderColor:"#ccc", color:"#7a5a3a" }}>
                      Cancel
                    </button>
                    <button onClick={() => submitFlag(f.id, f.name)}
                      disabled={!editReason[f.id]?.trim()}
                      className="flex-1 py-2 text-xs rounded-xl font-bold text-white disabled:opacity-40"
                      style={{ background:"#b91c1c" }}>
                      🚫 Confirm Flag & Suspend
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 text-center">Flagged farmers are reviewed by the district admin within 48 hours. You can also raise a formal grievance from the admin console.</p>
    </div>
  );
}

export default function AgentDashboardWeb({ onHome, onLogout }: Props) {
  const { user } = useAuth();
  const { T } = useLang();
  const { state, dispatch } = useStore();
  const agent = user as AgentUser;
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerRecord | null>(null);
  const [farmerStatuses, setFarmerStatuses] = useState<Record<string, "accepted"|"rejected"|"waiting"|"in-progress">>({});
  const [billFarmer, setBillFarmer] = useState(DEMO_FARMERS[0]);
  const [billActualQty, setBillActualQty] = useState("");
  const [billGrade, setBillGrade] = useState("A");
  const [billDeduction, setBillDeduction] = useState("");
  const [billDone, setBillDone] = useState(false);
  const [billTxn, setBillTxn] = useState<any>(null);
  const [manualCrop, setManualCrop] = useState("Wheat");
  const [manualQty, setManualQty] = useState("");
  const [manualDate, setManualDate] = useState("");
  const [manualFarmer, setManualFarmer] = useState("");
  const [bookDone, setBookDone] = useState(false);

  const allFarmers = [...DEMO_FARMERS, ...state.bookings.map(b => ({
    id: b.farmerId, name: b.farmerName, mob: "—", crop: b.crop, qty: b.quantity,
    kyc: b.kycVerified ? "verified" : "pending",
    status: (farmerStatuses[b.farmerId] || "waiting") as any,
    state: "—", district: "—", village: "—", lat: 26.85+Math.random()*0.1, lng: 80.95+Math.random()*0.1,
    aadhaar: "XXXX XXXX ****", land: 0, bank: "XXXXXXXX****", kisanCard: "", dbt: false,
    requestedAt: b.createdAt, docs: { aadhaar:"pending" as const, land_record:"pending" as const, bank:"pending" as const, kisan_card:"missing" as const }
  }))];

  const myTxns = state.transactions.filter(t => t.centreId === agent.id || t.centreName === agent.centreName);
  const mspPrice = (crop: string) => state.cropPrices.find(cp => cp.crop === crop)?.mspPerQ || 2275;

  function acceptFarmer(id: string) {
    setFarmerStatuses(p => ({ ...p, [id]: "accepted" }));
  }
  function rejectFarmer(id: string) {
    setFarmerStatuses(p => ({ ...p, [id]: "rejected" }));
  }

  function generateBill() {
    const qty = parseFloat(billActualQty) || 0;
    const msp = mspPrice(billFarmer.crop);
    const gross = qty * msp;
    const qDed = parseFloat(billDeduction) || 0;
    const net = gross - qDed;
    const txn: any = {
      id:"TXN-"+Date.now(), bookingId:"BK-MANUAL", farmerId:billFarmer.id, farmerName:billFarmer.name,
      centreId:agent.id, centreName:agent.centreName, crop:billFarmer.crop,
      scheduledQty:billFarmer.qty, actualQty:qty, qualityGrade:billGrade, pricePerQ:msp,
      grossAmount:Math.round(gross), qualityDeduction:qDed, otherDeduction:0, netAmount:Math.round(net),
      agentId:agent.id, utrNumber:"UTR"+Date.now().toString().slice(-10),
      pfmsRef:"PFMS-2026-"+Math.floor(Math.random()*90000+10000), paymentStatus:"processing" as const,
      createdAt:new Date().toISOString(),
    };
    dispatch({ type:"CREATE_TRANSACTION", transaction:txn });
    setBillTxn(txn); setBillDone(true);
  }

  function handleManualBook() {
    if (!manualFarmer || !manualQty || !manualDate) return;
    dispatch({
      type:"CREATE_BOOKING",
      booking:{
        id:"BK-"+Date.now(), farmerId:"KF-MANUAL", farmerName:manualFarmer,
        centreId:agent.id, centreName:agent.centreName, crop:manualCrop,
        quantity:parseFloat(manualQty), date:manualDate, slot:"09:00-11:00",
        status:"pending", kycVerified:false, createdAt:new Date().toISOString(),
      },
    });
    setBookDone(true);
  }

  const nav = [
    { id:"home" as Screen, label:T("dashboard"), icon:"🏠" },
    { id:"queue" as Screen, label:T("manageQueue"), icon:"👥" },
    { id:"map" as Screen, label:"GPS Map", icon:"🗺" },
    { id:"book" as Screen, label:T("bookSlot"), icon:"📅" },
    { id:"bill" as Screen, label:T("generateBill"), icon:"🧾" },
    { id:"prices" as Screen, label:T("editPrices"), icon:"📊" },
    { id:"farmers" as Screen, label:T("farmerDocs"), icon:"🌾" },
    { id:"blacklist" as Screen, label:T("flagDocument"), icon:"🚫" },
    { id:"profile" as Screen, label:T("profile"), icon:"🏢" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background:"#FFFDF9" }}>
      <BhashiniAssistant role="agent" />
      {selectedFarmer && (
        <FarmerDetailModal farmer={selectedFarmer} onClose={() => setSelectedFarmer(null)}
          onAccept={() => acceptFarmer(selectedFarmer.id)}
          onReject={() => rejectFarmer(selectedFarmer.id)}
        />
      )}

      {/* Sidebar */}
      <div className="w-60 flex-shrink-0 flex flex-col bg-white border-r" style={{ borderColor:"#FFE0C0" }}>
        <div className="p-5 border-b" style={{ borderColor:"#FFE0C0" }}>
          <KishanSetuLogo size={36} />
          <div className="mt-3">
            <div className="text-xs text-gray-400 mb-0.5">Procurement Centre</div>
            <div className="font-bold text-sm" style={{ color:"#1a0a00" }}>{agent.centreName}</div>
            <div className="flex gap-1.5 mt-1 flex-wrap">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${agent.centreType==="govt"?"bg-blue-50 text-blue-700":"bg-purple-50 text-purple-700"}`}>
                {agent.centreType==="govt"?"GOVT":"PRIVATE"}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${agent.documentsStatus==="verified"?"bg-green-50 text-green-700":"bg-yellow-50 text-yellow-700"}`}>
                {agent.documentsStatus==="verified"?"✓ Verified":"Pending"}
              </span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(n => (
            <button key={n.id} onClick={() => setScreen(n.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
              style={screen===n.id?{background:"linear-gradient(135deg,#FF6B00,#FF8C2A)",color:"white",fontWeight:700}:{color:"#7a5a3a"}}
              onMouseEnter={e => { if (screen!==n.id) e.currentTarget.style.background="#FFF5EB"; }}
              onMouseLeave={e => { if (screen!==n.id) e.currentTarget.style.background=""; }}>
              <span>{n.icon}</span><span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t space-y-1" style={{ borderColor:"#FFE0C0" }}>
          <button onClick={onHome}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-colors"
            style={{ color:"#000080" }}
            onMouseEnter={e => e.currentTarget.style.background="#eef0ff"}
            onMouseLeave={e => e.currentTarget.style.background=""}>
            🏠 {T("back")}
          </button>
          <button onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl transition-colors"
            style={{ color:"#b91c1c" }}
            onMouseEnter={e => e.currentTarget.style.background="#FFF0F0"}
            onMouseLeave={e => e.currentTarget.style.background=""}>
            🚪 {T("logout")}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b flex items-center justify-between px-8 py-4" style={{ borderColor:"#FFE0C0" }}>
          <h1 className="font-display font-bold text-xl" style={{ color:"#1a0a00" }}>
            {nav.find(n => n.id===screen)?.icon} {nav.find(n => n.id===screen)?.label}
          </h1>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-gray-400">Centre Active</span>
          </div>
        </div>
        <div className="h-1 flex">
          <div className="flex-1" style={{ background:"#FF6B00" }} />
          <div className="flex-1 bg-white" />
          <div className="flex-1" style={{ background:"#138808" }} />
        </div>

        <div className="p-8">

          {/* HOME */}
          {screen === "home" && (
            <div className="space-y-6">
              <div className="rounded-3xl overflow-hidden relative" style={{ minHeight:200 }}>
                <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,#000080,#FF6B00 50%,#138808)" }} />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&h=300&fit=crop&auto=format)", backgroundSize:"cover" }} />
                <div className="relative p-8 flex items-center justify-between text-white">
                  <div>
                    <p className="text-white/50 text-sm mb-1">Agent Dashboard</p>
                    <h2 className="font-display font-bold text-2xl">{agent.centreName}</h2>
                    <p className="text-white/40 text-sm mt-1">{agent.block}, {agent.district}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-xs mb-1">Today's Processing</p>
                    <p className="font-display font-bold text-3xl">{myTxns.length}</p>
                    <p className="text-white/30 text-xs mt-1">Transactions</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {label:"Queue Today",val:allFarmers.length,icon:"👥",s:"queue" as Screen},
                  {label:"Bills Generated",val:myTxns.length,icon:"🧾",s:"bill" as Screen},
                  {label:"Amount Processed",val:"₹"+myTxns.reduce((s,t)=>s+t.netAmount,0).toLocaleString(),icon:"💰",s:"bill" as Screen},
                  {label:"Accepted Today",val:Object.values(farmerStatuses).filter(s=>s==="accepted").length,icon:"✓",s:"queue" as Screen},
                ].map(k=>(
                  <button key={k.label} onClick={()=>setScreen(k.s)} className="kpi-card text-left hover:shadow-md transition-all">
                    <div className="text-2xl mb-2">{k.icon}</div>
                    <div className="font-display font-bold text-xl" style={{ color:"#1a0a00" }}>{k.val}</div>
                    <div className="text-xs text-gray-400 mt-1">{k.label}</div>
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl border p-5" style={{ borderColor:"#FFE0C0" }}>
                <h3 className="font-bold mb-4" style={{ color:"#1a0a00" }}>Live Queue — Click farmer to view details</h3>
                <div className="space-y-2">
                  {DEMO_FARMERS.slice(0,3).map((f,i) => {
                    const s = farmerStatuses[f.id] || f.status;
                    return (
                      <button key={f.id} onClick={() => setSelectedFarmer(f)}
                        className="w-full flex items-center gap-4 p-3 rounded-xl text-left hover:bg-orange-50 transition-colors">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{ background: s==="accepted"?"#138808":s==="rejected"?"#b91c1c":s==="in-progress"?"#FF6B00":"#000080" }}>
                          {i+1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm" style={{ color:"#1a0a00" }}>{f.name}</div>
                          <div className="text-xs text-gray-400">{f.crop} · {f.qty} Q · 📞 {f.mob}</div>
                        </div>
                        <span className={`badge-${f.kyc==="verified"?"verified":"pending"}`}>{f.kyc}</span>
                        <span className="text-xs font-bold" style={{ color:s==="accepted"?"#138808":s==="rejected"?"#b91c1c":s==="in-progress"?"#FF6B00":"#7a5a3a" }}>
                          {s==="in-progress"?"⚡ Processing":s==="accepted"?"✓ Accepted":s==="rejected"?"✕ Rejected":"Waiting"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* FARMER QUEUE */}
          {screen === "queue" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Click any row to view documents, contact details, and accept or reject.</p>
              <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor:"#FFE0C0" }}>
                <table className="data-table w-full">
                  <thead><tr><th>#</th><th>Farmer</th><th>Crop & Qty</th><th>Phone</th><th>KYC</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {allFarmers.map((f,i) => {
                      const s = farmerStatuses[f.id] || f.status;
                      return (
                        <tr key={f.id+i} className="cursor-pointer" onClick={() => setSelectedFarmer(f)}>
                          <td>{i+1}</td>
                          <td className="font-bold" style={{ color:"#1a0a00" }}>{f.name}</td>
                          <td>{f.crop} · {f.qty} Q</td>
                          <td className="font-mono text-xs">{f.mob}</td>
                          <td><span className={`badge-${f.kyc==="verified"?"verified":"pending"}`}>{f.kyc}</span></td>
                          <td><span className="text-xs font-bold" style={{ color:s==="accepted"?"#138808":s==="rejected"?"#b91c1c":s==="in-progress"?"#FF6B00":"#7a5a3a" }}>
                            {s==="in-progress"?"⚡ Processing":s==="accepted"?"✓ Accepted":s==="rejected"?"✕ Rejected":"Waiting"}
                          </span></td>
                          <td className="flex gap-2" onClick={e => e.stopPropagation()}>
                            <button onClick={() => acceptFarmer(f.id)} className="text-xs font-bold hover:underline" style={{ color:"#138808" }}>Accept</button>
                            <button onClick={() => rejectFarmer(f.id)} className="text-xs font-bold hover:underline" style={{ color:"#b91c1c" }}>Reject</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REQUEST MAP */}
          {screen === "map" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Live map showing where farmer requests are coming from.</p>
              <div className="relative rounded-2xl overflow-hidden border-2" style={{ height:420, borderColor:"#FFE0C0" }}>
                <div className="absolute inset-0" style={{ background:"linear-gradient(160deg,#000080 0%,#06065e 50%,#004d00 100%)" }} />
                {/* Grid lines */}
                {[...Array(8)].map((_,i)=>(
                  <div key={i} className="absolute inset-x-0" style={{ top:`${i*12.5}%`, borderBottom:"1px solid rgba(255,255,255,0.05)" }} />
                ))}
                {[...Array(10)].map((_,i)=>(
                  <div key={i} className="absolute inset-y-0" style={{ left:`${i*10}%`, borderRight:"1px solid rgba(255,255,255,0.05)" }} />
                ))}

                {/* Agent centre */}
                <div className="absolute" style={{ top:"50%", left:"50%", transform:"translate(-50%,-50%)", zIndex:10 }}>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background:"#FF6B00", transform:"scale(2)" }} />
                    <div className="w-6 h-6 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-xs" style={{ background:"#FF6B00" }}>🏛</div>
                  </div>
                  <div className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-white/60 bg-black/40 px-1.5 py-0.5 rounded">Your Centre</div>
                </div>

                {/* Farmer dots */}
                {DEMO_FARMERS.map((f,i) => {
                  const dx = (f.lng - AGENT_CENTRE.lng) * 500;
                  const dy = (f.lat - AGENT_CENTRE.lat) * -500;
                  const s = farmerStatuses[f.id] || f.status;
                  const color = s==="accepted"?"#2ecc40":s==="rejected"?"#ff4444":s==="in-progress"?"#FF8C2A":"#60a5fa";
                  return (
                    <button key={f.id}
                      onClick={() => setSelectedFarmer(f)}
                      className="absolute transition-all hover:scale-125"
                      style={{ top:`calc(50% + ${dy}px)`, left:`calc(50% + ${dx}px)`, transform:"translate(-50%,-50%)", zIndex:5 }}>
                      <div className="w-4 h-4 rounded-full border-2 border-white shadow-lg" style={{ background:color }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-white/80 bg-black/50 px-1.5 py-0.5 rounded opacity-0 hover:opacity-100 transition-opacity">
                          {f.name}
                        </div>
                      </div>
                      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-white/50">{f.name.split(" ")[0]}</div>
                    </button>
                  );
                })}

                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ opacity:0.2 }}>
                  {DEMO_FARMERS.map((f,i) => {
                    const dx = (f.lng - AGENT_CENTRE.lng) * 500;
                    const dy = (f.lat - AGENT_CENTRE.lat) * -500;
                    return <line key={f.id} x1="50%" y1="50%" x2={`calc(50% + ${dx}px)`} y2={`calc(50% + ${dy}px)`} stroke="#FF6B00" strokeWidth="1" strokeDasharray="4 4"/>;
                  })}
                </svg>

                <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs text-white/60">
                  <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-blue-400"/> Pending</span>
                  <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-green-400"/> Accepted</span>
                  <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full" style={{background:"#FF8C2A"}}/> Processing</span>
                  <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-red-400"/> Rejected</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center">Click any farmer dot to view full details, documents, and accept/reject.</p>
            </div>
          )}

          {/* MANUAL BOOKING */}
          {screen === "book" && (
            <div className="max-w-xl">
              {bookDone ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">✅</div>
                  <h2 className="font-display font-bold text-2xl mb-2" style={{ color:"#1a0a00" }}>Booking Created!</h2>
                  <button onClick={() => { setBookDone(false); setManualFarmer(""); setManualQty(""); setManualDate(""); }}
                    className="mt-4 px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background:"#FF6B00" }}>Book Another</button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor:"#FFE0C0" }}>
                  <h2 className="font-bold text-lg" style={{ color:"#1a0a00" }}>Manual Farmer Booking</h2>
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color:"#FF6B00" }}>Farmer Name</label>
                    <input value={manualFarmer} autoFocus onChange={e => setManualFarmer(e.target.value)} placeholder="Farmer full name"
                      className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color:"#FF6B00" }}>Crop</label>
                      <select value={manualCrop} onChange={e => setManualCrop(e.target.value)}
                        className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white">
                        {CROPS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color:"#FF6B00" }}>Qty (Q)</label>
                      <input type="number" value={manualQty} onChange={e => setManualQty(e.target.value)} placeholder="e.g. 3.5"
                        className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color:"#FF6B00" }}>Date</label>
                    <input type="date" value={manualDate} onChange={e => setManualDate(e.target.value)}
                      className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white" />
                  </div>
                  <button onClick={handleManualBook} disabled={!manualFarmer||!manualQty||!manualDate}
                    className="w-full py-3.5 rounded-xl font-bold text-white disabled:opacity-40"
                    style={{ background:"linear-gradient(135deg,#FF6B00,#FF8C2A)" }}>
                    Create Booking →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GENERATE BILL */}
          {screen === "bill" && (
            <div className="max-w-2xl">
              {billDone && billTxn ? (
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor:"#FFE0C0" }}>
                  <div className="px-5 py-4 flex items-center justify-between" style={{ background:"linear-gradient(135deg,#FF6B00,#FF8C2A)" }}>
                    <span className="font-display font-bold text-white">PROCUREMENT BILL</span>
                    <span className="font-mono text-white/60 text-sm">{billTxn.id}</span>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {[["Farmer",billTxn.farmerName],["Crop",billTxn.crop],["Actual Qty",billTxn.actualQty+" Q"],["Grade",billTxn.qualityGrade],["Rate","₹"+billTxn.pricePerQ+"/Q"],["Gross","₹"+billTxn.grossAmount.toLocaleString()],["Deduction","−₹"+billTxn.qualityDeduction],["Net Payable","₹"+billTxn.netAmount.toLocaleString()]].map(([k,v])=>(
                        <div key={k as string} className={`rounded-xl p-3 ${k==="Net Payable"?"col-span-2 border-2":""}`}
                          style={k==="Net Payable"?{background:"#E6F9E6",borderColor:"#138808"}:{background:"#FFF9F3"}}>
                          <div className="text-xs text-gray-400 mb-0.5">{k}</div>
                          <div className="font-bold" style={{ color:k==="Net Payable"?"#138808":"#1a0a00", fontSize:k==="Net Payable"?"1.2rem":"0.875rem" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl p-3 text-xs text-center font-mono border" style={{ background:"#eef0ff", color:"#000080", borderColor:"#8888ff" }}>
                      ✓ PFMS Ref: {billTxn.pfmsRef} · UTR: {billTxn.utrNumber}
                    </div>
                    <button onClick={() => { setBillDone(false); setBillActualQty(""); setBillDeduction(""); }}
                      className="w-full py-3 rounded-xl border-2 font-bold text-sm" style={{ borderColor:"#FF6B00", color:"#FF6B00" }}>
                      Generate Another Bill
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor:"#FFE0C0" }}>
                  <h2 className="font-bold text-lg" style={{ color:"#1a0a00" }}>Generate Procurement Bill</h2>
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-wide" style={{ color:"#FF6B00" }}>Select Farmer</label>
                    <div className="space-y-2">
                      {DEMO_FARMERS.map(f => (
                        <button key={f.id} onClick={() => setBillFarmer(f)}
                          className="w-full text-left p-3 rounded-xl border-2 text-sm transition-all"
                          style={billFarmer.id===f.id?{borderColor:"#FF6B00",background:"#FFF5EB"}:{borderColor:"#FFE0C0"}}>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold" style={{ color:"#1a0a00" }}>{f.name}</span>
                              <span className="text-gray-400 ml-2 text-xs">{f.crop} · {f.qty} Q · 📞 {f.mob}</span>
                            </div>
                            <span className={`badge-${f.kyc==="verified"?"verified":"pending"}`}>{f.kyc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color:"#FF6B00" }}>Actual Qty Weighed (Q)</label>
                      <input type="number" value={billActualQty} autoFocus onChange={e => setBillActualQty(e.target.value)} placeholder="e.g. 2.48"
                        className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color:"#FF6B00" }}>Quality Grade</label>
                      <select value={billGrade} onChange={e => setBillGrade(e.target.value)}
                        className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white">
                        {["A+","A","B+","B","C"].map(g => <option key={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color:"#FF6B00" }}>Quality Deduction (₹)</label>
                      <input type="number" value={billDeduction} onChange={e => setBillDeduction(e.target.value)} placeholder="0"
                        className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white" />
                    </div>
                    <div className="rounded-xl p-3 flex flex-col justify-center" style={{ background:"#FFF9F3" }}>
                      <div className="text-xs text-gray-400 mb-1">Est. Net Payment</div>
                      <div className="font-display font-bold text-xl" style={{ color:"#138808" }}>
                        {billActualQty ? "₹"+Math.round(parseFloat(billActualQty)*mspPrice(billFarmer.crop)-(parseFloat(billDeduction)||0)).toLocaleString() : "—"}
                      </div>
                    </div>
                  </div>
                  <button onClick={generateBill} disabled={!billActualQty}
                    className="w-full py-3.5 rounded-xl font-bold text-white disabled:opacity-40"
                    style={{ background:"linear-gradient(135deg,#138808,#1eaf0a)", boxShadow:"0 4px 16px rgba(19,136,8,0.3)" }}>
                    Generate Bill & Initiate PFMS Transfer →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CROP PRICES - EDITABLE BY AGENT */}
          {screen === "prices" && <CropPriceEditor />}

          {/* BLACKLIST / FLAG FARMER */}
          {screen === "blacklist" && <BlacklistPanel farmerStatuses={farmerStatuses} onReject={rejectFarmer} onView={setSelectedFarmer} />}

          {/* FARMER RECORDS */}
          {screen === "farmers" && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Click a farmer to view their full document verification and contact details.</p>
              <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor:"#FFE0C0" }}>
                <table className="data-table w-full">
                  <thead><tr><th>Farmer ID</th><th>Name</th><th>Phone</th><th>Crop</th><th>KYC</th><th>Docs</th><th>Status</th></tr></thead>
                  <tbody>
                    {DEMO_FARMERS.map(f => {
                      const s = farmerStatuses[f.id] || f.status;
                      const docsOk = Object.values(f.docs).filter(d=>d==="verified").length;
                      return (
                        <tr key={f.id} className="cursor-pointer" onClick={()=>setSelectedFarmer(f)}>
                          <td className="font-mono text-xs">{f.id}</td>
                          <td className="font-bold" style={{ color:"#1a0a00" }}>{f.name}</td>
                          <td className="font-mono text-xs">{f.mob}</td>
                          <td>{f.crop}</td>
                          <td><span className={`badge-${f.kyc==="verified"?"verified":"pending"}`}>{f.kyc}</span></td>
                          <td>
                            <div className="flex gap-0.5">
                              {Object.values(f.docs).map((d,i)=>(
                                <div key={i} className={`w-2 h-2 rounded-full ${d==="verified"?"bg-green-500":d==="pending"?"bg-yellow-400":"bg-red-400"}`} />
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-400">{docsOk}/4 verified</span>
                          </td>
                          <td><span className="text-xs font-bold" style={{ color:s==="accepted"?"#138808":s==="rejected"?"#b91c1c":"#7a5a3a" }}>
                            {s==="accepted"?"✓ Accepted":s==="rejected"?"✕ Rejected":"Pending"}
                          </span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROFILE */}
          {screen === "profile" && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-2xl border p-6" style={{ borderColor:"#FFE0C0" }}>
                <div className="flex items-center gap-5 mb-6 pb-6 border-b" style={{ borderColor:"#FFE0C0" }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-display font-bold text-2xl" style={{ background:"linear-gradient(135deg,#FF6B00,#138808)" }}>
                    {agent.name[0]}
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl" style={{ color:"#1a0a00" }}>{agent.centreName}</h2>
                    <p className="text-gray-400 text-sm">Agent: {agent.name} · {agent.id}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold mt-1 inline-block ${agent.documentsStatus==="verified"?"bg-green-50 text-green-700":"bg-yellow-50 text-yellow-700"}`}>
                      {agent.documentsStatus==="verified"?"✓ Documents Verified":"⚠ Docs Pending"}
                    </span>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[["Agent Name",agent.name],["Mobile",agent.phone],["Centre Type",agent.centreType==="govt"?"Government":"Private"],["State",agent.state],["District",agent.district],["Block",agent.block],["Address",agent.address],["PIN",agent.pincode],["GPS",agent.lat?agent.lat.toFixed(4)+"°N, "+agent.lng?.toFixed(4)+"°E":"Not set"],["Aadhaar",agent.aadhaarMasked]].map(([k,v])=>(
                    <div key={k as string} className="rounded-xl p-3" style={{ background:"#FFF9F3" }}>
                      <div className="text-xs text-gray-400 mb-0.5">{k}</div>
                      <div className="font-bold text-sm" style={{ color:"#1a0a00" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
