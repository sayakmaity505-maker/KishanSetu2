import { useState, useEffect } from "react";
import { useStore, Booking, formatINR } from "../store";

type Screen =
  | "login"
  | "id-check"
  | "dashboard"
  | "queue"
  | "booking-detail"
  | "qr-scanner"
  | "weighment"
  | "transaction"
  | "audit-export";

interface Props {
  onBack: () => void;
  guidedScreen?: string;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "badge-pending",
    accepted: "badge-accepted",
    rejected: "badge-rejected",
    rescheduled: "badge-rescheduled",
    completed: "badge-completed",
    verified: "badge-verified",
  };
  const labels: Record<string, string> = {
    pending: "🟡 Pending",
    accepted: "🟢 Accepted",
    rejected: "🔴 Rejected",
    rescheduled: "🔵 Rescheduled",
    completed: "✅ Completed",
    verified: "✓ KYC Verified",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] ?? "badge-pending"}`}>
      {labels[status] ?? status}
    </span>
  );
}

function GovHeader({ title, sub, onBack }: { title: string; sub?: string; onBack: () => void }) {
  return (
    <div className="bg-[#1a3a6b] text-white">
      <div className="utility-bar py-1 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-3 text-[10.5px] text-[#4a3f2f]">
            <span>Skip to Content</span><span className="text-[#c0b090]">|</span>
            <span>Font Size: A- A A+</span><span className="text-[#c0b090]">|</span>
            <span>High Contrast</span>
          </div>
          <div className="text-[10.5px] font-medium">
            <button className="text-[#1a3a6b] font-semibold underline">हिंदी</button>
            <span className="text-[#c0b090] mx-1">/</span>
            <button className="text-[#1a3a6b] font-semibold">English</button>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="text-white/70 hover:text-white text-sm border border-white/30 hover:border-white/60 px-3 py-1.5 rounded transition-colors">
          ← Home
        </button>
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          {sub && <p className="text-[#93c5fd] text-xs mt-0.5">{sub}</p>}
        </div>
        <div className="ml-auto text-right hidden md:block">
          <p className="text-[#93c5fd] text-xs">KishanSetu — Centre Agent Console</p>
          <p className="text-[#f5c842] text-xs font-semibold">⚠ SIH 2026 Demo</p>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  const items = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "queue", icon: "📋", label: "Booking Queue" },
    { id: "qr-scanner", icon: "📱", label: "QR Scanner" },
    { id: "transaction", icon: "⚖️", label: "Transaction" },
    { id: "audit-export", icon: "📤", label: "Audit Export" },
  ];
  return (
    <aside className="w-52 bg-[#0e2247] text-white flex flex-col shrink-0">
      <div className="p-4 border-b border-[#2a5298]/40">
        <p className="text-xs font-semibold text-[#93c5fd] uppercase tracking-wide">Centre Agent</p>
        <p className="font-bold text-sm mt-0.5">Rajesh Kumar</p>
        <p className="text-[#93c5fd] text-xs mono">CTR-024</p>
        <span className="inline-flex items-center gap-1 bg-[#1a6b2e]/30 text-[#a7d9b3] text-[10px] font-semibold px-2 py-0.5 rounded mt-1">
          🟢 Authorized
        </span>
      </div>
      <nav className="flex-1 py-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as Screen)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${
              screen === item.id
                ? "bg-[#2a5298] text-white border-r-2 border-[#d4500a]"
                : "text-[#93c5fd] hover:bg-[#1a3a6b] hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-[#2a5298]/40">
        <p className="text-[10px] text-[#4a6080]">Centre ID: CTR-024</p>
        <p className="text-[10px] text-[#4a6080] mt-0.5">Session: Active</p>
      </div>
    </aside>
  );
}

export default function CentreConsole({ onBack, guidedScreen }: Props) {
  const { state, dispatch } = useStore();
  const [screen, setScreen] = useState<Screen>("login");
  const [agentLoggedIn, setAgentLoggedIn] = useState(false);
  const [centreId, setCentreId] = useState("CTR-024");
  const [agentId, setAgentId] = useState("AGT-024-01");
  const [password, setPassword] = useState("agent123");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("14 September 2026");
  const [rescheduleSlot, setRescheduleSlot] = useState("10:00 – 11:00");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [actionMode, setActionMode] = useState<"reject" | "reschedule" | null>(null);
  const [weighment, setWeighment] = useState({ actualQty: "48.5", qualityGrade: "A", qualityDeduction: "2500", otherDeduction: "0" });
  const [txnCreated, setTxnCreated] = useState(false);
  const [scanned, setScanned] = useState(false);

  const agent = state.centreAgents.find((a) => a.id === "AGT-024-01")!;
  const centre = state.centres.find((c) => c.id === "CTR-024")!;
  const centreBookings = state.bookings.filter((b) => b.centreId === "CTR-024");
  const pendingBookings = centreBookings.filter((b) => b.status === "pending");
  const acceptedBookings = centreBookings.filter((b) => b.status === "accepted");
  const completedBookings = centreBookings.filter((b) => b.status === "completed");
  const selectedBooking = selectedBookingId ? state.bookings.find((b) => b.id === selectedBookingId) : null;

  useEffect(() => {
    if (!guidedScreen) return;
    if (guidedScreen === "queue") {
      setAgentLoggedIn(true);
      setScreen("queue");
    }
    if (guidedScreen === "transaction") {
      setAgentLoggedIn(true);
      setScreen("transaction");
    }
    if (guidedScreen === "audit") {
      setAgentLoggedIn(true);
      setScreen("audit-export");
    }
  }, [guidedScreen]);

  const handleLogin = () => {
    setAgentLoggedIn(true);
    setScreen("id-check");
  };

  const handleAccept = (bookingId: string) => {
    dispatch({
      type: "UPDATE_BOOKING_STATUS",
      bookingId,
      status: "accepted",
      extra: { queuePosition: 17, queueCurrent: 12, estimatedWaitMins: 45 },
    });
    dispatch({
      type: "ADD_NOTIFICATION",
      notification: {
        id: `N${Date.now()}`,
        farmerId: state.bookings.find(b => b.id === bookingId)?.farmerId ?? "F001",
        message: `Your procurement request has been accepted. You are #17 in queue.`,
        hindi: "आपका खरीद अनुरोध स्वीकार हो गया। आप कतार में #17 हैं।",
        type: "acceptance",
        read: false,
        createdAt: new Date().toISOString(),
      },
    });
    setActionMode(null);
  };

  const handleReject = (bookingId: string) => {
    if (!rejectReason.trim()) return;
    dispatch({
      type: "UPDATE_BOOKING_STATUS",
      bookingId,
      status: "rejected",
      extra: { rejectionReason: rejectReason },
    });
    dispatch({
      type: "ADD_NOTIFICATION",
      notification: {
        id: `N${Date.now()}`,
        farmerId: state.bookings.find(b => b.id === bookingId)?.farmerId ?? "F001",
        message: `Your request has been rejected. Reason: ${rejectReason}`,
        hindi: `आपका अनुरोध अस्वीकार कर दिया गया। कारण: ${rejectReason}`,
        type: "rejection",
        read: false,
        createdAt: new Date().toISOString(),
      },
    });
    setRejectReason("");
    setActionMode(null);
  };

  const handleReschedule = (bookingId: string) => {
    if (!rescheduleReason.trim()) return;
    dispatch({
      type: "UPDATE_BOOKING_STATUS",
      bookingId,
      status: "rescheduled",
      extra: { rescheduleDate, rescheduleSlot, rescheduleReason },
    });
    setRescheduleReason("");
    setActionMode(null);
  };

  const handleTransaction = () => {
    if (txnCreated) return; // prevent duplicate submission
    // Find a booking that hasn't already been transacted
    const alreadyTransacted = new Set(state.transactions.map((t) => t.bookingId));
    const booking =
      state.bookings.find((b) => b.id === "KS-2026-001284" && !alreadyTransacted.has(b.id)) ??
      state.bookings.find((b) => b.status === "accepted" && b.centreId === "CTR-024" && !alreadyTransacted.has(b.id));
    if (!booking) return;
    const price = state.cropPrices.find((cp) => cp.crop === booking.crop)?.mspPerQ ?? 2585;
    const actual = parseFloat(weighment.actualQty);
    const gross = actual * price;
    const qDed = parseFloat(weighment.qualityDeduction);
    const oDed = parseFloat(weighment.otherDeduction);
    const net = gross - qDed - oDed;
    dispatch({
      type: "CREATE_TRANSACTION",
      transaction: {
        id: `TXN-2026-${Math.floor(Math.random() * 90000 + 10000)}`,
        bookingId: booking.id,
        farmerId: booking.farmerId,
        farmerName: booking.farmerName,
        centreId: booking.centreId,
        centreName: booking.centreName,
        crop: booking.crop,
        scheduledQty: booking.quantity,
        actualQty: actual,
        qualityGrade: weighment.qualityGrade,
        pricePerQ: price,
        grossAmount: gross,
        qualityDeduction: qDed,
        otherDeduction: oDed,
        netAmount: net,
        agentId: "AGT-024-01",
        utrNumber: `UTR2026${Date.now().toString().slice(-8)}`,
        pfmsRef: `PFMS/WB/2026/${Math.floor(Math.random() * 900000 + 100000)}`,
        paymentStatus: "processing",
        createdAt: new Date().toISOString(),
      },
    });
    setTxnCreated(true);
  };

  // -------- SCREENS --------

  if (!agentLoggedIn) {
    return (
      <div className="min-h-screen bg-[#eef2f7] flex flex-col">
        <div className="bg-[#1a3a6b] text-white">
          <div className="utility-bar py-1 px-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex gap-3 text-[10.5px] text-[#4a3f2f]">
                <span>Skip to Content</span><span className="text-[#c0b090]">|</span>
                <span>Screen Reader Access</span>
              </div>
              <div className="text-[10.5px] font-medium">
                <button className="text-[#1a3a6b] font-semibold">हिंदी</button>
                <span className="text-[#c0b090] mx-1">/</span>
                <button className="text-[#1a3a6b] font-semibold underline">English</button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
            <button onClick={onBack} className="text-white/70 hover:text-white text-sm border border-white/30 px-3 py-1.5 rounded">← Home</button>
            <div>
              <h1 className="text-xl font-bold">Centre Agent Console — केंद्र एजेंट</h1>
              <p className="text-[#93c5fd] text-xs">KishanSetu Procurement Management Portal</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white border border-[#c0d0e2] rounded-lg shadow-sm w-full max-w-md">
            <div className="bg-[#0e2247] text-white px-6 py-5 rounded-t-lg">
              <div className="text-3xl mb-2">🔐</div>
              <h2 className="text-lg font-bold">Centre Agent Login</h2>
              <p className="text-[#93c5fd] text-sm">Authorized access only</p>
            </div>
            <div className="p-6">
              {/* Demo credentials */}
              <div className="bg-[#fef3c7] border border-[#fcd34d] rounded-lg p-3 mb-5 text-xs">
                <p className="font-semibold text-[#92400e] mb-1">⚠ Demo Credentials</p>
                <p className="text-[#92400e]">Centre ID: <span className="font-bold mono">CTR-024</span></p>
                <p className="text-[#92400e]">Agent ID: <span className="font-bold mono">AGT-024-01</span></p>
                <p className="text-[#92400e]">Password: <span className="font-bold mono">agent123</span></p>
              </div>
              <div className="mb-4">
                <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Centre ID</label>
                <input value={centreId} onChange={(e) => setCentreId(e.target.value)} className="w-full border border-[#c0d0e2] rounded px-3 py-2.5 text-sm mono focus:outline-none focus:border-[#1a3a6b]" />
              </div>
              <div className="mb-4">
                <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Agent ID</label>
                <input value={agentId} onChange={(e) => setAgentId(e.target.value)} className="w-full border border-[#c0d0e2] rounded px-3 py-2.5 text-sm mono focus:outline-none focus:border-[#1a3a6b]" />
              </div>
              <div className="mb-5">
                <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Password / OTP</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-[#c0d0e2] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b]" />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-[#1a3a6b] text-white font-bold py-3 rounded text-base"
              >
                Login →
              </button>
              <p className="text-center text-xs text-[#4a6080] mt-4">
                Unauthorized access is strictly prohibited and subject to legal action.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#0e2247] text-[#6080a0] text-xs py-3 px-6 text-center">
          Terms of Use · Privacy Policy · Accessibility Statement · Sitemap · Contact Us · RTI
          <span className="mx-2">|</span> Last Updated: 08 September 2026
          <span className="mx-2">|</span> Content Owned by KishanSetu Project Team (SIH 2026 Prototype)
        </footer>
      </div>
    );
  }

  if (screen === "id-check") {
    return (
      <div className="min-h-screen bg-[#eef2f7] flex flex-col">
        <GovHeader title="Agent ID Verification" sub="Login & ID Check — Step 1 of 5" onBack={onBack} />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white border border-[#c0d0e2] rounded-lg shadow-sm w-full max-w-lg p-6 animate-fade">
            <div className="bg-[#e6f4ea] border-2 border-[#a7d9b3] rounded-xl p-5 mb-5 text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-bold text-lg text-[#1a6b2e]">🟢 Authorized</p>
              <p className="text-sm text-[#2d6a4f] mt-1">Agent successfully verified</p>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { k: "Centre Name", v: centre.name },
                { k: "Centre ID", v: centre.id },
                { k: "Agent Name", v: agent.name },
                { k: "Agent ID", v: agent.id },
                { k: "Authorization Status", v: "🟢 Authorized" },
                { k: "Session Started", v: new Date().toLocaleString("en-IN") },
              ].map((r) => (
                <div key={r.k} className="flex justify-between items-center border-b border-[#e0e8f0] pb-3 last:border-0 last:pb-0">
                  <span className="text-sm text-[#4a6080]">{r.k}:</span>
                  <span className="font-semibold text-sm mono text-[#1a2332]">{r.v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setScreen("dashboard")} className="w-full bg-[#1a3a6b] text-white font-bold py-3 rounded text-base">
              Proceed to Dashboard →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Wrap remaining screens in sidebar layout
  return (
    <div className="min-h-screen flex flex-col">
      <GovHeader
        title="Centre Agent Console"
        sub={`${centre.name} — ${agent.name}`}
        onBack={onBack}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar screen={screen} setScreen={setScreen} />

        <main className="flex-1 overflow-auto bg-[#eef2f7]">
          {/* Dashboard */}
          {screen === "dashboard" && (
            <div className="p-6 animate-fade">
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-bold text-[#1a2332]">Dashboard — Price & Capacity</h2>
                  <span className="text-xs bg-[#fef3c7] border border-[#fcd34d] text-[#92400e] px-2 py-1 rounded font-semibold">⚠ DEMO DATA</span>
                </div>
                <p className="text-sm text-[#4a6080]">Today: 08 September 2026 · {centre.name}</p>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Daily Capacity", value: `${centre.dailyCapacityQ.toLocaleString("en-IN")} Q`, sub: "Quintal limit", color: "text-[#1a3a6b]" },
                  { label: "Booked Today", value: `${centre.bookedQ.toLocaleString("en-IN")} Q`, sub: "Scheduled quantity", color: "text-[#d4500a]" },
                  { label: "Remaining", value: `${(centre.dailyCapacityQ - centre.bookedQ).toLocaleString("en-IN")} Q`, sub: "Available capacity", color: "text-[#1a6b2e]" },
                  { label: "Pending Requests", value: `${pendingBookings.length}`, sub: "Awaiting decision", color: "text-[#b45309]" },
                ].map((k) => (
                  <div key={k.label} className="bg-white border border-[#c0d0e2] rounded-lg p-4 shadow-sm">
                    <p className="text-xs text-[#4a6080] font-semibold uppercase tracking-wide mb-1">{k.label}</p>
                    <p className={`text-2xl font-bold mono ${k.color}`}>{k.value}</p>
                    <p className="text-xs text-[#4a6080] mt-1">{k.sub}</p>
                  </div>
                ))}
              </div>

              {/* Capacity bar */}
              <div className="bg-white border border-[#c0d0e2] rounded-lg p-5 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-[#1a2332]">Capacity Utilization</h3>
                  <span className="text-sm font-bold text-[#1a3a6b]">{Math.round((centre.bookedQ / centre.dailyCapacityQ) * 100)}%</span>
                </div>
                <div className="h-5 bg-[#e0e8f0] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(centre.bookedQ / centre.dailyCapacityQ) * 100}%`,
                      background: "linear-gradient(90deg, #1a3a6b, #2a5298)",
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#4a6080]">
                  <span>{centre.bookedQ}Q booked</span>
                  <span>{centre.dailyCapacityQ - centre.bookedQ}Q remaining</span>
                  <span>{centre.dailyCapacityQ}Q total</span>
                </div>
              </div>

              {/* MSP prices */}
              <div className="bg-white border border-[#c0d0e2] rounded-lg p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#1a2332]">MSP Prices — {centre.crops.join(", ")}</h3>
                  <span className="text-[10px] text-[#d4500a] font-semibold border border-[#fca5a5] px-2 py-0.5 rounded">⚠ DEMO PRICE</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {state.cropPrices.filter(cp => centre.crops.includes(cp.crop)).map((cp) => (
                    <div key={cp.crop} className="border border-[#e0e8f0] rounded-lg p-3">
                      <p className="text-sm font-bold text-[#1a2332]">{cp.crop}</p>
                      <p className="text-xl font-bold text-[#1a3a6b] mono">₹{cp.mspPerQ.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-[#4a6080]">per Quintal · {cp.season}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#4a6080] mt-3 italic">
                  CACP/Agmarknet integration-ready. Every price modification creates an audit log.
                </p>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Manage Queue", icon: "📋", action: () => setScreen("queue") },
                  { label: "QR Scanner", icon: "📱", action: () => setScreen("qr-scanner") },
                  { label: "Audit Export", icon: "📤", action: () => setScreen("audit-export") },
                ].map((a) => (
                  <button key={a.label} onClick={a.action} className="bg-white border border-[#c0d0e2] rounded-lg p-4 hover:border-[#1a3a6b] hover:bg-[#e8eef8] transition-colors text-center">
                    <div className="text-2xl mb-2">{a.icon}</div>
                    <p className="text-sm font-semibold text-[#1a3a6b]">{a.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Queue / Booking Requests */}
          {screen === "queue" && (
            <div className="p-6 animate-fade">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-[#1a2332]">Manage Queue — Booking Requests</h2>
                  <p className="text-sm text-[#4a6080]">{pendingBookings.length} pending · {acceptedBookings.length} accepted · {completedBookings.length} completed</p>
                </div>
              </div>

              {/* Pending requests */}
              {pendingBookings.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-[#b45309] text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                    🟡 Pending Requests ({pendingBookings.length})
                  </h3>
                  {pendingBookings.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      onAccept={() => handleAccept(b.id)}
                      onReject={() => { setSelectedBookingId(b.id); setActionMode("reject"); }}
                      onReschedule={() => { setSelectedBookingId(b.id); setActionMode("reschedule"); }}
                      onView={() => { setSelectedBookingId(b.id); setScreen("booking-detail"); }}
                    />
                  ))}
                </div>
              )}

              {/* Reject dialog */}
              {actionMode === "reject" && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
                    <h3 className="font-bold text-base text-[#b91c1c] mb-1">Reject Booking</h3>
                    <p className="text-sm text-[#4a6080] mb-4 mono">{selectedBooking.id} — {selectedBooking.farmerName}</p>
                    <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">
                      Rejection Reason (required)
                    </label>
                    <select
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full border border-[#c0d0e2] rounded px-3 py-2.5 text-sm mb-4 focus:outline-none focus:border-[#1a3a6b]"
                    >
                      <option value="">-- Select Reason --</option>
                      <option>Centre capacity exceeded for the requested date</option>
                      <option>Requested crop not accepted at this centre</option>
                      <option>Quantity exceeds daily farmer limit</option>
                      <option>KYC verification incomplete</option>
                      <option>Duplicate booking detected</option>
                    </select>
                    <div className="flex gap-3">
                      <button onClick={() => setActionMode(null)} className="flex-1 border border-[#c0d0e2] text-[#4a6080] py-2.5 rounded font-medium text-sm">Cancel</button>
                      <button
                        onClick={() => selectedBooking && handleReject(selectedBooking.id)}
                        disabled={!rejectReason}
                        className={`flex-1 font-bold py-2.5 rounded text-sm ${rejectReason ? "bg-[#b91c1c] text-white" : "bg-[#c0d0e2] text-[#4a6080] cursor-not-allowed"}`}
                      >
                        Confirm Reject
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reschedule dialog */}
              {actionMode === "reschedule" && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
                    <h3 className="font-bold text-base text-[#6d28d9] mb-1">Reschedule Booking</h3>
                    <p className="text-sm text-[#4a6080] mb-4 mono">{selectedBooking.id} — {selectedBooking.farmerName}</p>
                    <div className="mb-3">
                      <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">New Date</label>
                      <select value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="w-full border border-[#c0d0e2] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b]">
                        {["13 September 2026", "14 September 2026", "15 September 2026", "16 September 2026"].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">New Slot</label>
                      <select value={rescheduleSlot} onChange={(e) => setRescheduleSlot(e.target.value)} className="w-full border border-[#c0d0e2] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b]">
                        {["09:00 – 10:00", "10:00 – 11:00", "12:00 – 13:00", "14:00 – 15:00"].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Reason (required)</label>
                      <input value={rescheduleReason} onChange={(e) => setRescheduleReason(e.target.value)} className="w-full border border-[#c0d0e2] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b]" placeholder="Reason for rescheduling..." />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setActionMode(null)} className="flex-1 border border-[#c0d0e2] text-[#4a6080] py-2.5 rounded font-medium text-sm">Cancel</button>
                      <button
                        onClick={() => selectedBooking && handleReschedule(selectedBooking.id)}
                        disabled={!rescheduleReason}
                        className={`flex-1 font-bold py-2.5 rounded text-sm ${rescheduleReason ? "bg-[#6d28d9] text-white" : "bg-[#c0d0e2] text-[#4a6080] cursor-not-allowed"}`}
                      >
                        Confirm Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Accepted */}
              {acceptedBookings.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-[#1a6b2e] text-sm uppercase tracking-wide mb-3">
                    🟢 Accepted — In Queue ({acceptedBookings.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="gov-table">
                      <thead>
                        <tr>
                          <th>Booking ID</th>
                          <th>Farmer</th>
                          <th>Crop</th>
                          <th>Quantity</th>
                          <th>Slot</th>
                          <th>Queue #</th>
                          <th>KYC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {acceptedBookings.map((b) => (
                          <tr key={b.id}>
                            <td className="mono text-xs font-bold text-[#1a3a6b]">{b.id}</td>
                            <td className="font-medium">{b.farmerName}</td>
                            <td>{b.crop}</td>
                            <td>{b.quantity}Q</td>
                            <td>{b.slot}</td>
                            <td className="mono font-bold">#{b.queuePosition ?? "—"}</td>
                            <td>{b.kycVerified ? <span className="text-[#1a6b2e] font-semibold">✓ Verified</span> : <span className="text-[#b45309]">⚠ Pending</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {pendingBookings.length === 0 && acceptedBookings.length === 0 && (
                <div className="text-center py-12 text-[#4a6080]">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="font-semibold">No pending requests</p>
                </div>
              )}
            </div>
          )}

          {/* Booking Detail */}
          {screen === "booking-detail" && selectedBooking && (
            <div className="p-6 animate-slide max-w-2xl">
              <button onClick={() => setScreen("queue")} className="text-sm text-[#1a3a6b] font-semibold mb-4 flex items-center gap-1">
                ← Back to Queue
              </button>
              <h2 className="text-xl font-bold text-[#1a2332] mb-5">Booking Detail</h2>
              <div className="bg-white border border-[#c0d0e2] rounded-lg p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="mono font-bold text-[#1a3a6b] text-lg">{selectedBooking.id}</span>
                  <StatusBadge status={selectedBooking.status} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { k: "Farmer Name", v: selectedBooking.farmerName },
                    { k: "Farmer ID", v: state.farmers.find(f => f.id === selectedBooking.farmerId)?.farmerId ?? "—" },
                    { k: "Crop", v: selectedBooking.crop },
                    { k: "Quantity", v: `${selectedBooking.quantity} Quintal` },
                    { k: "Date", v: selectedBooking.date },
                    { k: "Slot", v: selectedBooking.slot },
                    { k: "KYC Status", v: selectedBooking.kycVerified ? "✓ KYC Verified" : "⚠ KYC Pending" },
                    { k: "Aadhaar", v: state.farmers.find(f => f.id === selectedBooking.farmerId)?.aadhaarMasked ?? "—" },
                  ].map((r) => (
                    <div key={r.k}>
                      <p className="text-xs text-[#4a6080] font-semibold">{r.k}</p>
                      <p className="font-medium text-[#1a2332] mono">{r.v}</p>
                    </div>
                  ))}
                </div>
              </div>
              {selectedBooking.status === "pending" && (
                <div className="flex gap-3">
                  <button onClick={() => handleAccept(selectedBooking.id)} className="flex-1 bg-[#1a6b2e] text-white font-bold py-3 rounded">✓ Accept</button>
                  <button onClick={() => setActionMode("reject")} className="flex-1 bg-[#b91c1c] text-white font-bold py-3 rounded">✗ Reject</button>
                  <button onClick={() => setActionMode("reschedule")} className="flex-1 bg-[#6d28d9] text-white font-bold py-3 rounded">↻ Reschedule</button>
                </div>
              )}
            </div>
          )}

          {/* QR Scanner */}
          {screen === "qr-scanner" && (
            <div className="p-6 animate-fade max-w-2xl">
              <h2 className="text-xl font-bold text-[#1a2332] mb-2">QR Scanner — Farmer Arrival</h2>
              <p className="text-sm text-[#4a6080] mb-5">Scan farmer's booking QR code to retrieve booking details</p>
              {!scanned ? (
                <div className="bg-white border border-[#c0d0e2] rounded-lg p-6 text-center">
                  <div className="w-56 h-56 border-4 border-dashed border-[#1a3a6b] rounded-xl mx-auto mb-5 flex items-center justify-center bg-[#eef2f7]">
                    <div className="text-center">
                      <div className="text-5xl mb-2">📷</div>
                      <p className="text-sm text-[#4a6080]">Camera viewfinder</p>
                      <p className="text-xs text-[#4a6080]">Point at QR code</p>
                    </div>
                  </div>
                  <button onClick={() => setScanned(true)} className="bg-[#1a3a6b] text-white font-bold px-8 py-3 rounded text-sm mb-3">
                    Simulate QR Scan — KS-2026-001284
                  </button>
                  <p className="text-xs text-[#4a6080]">Or enter booking ID manually:</p>
                  <div className="flex gap-2 mt-2 max-w-xs mx-auto">
                    <input className="flex-1 border border-[#c0d0e2] rounded px-3 py-2 text-sm mono" placeholder="KS-YYYY-XXXXXX" />
                    <button onClick={() => setScanned(true)} className="bg-[#d4500a] text-white font-semibold px-4 py-2 rounded text-sm">Search</button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#e6f4ea] border-2 border-[#a7d9b3] rounded-lg p-5 animate-fade">
                  <p className="font-bold text-[#1a6b2e] mb-3">✓ Booking Retrieved Successfully</p>
                  <div className="bg-white rounded-lg p-4 text-sm space-y-2 mb-4">
                    {[
                      { k: "Booking ID", v: "KS-2026-001284" },
                      { k: "Farmer", v: "Ramesh Kumar" },
                      { k: "Aadhaar", v: "XXXX XXXX 4582" },
                      { k: "Crop", v: "Wheat" },
                      { k: "Quantity", v: "50 Quintal" },
                      { k: "Slot", v: "10:00 – 11:00" },
                      { k: "KYC Status", v: "✓ Verified" },
                    ].map((r) => (
                      <div key={r.k} className="flex justify-between border-b border-[#e0e8f0] pb-2 last:border-0 last:pb-0">
                        <span className="text-[#4a6080]">{r.k}:</span>
                        <span className="font-semibold mono">{r.v}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setScreen("weighment")} className="w-full bg-[#1a3a6b] text-white font-bold py-3 rounded">
                    Proceed to Weighment →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Weighment */}
          {screen === "weighment" && (
            <div className="p-6 animate-slide max-w-2xl">
              <button onClick={() => setScreen("qr-scanner")} className="text-sm text-[#1a3a6b] font-semibold mb-4">← Back to Scanner</button>
              <h2 className="text-xl font-bold text-[#1a2332] mb-5">Weighment — KS-2026-001284</h2>
              <div className="bg-white border border-[#c0d0e2] rounded-lg p-5 mb-4">
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-[#e8eef8] rounded-lg p-3">
                    <p className="text-xs text-[#4a6080] font-semibold">Scheduled Quantity</p>
                    <p className="text-2xl font-bold mono text-[#1a3a6b]">50 Q</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Actual Quantity (Q)</label>
                    <input
                      value={weighment.actualQty}
                      onChange={(e) => setWeighment(w => ({ ...w, actualQty: e.target.value }))}
                      type="number"
                      step="0.1"
                      className="w-full border border-[#c0d0e2] rounded px-3 py-2.5 text-sm mono focus:outline-none focus:border-[#1a3a6b]"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Quality Grade</label>
                  <div className="flex gap-3">
                    {["A", "B", "C"].map(g => (
                      <button
                        key={g}
                        onClick={() => setWeighment(w => ({ ...w, qualityGrade: g }))}
                        className={`flex-1 py-3 rounded-lg font-bold text-lg border-2 transition-colors ${weighment.qualityGrade === g ? "border-[#1a3a6b] bg-[#1a3a6b] text-white" : "border-[#c0d0e2] bg-white text-[#1a2332] hover:border-[#1a3a6b]"}`}
                      >
                        Grade {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Quality Deduction (₹)</label>
                    <input value={weighment.qualityDeduction} onChange={(e) => setWeighment(w => ({ ...w, qualityDeduction: e.target.value }))} type="number" className="w-full border border-[#c0d0e2] rounded px-3 py-2.5 text-sm mono focus:outline-none focus:border-[#1a3a6b]" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Other Deduction (₹)</label>
                    <input value={weighment.otherDeduction} onChange={(e) => setWeighment(w => ({ ...w, otherDeduction: e.target.value }))} type="number" className="w-full border border-[#c0d0e2] rounded px-3 py-2.5 text-sm mono focus:outline-none focus:border-[#1a3a6b]" />
                  </div>
                </div>
              </div>
              <button onClick={() => setScreen("transaction")} className="w-full bg-[#d4500a] text-white font-bold py-3 rounded text-base">
                Calculate Transaction →
              </button>
            </div>
          )}

          {/* Transaction Closing */}
          {screen === "transaction" && (
            <div className="p-6 animate-fade max-w-2xl">
              <h2 className="text-xl font-bold text-[#1a2332] mb-5">Transaction Closing — Bill Generation</h2>
              {txnCreated ? (
                <div className="bg-[#e6f4ea] border-2 border-[#a7d9b3] rounded-lg p-5 animate-fade text-center">
                  <div className="text-4xl mb-2">🧾</div>
                  <p className="font-bold text-lg text-[#1a6b2e]">Transaction Complete!</p>
                  <p className="text-sm text-[#2d6a4f] mt-1">Bill generated — Farmer will receive notification</p>
                  <p className="text-xs text-[#2d6a4f] mt-1">Payment initiated via PFMS/DBT</p>
                  <button onClick={() => setScreen("audit-export")} className="mt-4 bg-[#1a3a6b] text-white font-bold px-6 py-2.5 rounded text-sm">
                    View Audit Export →
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white border border-[#c0d0e2] rounded-lg overflow-hidden mb-4">
                    <div className="bg-[#1a3a6b] text-white px-5 py-3">
                      <p className="font-bold text-sm">KishanSetu — Digital Procurement Receipt</p>
                      <p className="text-[#93c5fd] text-xs mono">KS-2026-001284 · {new Date().toLocaleDateString("en-IN")}</p>
                    </div>
                    <div className="p-5 space-y-2 text-sm">
                      {(() => {
                        const price = 2585;
                        const actual = parseFloat(weighment.actualQty) || 48.5;
                        const gross = actual * price;
                        const qDed = parseFloat(weighment.qualityDeduction) || 2500;
                        const oDed = parseFloat(weighment.otherDeduction) || 0;
                        const net = gross - qDed - oDed;
                        return (
                          <>
                            {[
                              { k: "Farmer", v: "Ramesh Kumar (F001)" },
                              { k: "Centre", v: "Burdwan Government Wheat Procurement Centre" },
                              { k: "Crop", v: "Wheat" },
                              { k: "Scheduled Qty", v: "50 Q" },
                              { k: "Actual Qty", v: `${actual} Q` },
                              { k: "Quality Grade", v: `Grade ${weighment.qualityGrade}` },
                              { k: "Price (MSP)", v: `₹${price.toLocaleString("en-IN")}/Q` },
                            ].map((r) => (
                              <div key={r.k} className="flex justify-between border-b border-[#e0e8f0] pb-2">
                                <span className="text-[#4a6080]">{r.k}:</span>
                                <span className="font-semibold mono">{r.v}</span>
                              </div>
                            ))}
                            <div className="border-t-2 border-[#c0d0e2] pt-3 space-y-1.5">
                              <div className="flex justify-between">
                                <span className="text-[#4a6080]">{actual}Q × ₹{price.toLocaleString("en-IN")} (Gross):</span>
                                <span className="font-semibold">{formatINR(gross)}</span>
                              </div>
                              <div className="flex justify-between text-[#b91c1c]">
                                <span>Quality Deduction:</span>
                                <span className="font-semibold">− {formatINR(qDed)}</span>
                              </div>
                              {oDed > 0 && (
                                <div className="flex justify-between text-[#b91c1c]">
                                  <span>Other Deductions:</span>
                                  <span className="font-semibold">− {formatINR(oDed)}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-base font-bold pt-2 border-t border-[#e0e8f0]">
                                <span className="text-[#1a2332]">NET PAYABLE:</span>
                                <span className="text-[#1a6b2e] text-xl">{formatINR(net)}</span>
                              </div>
                            </div>
                            <p className="text-[10px] text-[#4a6080] mt-2 italic text-center">
                              All calculations performed by FastAPI backend. PFMS/DBT integration-ready.
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <button onClick={handleTransaction} className="w-full bg-[#1a6b2e] text-white font-bold py-3 rounded text-base">
                    ✓ Confirm & Generate Bill →
                  </button>
                </>
              )}
            </div>
          )}

          {/* Audit Export */}
          {screen === "audit-export" && (
            <div className="p-6 animate-fade">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-[#1a2332]">Audit Export</h2>
                  <p className="text-sm text-[#4a6080]">Immutable transaction audit trail — all actions logged</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-[#1a6b2e] text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1">
                    📥 Export CSV
                  </button>
                  <button className="bg-[#1a3a6b] text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1">
                    📊 Export Excel
                  </button>
                  <button className="bg-[#d4500a] text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1">
                    📄 PDF Report
                  </button>
                </div>
              </div>
              <div className="bg-white border border-[#c0d0e2] rounded-lg overflow-hidden mb-4">
                <div className="overflow-x-auto">
                  <table className="gov-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Booking ID</th>
                        <th>Farmer</th>
                        <th>Crop</th>
                        <th>Actual Qty</th>
                        <th>Price/Q</th>
                        <th>Gross</th>
                        <th>Deductions</th>
                        <th>Net Payable</th>
                        <th>Payment</th>
                        <th>Agent</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.transactions.map((t) => (
                        <tr key={t.id}>
                          <td className="mono text-xs font-bold text-[#1a3a6b]">{t.id}</td>
                          <td className="mono text-xs">{t.bookingId}</td>
                          <td className="font-medium">{t.farmerName}</td>
                          <td>{t.crop}</td>
                          <td className="mono">{t.actualQty}Q</td>
                          <td className="mono">₹{t.pricePerQ.toLocaleString("en-IN")}</td>
                          <td className="mono">{formatINR(t.grossAmount)}</td>
                          <td className="mono text-[#b91c1c]">{formatINR(t.qualityDeduction + t.otherDeduction)}</td>
                          <td className="mono font-bold text-[#1a6b2e]">{formatINR(t.netAmount)}</td>
                          <td>
                            <span className={`text-xs font-semibold ${t.paymentStatus === "credited" ? "text-[#1a6b2e]" : t.paymentStatus === "failed" ? "text-[#b91c1c]" : "text-[#b45309]"}`}>
                              {t.paymentStatus === "credited" ? "🟢 Credited" : t.paymentStatus === "failed" ? "🔴 Failed" : "🟡 Processing"}
                            </span>
                          </td>
                          <td className="mono text-xs">{t.agentId}</td>
                          <td className="text-xs text-[#4a6080]">{new Date(t.createdAt).toLocaleDateString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-[#e8eef8] border border-[#93c5fd] rounded-lg p-4 text-xs text-[#1a3a6b]">
                <p className="font-semibold mb-1">Audit Trail Information</p>
                <p>Every action (accept/reject/reschedule/weighment/payment) is immutably logged with timestamp, agent ID, and IP address. PostgreSQL audit_logs table maintains full history. PFMS/DBT references included for payment verification.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#0e2247] text-[#6080a0] text-xs py-2.5 px-6 flex items-center justify-between shrink-0">
        <span>Terms of Use · Privacy Policy · Accessibility Statement · Sitemap · Contact Us · RTI</span>
        <span>Last Updated: 08 September 2026 · KishanSetu Project Team (SIH 2026 Prototype)</span>
      </footer>
    </div>
  );
}

function BookingCard({
  booking,
  onAccept,
  onReject,
  onReschedule,
  onView,
}: {
  booking: Booking;
  onAccept: () => void;
  onReject: () => void;
  onReschedule: () => void;
  onView: () => void;
}) {
  return (
    <div className="bg-white border border-[#c0d0e2] rounded-lg p-4 mb-3 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="mono font-bold text-[#1a3a6b] text-sm">{booking.id}</p>
          <p className="font-semibold text-[#1a2332]">{booking.farmerName}</p>
          <p className="text-xs text-[#4a6080] mt-0.5">
            {booking.crop} — {booking.quantity}Q · {booking.date} · {booking.slot}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${booking.kycVerified ? "bg-[#e6f4ea] text-[#1a6b2e]" : "bg-[#fef3c7] text-[#b45309]"}`}>
            {booking.kycVerified ? "✓ KYC Verified" : "⚠ KYC Pending"}
          </span>
          <span className="badge-pending text-[10px] font-semibold px-2 py-0.5 rounded-full">🟡 Pending</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onAccept} className="flex-1 bg-[#1a6b2e] text-white font-semibold py-2 rounded text-xs">✓ Accept</button>
        <button onClick={onReject} className="flex-1 bg-[#b91c1c] text-white font-semibold py-2 rounded text-xs">✗ Reject</button>
        <button onClick={onReschedule} className="flex-1 bg-[#6d28d9] text-white font-semibold py-2 rounded text-xs">↻ Reschedule</button>
        <button onClick={onView} className="flex-1 bg-[#e8eef8] text-[#1a3a6b] font-semibold py-2 rounded text-xs border border-[#93c5fd]">Detail</button>
      </div>
    </div>
  );
}
