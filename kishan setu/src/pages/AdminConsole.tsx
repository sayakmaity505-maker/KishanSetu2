import { useState } from "react";
import { useStore, formatINR } from "../store";

type Screen = "login" | "dashboard" | "farmers" | "bookings" | "analytics" | "audit-logs" | "grievances";

interface Props {
  onBack: () => void;
}

function MiniBar({ value, max, color = "#1a3a6b" }: { value: number; max: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-[#e0e8f0] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold mono text-[#4a6080] w-12 text-right">{value.toLocaleString("en-IN")}</span>
    </div>
  );
}

export default function AdminConsole({ onBack }: Props) {
  const { state } = useStore();
  const [screen, setScreen] = useState<Screen>("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("demo123");
  const [grievanceFilter, setGrievanceFilter] = useState("all");

  const totalFarmers = state.farmers.length;
  const activeCentres = state.centres.length;
  const todayBookings = state.bookings.filter(b => b.createdAt.startsWith("2026-09-08")).length;
  const pendingRequests = state.bookings.filter(b => b.status === "pending").length;
  const completedTxns = state.transactions.length;
  const totalProcurement = state.transactions.reduce((s, t) => s + t.actualQty, 0);
  const totalValue = state.transactions.reduce((s, t) => s + t.netAmount, 0);
  const pendingPayments = state.transactions.filter(t => t.paymentStatus === "processing").length;

  const kycVerified = state.farmers.filter(f => f.kycStatus === "verified").length;
  const cropData = [
    { crop: "Wheat", qty: 123.5, value: 319397.5, centres: 2 },
    { crop: "Rice (Common)", qty: 44, value: 101200, centres: 1 },
    { crop: "Paddy", qty: 0, value: 0, centres: 1 },
    { crop: "Maize", qty: 0, value: 0, centres: 1 },
    { crop: "Gram", qty: 0, value: 0, centres: 1 },
  ];

  const centreData = state.centres.map(c => ({
    ...c,
    utilization: Math.round((c.bookedQ / c.dailyCapacityQ) * 100),
    transactions: state.transactions.filter(t => t.centreId === c.id).length,
  }));

  const handleLogin = () => {
    setLoggedIn(true);
    setScreen("dashboard");
  };

  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "farmers", icon: "👨‍🌾", label: "Farmers" },
    { id: "bookings", icon: "📅", label: "Bookings" },
    { id: "analytics", icon: "📈", label: "Analytics" },
    { id: "grievances", icon: "📋", label: "Grievances" },
    { id: "audit-logs", icon: "🔍", label: "Audit Logs" },
  ];

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#eef2f7] flex flex-col">
        <div className="bg-[#1a3a6b] text-white">
          <div className="utility-bar py-1 px-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center text-[10.5px] text-[#4a3f2f]">
              <div className="flex gap-3">
                <span>Skip to Content</span><span className="text-[#c0b090]">|</span>
                <span>Screen Reader Access</span>
              </div>
              <div>
                <button className="text-[#1a3a6b] font-semibold">हिंदी</button>
                <span className="text-[#c0b090] mx-1">/</span>
                <button className="text-[#1a3a6b] font-semibold underline">English</button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
            <button onClick={onBack} className="text-white/70 text-sm border border-white/30 px-3 py-1.5 rounded">← Home</button>
            <div>
              <h1 className="text-xl font-bold">Admin & Audit Console</h1>
              <p className="text-[#93c5fd] text-xs">KishanSetu Platform Administration</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white border border-[#c0d0e2] rounded-lg shadow-sm w-full max-w-md">
            <div className="bg-[#6d28d9] text-white px-6 py-5 rounded-t-lg">
              <div className="text-3xl mb-2">📊</div>
              <h2 className="text-lg font-bold">Admin Login</h2>
              <p className="text-purple-200 text-sm">Government Auditor / Platform Admin</p>
            </div>
            <div className="p-6">
              <div className="bg-[#fef3c7] border border-[#fcd34d] rounded-lg p-3 mb-5 text-xs">
                <p className="font-semibold text-[#92400e] mb-1">⚠ Demo Credentials</p>
                <p className="text-[#92400e]">Username: <span className="font-bold mono">admin</span></p>
                <p className="text-[#92400e]">Password: <span className="font-bold mono">demo123</span></p>
              </div>
              <div className="mb-4">
                <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-[#c0d0e2] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#6d28d9]" />
              </div>
              <div className="mb-5">
                <label className="text-xs font-semibold text-[#4a6080] uppercase tracking-wide mb-1.5 block">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-[#c0d0e2] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#6d28d9]" />
              </div>
              <button onClick={handleLogin} className="w-full bg-[#6d28d9] text-white font-bold py-3 rounded text-base">
                Login as Admin →
              </button>
            </div>
          </div>
        </div>
        <footer className="bg-[#0e2247] text-[#6080a0] text-xs py-2.5 px-6 text-center">
          Terms of Use · Privacy Policy · Accessibility Statement · Contact Us · RTI | Last Updated: 08 September 2026
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#1a3a6b] text-white shrink-0">
        <div className="utility-bar py-1 px-6">
          <div className="max-w-full flex justify-between items-center text-[10.5px] text-[#4a3f2f]">
            <div className="flex gap-3">
              <span>Skip to Content</span><span className="text-[#c0b090]">|</span>
              <span>Screen Reader Access</span>
            </div>
            <div>
              <button className="text-[#1a3a6b] font-semibold">हिंदी</button>
              <span className="text-[#c0b090] mx-1">/</span>
              <button className="text-[#1a3a6b] font-semibold underline">English</button>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 flex items-center gap-4">
          <button onClick={onBack} className="text-white/70 hover:text-white text-sm border border-white/30 px-3 py-1.5 rounded transition-colors">← Home</button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <div>
              <h1 className="text-lg font-bold">KishanSetu Admin & Audit Console</h1>
              <p className="text-[#93c5fd] text-xs">Platform Administration · Government Auditor</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs bg-white/10 border border-white/20 px-2 py-1 rounded">Admin User</span>
            <span className="text-[#f5c842] text-xs font-semibold">⚠ SIH 2026 Demo</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-48 bg-[#0e2247] text-white flex flex-col shrink-0">
          <nav className="flex-1 py-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setScreen(item.id as Screen)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${
                  screen === item.id
                    ? "bg-[#6d28d9] text-white border-r-2 border-[#d4500a]"
                    : "text-[#93c5fd] hover:bg-[#1a3a6b] hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-[#2a5298]/40">
            <p className="text-[10px] text-[#4a6080]">West Bengal · SIH 2026</p>
            <button
              className="text-[10px] text-[#d4500a] mt-1 hover:underline"
              onClick={() => { setLoggedIn(false); setScreen("login"); }}
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-[#eef2f7]">

          {/* Dashboard */}
          {screen === "dashboard" && (
            <div className="p-6 animate-fade">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-[#1a2332]">Platform Dashboard</h2>
                  <p className="text-sm text-[#4a6080]">08 September 2026 · Real-time overview ⚠ DEMO DATA</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-[#1a6b2e] text-white text-xs font-semibold px-3 py-2 rounded">📥 Export Report</button>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Farmers", value: totalFarmers, sub: `${kycVerified} KYC Verified`, color: "text-[#1a3a6b]", icon: "👨‍🌾" },
                  { label: "Active Centres", value: activeCentres, sub: "Across West Bengal", color: "text-[#6d28d9]", icon: "🏢" },
                  { label: "Today's Bookings", value: todayBookings, sub: "08 September 2026", color: "text-[#d4500a]", icon: "📅" },
                  { label: "Pending Requests", value: pendingRequests, sub: "Awaiting centre decision", color: "text-[#b45309]", icon: "⏳" },
                  { label: "Completed Transactions", value: completedTxns, sub: "Bills generated", color: "text-[#1a6b2e]", icon: "✅" },
                  { label: "Total Procurement", value: `${totalProcurement.toFixed(1)}Q`, sub: "Quintal this season", color: "text-[#1a3a6b]", icon: "⚖️" },
                  { label: "Total Value", value: formatINR(totalValue), sub: "Net DBT amount", color: "text-[#1a6b2e]", icon: "💰" },
                  { label: "Pending Payments", value: pendingPayments, sub: "Processing via PFMS", color: "text-[#b45309]", icon: "💳" },
                ].map((k) => (
                  <div key={k.label} className="bg-white border border-[#c0d0e2] rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{k.icon}</span>
                      <p className="text-xs text-[#4a6080] font-semibold uppercase tracking-wide">{k.label}</p>
                    </div>
                    <p className={`text-2xl font-bold mono ${k.color}`}>{k.value}</p>
                    <p className="text-xs text-[#4a6080] mt-1">{k.sub}</p>
                  </div>
                ))}
              </div>

              {/* Booking status breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                <div className="bg-white border border-[#c0d0e2] rounded-lg p-5">
                  <h3 className="font-semibold text-[#1a2332] mb-4">Booking Status Breakdown</h3>
                  {[
                    { label: "Pending", value: state.bookings.filter(b => b.status === "pending").length, color: "#d97706" },
                    { label: "Accepted", value: state.bookings.filter(b => b.status === "accepted").length, color: "#1a6b2e" },
                    { label: "Completed", value: state.bookings.filter(b => b.status === "completed").length, color: "#1a3a6b" },
                    { label: "Rejected", value: state.bookings.filter(b => b.status === "rejected").length, color: "#b91c1c" },
                    { label: "Rescheduled", value: state.bookings.filter(b => b.status === "rescheduled").length, color: "#6d28d9" },
                  ].map((s) => (
                    <div key={s.label} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-[#1a2332]">{s.label}</span>
                        <span className="mono font-bold" style={{ color: s.color }}>{s.value}</span>
                      </div>
                      <MiniBar value={s.value} max={state.bookings.length || 1} color={s.color} />
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-[#c0d0e2] rounded-lg p-5">
                  <h3 className="font-semibold text-[#1a2332] mb-4">Centre Capacity Utilization</h3>
                  {centreData.map((c) => (
                    <div key={c.id} className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-[#1a2332] truncate pr-2" title={c.name}>{c.id} — {c.name.split(" ").slice(0, 3).join(" ")}...</span>
                        <span className="mono font-bold text-[#1a3a6b]">{c.utilization}%</span>
                      </div>
                      <div className="h-2.5 bg-[#e0e8f0] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${c.utilization}%`,
                            background: c.utilization > 80 ? "#b91c1c" : c.utilization > 60 ? "#d97706" : "#1a6b2e"
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-[#4a6080] mt-1">
                        <span>{c.bookedQ}Q booked</span>
                        <span>{c.dailyCapacityQ}Q capacity</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crop-wise procurement */}
              <div className="bg-white border border-[#c0d0e2] rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1a2332]">Crop-wise Procurement</h3>
                  <span className="text-xs text-[#d4500a] font-semibold border border-[#fca5a5] px-2 py-0.5 rounded">⚠ DEMO PRICE</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="gov-table">
                    <thead>
                      <tr>
                        <th>Crop</th>
                        <th>MSP (₹/Q)</th>
                        <th>Procured (Q)</th>
                        <th>Total Value</th>
                        <th>Active Centres</th>
                        <th>% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.cropPrices.map((cp) => {
                        const cdata = cropData.find(c => c.crop === cp.crop)!;
                        const totalQ = cropData.reduce((s, c) => s + c.qty, 0) || 1;
                        return (
                          <tr key={cp.crop}>
                            <td className="font-semibold">{cp.crop}</td>
                            <td className="mono">₹{cp.mspPerQ.toLocaleString("en-IN")}</td>
                            <td className="mono">{cdata?.qty.toFixed(1) ?? 0}</td>
                            <td className="mono">{formatINR(cdata?.value ?? 0)}</td>
                            <td className="mono">{cdata?.centres ?? 0}</td>
                            <td>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-[#e0e8f0] rounded-full overflow-hidden">
                                  <div className="h-full bg-[#1a3a6b] rounded-full" style={{ width: `${((cdata?.qty ?? 0) / totalQ) * 100}%` }} />
                                </div>
                                <span className="text-xs mono text-[#4a6080]">{Math.round(((cdata?.qty ?? 0) / totalQ) * 100)}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Farmers */}
          {screen === "farmers" && (
            <div className="p-6 animate-fade">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#1a2332]">Farmer Management</h2>
                <div className="flex gap-2">
                  <input className="border border-[#c0d0e2] rounded px-3 py-2 text-sm" placeholder="Search farmers..." />
                  <button className="bg-[#d4500a] text-white text-xs font-semibold px-3 py-2 rounded">📥 Export</button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="bg-white border border-[#c0d0e2] rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#1a3a6b]">{totalFarmers}</p>
                  <p className="text-xs text-[#4a6080]">Total Registered</p>
                </div>
                <div className="bg-white border border-[#c0d0e2] rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#1a6b2e]">{kycVerified}</p>
                  <p className="text-xs text-[#4a6080]">KYC Verified</p>
                </div>
                <div className="bg-white border border-[#c0d0e2] rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#b45309]">{totalFarmers - kycVerified}</p>
                  <p className="text-xs text-[#4a6080]">KYC Pending</p>
                </div>
              </div>
              <div className="bg-white border border-[#c0d0e2] rounded-lg overflow-hidden">
                <table className="gov-table">
                  <thead>
                    <tr>
                      <th>Farmer ID</th>
                      <th>Name</th>
                      <th>District</th>
                      <th>Mobile</th>
                      <th>Aadhaar</th>
                      <th>Land (Acres)</th>
                      <th>KYC Status</th>
                      <th>Consent</th>
                      <th>Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.farmers.map((f) => {
                      const bookingCount = state.bookings.filter(b => b.farmerId === f.id).length;
                      return (
                        <tr key={f.id}>
                          <td className="mono text-xs font-bold text-[#1a3a6b]">{f.farmerId}</td>
                          <td className="font-semibold">{f.name}</td>
                          <td>{f.district}</td>
                          <td className="mono">{f.mobile}</td>
                          <td className="mono text-xs">{f.aadhaarMasked}</td>
                          <td className="mono">{f.landAcres}</td>
                          <td>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.kycStatus === "verified" ? "badge-verified" : f.kycStatus === "pending" ? "badge-pending" : "badge-rejected"}`}>
                              {f.kycStatus === "verified" ? "🟢 Verified" : f.kycStatus === "pending" ? "🟡 Pending" : "🔴 Failed"}
                            </span>
                          </td>
                          <td>
                            <span className={`text-xs font-semibold ${f.consentGiven ? "text-[#1a6b2e]" : "text-[#b91c1c]"}`}>
                              {f.consentGiven ? "✓ DPDP Consent" : "✗ No Consent"}
                            </span>
                          </td>
                          <td className="mono text-center">{bookingCount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 bg-[#e8eef8] border border-[#93c5fd] rounded-lg p-3 text-xs text-[#1a3a6b]">
                <p className="font-semibold">Data Privacy (DPDP Act 2023)</p>
                <p className="text-[#4a6080] mt-0.5">Full Aadhaar numbers are never stored or displayed. Bank account numbers masked throughout. Farmers may request data download or deletion from their profile.</p>
              </div>
            </div>
          )}

          {/* Bookings */}
          {screen === "bookings" && (
            <div className="p-6 animate-fade">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#1a2332]">All Bookings</h2>
                <button className="bg-[#d4500a] text-white text-xs font-semibold px-3 py-2 rounded">📥 Export CSV</button>
              </div>
              <div className="bg-white border border-[#c0d0e2] rounded-lg overflow-hidden">
                <table className="gov-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Farmer</th>
                      <th>Centre</th>
                      <th>Crop</th>
                      <th>Qty (Q)</th>
                      <th>Date</th>
                      <th>Slot</th>
                      <th>Status</th>
                      <th>KYC</th>
                      <th>Queue #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.bookings.map((b) => (
                      <tr key={b.id}>
                        <td className="mono text-xs font-bold text-[#1a3a6b]">{b.id}</td>
                        <td className="font-medium">{b.farmerName}</td>
                        <td className="text-xs">{b.centreId}</td>
                        <td>{b.crop}</td>
                        <td className="mono">{b.quantity}</td>
                        <td className="text-xs">{b.date}</td>
                        <td className="text-xs">{b.slot}</td>
                        <td>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            b.status === "accepted" ? "badge-accepted" :
                            b.status === "rejected" ? "badge-rejected" :
                            b.status === "completed" ? "badge-completed" :
                            b.status === "rescheduled" ? "badge-rescheduled" :
                            "badge-pending"
                          }`}>
                            {b.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={b.kycVerified ? "text-[#1a6b2e] font-semibold text-xs" : "text-[#b45309] text-xs"}>
                            {b.kycVerified ? "✓" : "⚠"}
                          </span>
                        </td>
                        <td className="mono text-center">{b.queuePosition ? `#${b.queuePosition}` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics */}
          {screen === "analytics" && (
            <div className="p-6 animate-fade">
              <h2 className="text-xl font-bold text-[#1a2332] mb-5">Platform Analytics</h2>

              {/* Simple bar chart for centre utilization */}
              <div className="bg-white border border-[#c0d0e2] rounded-lg p-5 mb-5">
                <h3 className="font-semibold text-[#1a2332] mb-4">Centre-wise Capacity Utilization (%)</h3>
                <div className="space-y-4">
                  {state.centres.map((c) => {
                    const pct = Math.round((c.bookedQ / c.dailyCapacityQ) * 100);
                    return (
                      <div key={c.id}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium truncate pr-4" title={c.name}>{c.id}: {c.name.split(" ").slice(0,4).join(" ")}...</span>
                          <span className="mono font-bold text-[#1a3a6b]">{pct}%</span>
                        </div>
                        <div className="relative h-6 bg-[#e0e8f0] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
                            style={{
                              width: `${pct}%`,
                              background: pct > 80 ? "linear-gradient(90deg, #b91c1c, #dc2626)" : pct > 60 ? "linear-gradient(90deg, #d97706, #f59e0b)" : "linear-gradient(90deg, #1a6b2e, #15803d)"
                            }}
                          >
                            <span className="text-[10px] text-white font-bold">{c.bookedQ}Q</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* District-wise booking distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                <div className="bg-white border border-[#c0d0e2] rounded-lg p-5">
                  <h3 className="font-semibold text-[#1a2332] mb-4">District-wise Bookings</h3>
                  {[
                    { district: "Burdwan", count: state.bookings.filter(b => state.farmers.find(f => f.id === b.farmerId)?.district === "Burdwan").length, color: "#1a3a6b" },
                    { district: "Hooghly", count: state.bookings.filter(b => state.farmers.find(f => f.id === b.farmerId)?.district === "Hooghly").length, color: "#6d28d9" },
                    { district: "Medinipur", count: state.bookings.filter(b => state.farmers.find(f => f.id === b.farmerId)?.district === "Medinipur").length, color: "#d97706" },
                    { district: "Nadia", count: 0, color: "#1a6b2e" },
                  ].map((d) => (
                    <div key={d.district} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{d.district}</span>
                        <span className="mono font-bold" style={{ color: d.color }}>{d.count} bookings</span>
                      </div>
                      <MiniBar value={d.count} max={state.bookings.length || 1} color={d.color} />
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-[#c0d0e2] rounded-lg p-5">
                  <h3 className="font-semibold text-[#1a2332] mb-4">Payment Status Distribution</h3>
                  {[
                    { label: "Credited", count: state.transactions.filter(t => t.paymentStatus === "credited").length, color: "#1a6b2e" },
                    { label: "Processing", count: state.transactions.filter(t => t.paymentStatus === "processing").length, color: "#d97706" },
                    { label: "Failed", count: state.transactions.filter(t => t.paymentStatus === "failed").length, color: "#b91c1c" },
                  ].map((p) => (
                    <div key={p.label} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{p.label}</span>
                        <span className="mono font-bold" style={{ color: p.color }}>{p.count}</span>
                      </div>
                      <MiniBar value={p.count} max={Math.max(state.transactions.length, 1)} color={p.color} />
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-[#e0e8f0] text-xs text-[#4a6080]">
                    <p>PFMS/DBT integration-ready. Settlement typically T+1 to T+3 banking days.</p>
                  </div>
                </div>
              </div>

              {/* Queue stats */}
              <div className="bg-white border border-[#c0d0e2] rounded-lg p-5">
                <h3 className="font-semibold text-[#1a2332] mb-3">Queue Engine Statistics</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-[#e8eef8] rounded-lg p-3">
                    <p className="text-xl font-bold mono text-[#1a3a6b]">{state.bookings.filter(b => b.status === "accepted").length}</p>
                    <p className="text-xs text-[#4a6080]">Currently in Queue</p>
                  </div>
                  <div className="bg-[#e6f4ea] rounded-lg p-3">
                    <p className="text-xl font-bold mono text-[#1a6b2e]">~35 min</p>
                    <p className="text-xs text-[#4a6080]">Avg. Wait Time</p>
                  </div>
                  <div className="bg-[#fef3c7] rounded-lg p-3">
                    <p className="text-xl font-bold mono text-[#b45309]">98.2%</p>
                    <p className="text-xs text-[#4a6080]">Queue Accuracy</p>
                  </div>
                </div>
                <p className="text-xs text-[#4a6080] mt-3 italic">
                  Queue Engine: Python/FastAPI with row-level locking (PostgreSQL FOR UPDATE). Concurrent booking race conditions handled. Indexed by centre_id + status for O(log n) performance.
                </p>
              </div>
            </div>
          )}

          {/* Grievances */}
          {screen === "grievances" && (
            <div className="p-6 animate-fade">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-[#1a2332]">Grievance Management (CPGRAMS-style)</h2>
                  <p className="text-sm text-[#4a6080]">{state.grievances.length} total grievances</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={grievanceFilter}
                    onChange={(e) => setGrievanceFilter(e.target.value)}
                    className="border border-[#c0d0e2] rounded px-3 py-2 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="registered">Registered</option>
                    <option value="under_review">Under Review</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-5">
                {[
                  { label: "Total", value: state.grievances.length, color: "text-[#1a3a6b]" },
                  { label: "Under Review", value: state.grievances.filter(g => g.status === "under_review").length, color: "text-[#6d28d9]" },
                  { label: "Registered", value: state.grievances.filter(g => g.status === "registered").length, color: "text-[#b45309]" },
                  { label: "Resolved", value: state.grievances.filter(g => g.status === "resolved").length, color: "text-[#1a6b2e]" },
                ].map(k => (
                  <div key={k.label} className="bg-white border border-[#c0d0e2] rounded-lg p-3 text-center">
                    <p className={`text-2xl font-bold mono ${k.color}`}>{k.value}</p>
                    <p className="text-xs text-[#4a6080]">{k.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-[#c0d0e2] rounded-lg overflow-hidden">
                <table className="gov-table">
                  <thead>
                    <tr>
                      <th>Grievance ID</th>
                      <th>Farmer</th>
                      <th>Booking ID</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th>Filed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.grievances
                      .filter(g => grievanceFilter === "all" || g.status === grievanceFilter)
                      .map((g) => (
                        <tr key={g.id}>
                          <td className="mono text-xs font-bold text-[#6d28d9]">{g.id}</td>
                          <td className="font-medium">{g.farmerName}</td>
                          <td className="mono text-xs">{g.bookingId ?? "—"}</td>
                          <td>{g.category}</td>
                          <td className="text-xs max-w-48 truncate">{g.description}</td>
                          <td>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              g.status === "resolved" ? "badge-accepted" :
                              g.status === "under_review" ? "badge-rescheduled" :
                              g.status === "rejected" ? "badge-rejected" : "badge-pending"
                            }`}>
                              {g.status === "registered" ? "🟡 Registered" :
                               g.status === "under_review" ? "🔵 Under Review" :
                               g.status === "resolved" ? "🟢 Resolved" : "🔴 Rejected"}
                            </span>
                          </td>
                          <td className="text-xs">{g.assignedTo ?? "Unassigned"}</td>
                          <td className="text-xs text-[#4a6080]">{new Date(g.createdAt).toLocaleDateString("en-IN")}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Audit Logs */}
          {screen === "audit-logs" && (
            <div className="p-6 animate-fade">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-[#1a2332]">Audit Logs — Complete Immutable Trail</h2>
                  <p className="text-sm text-[#4a6080]">Every action logged with timestamp, agent, and reference</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-[#1a6b2e] text-white text-xs font-semibold px-3 py-2 rounded">📥 Export CSV</button>
                  <button className="bg-[#1a3a6b] text-white text-xs font-semibold px-3 py-2 rounded">📊 Excel</button>
                  <button className="bg-[#d4500a] text-white text-xs font-semibold px-3 py-2 rounded">📄 PDF</button>
                </div>
              </div>

              {/* Transaction audit */}
              <div className="bg-white border border-[#c0d0e2] rounded-lg overflow-hidden mb-4">
                <div className="bg-[#0e2247] text-white px-5 py-3 flex items-center justify-between">
                  <p className="font-semibold text-sm">Transaction Audit Records</p>
                  <span className="text-[#93c5fd] text-xs">{state.transactions.length} records</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="gov-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Booking ID</th>
                        <th>Farmer ID</th>
                        <th>Centre</th>
                        <th>Crop</th>
                        <th>Actual Qty</th>
                        <th>Price/Q</th>
                        <th>Gross</th>
                        <th>Deductions</th>
                        <th>Net Payable</th>
                        <th>UTR Number</th>
                        <th>PFMS Ref</th>
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
                          <td className="mono text-xs">{t.farmerId}</td>
                          <td className="text-xs">{t.centreId}</td>
                          <td>{t.crop}</td>
                          <td className="mono">{t.actualQty}Q</td>
                          <td className="mono">₹{t.pricePerQ.toLocaleString("en-IN")}</td>
                          <td className="mono">{formatINR(t.grossAmount)}</td>
                          <td className="mono text-[#b91c1c]">{formatINR(t.qualityDeduction + t.otherDeduction)}</td>
                          <td className="mono font-bold text-[#1a6b2e]">{formatINR(t.netAmount)}</td>
                          <td className="mono text-xs">{t.utrNumber}</td>
                          <td className="mono text-xs">{t.pfmsRef}</td>
                          <td>
                            <span className={`text-[10px] font-semibold ${t.paymentStatus === "credited" ? "text-[#1a6b2e]" : t.paymentStatus === "failed" ? "text-[#b91c1c]" : "text-[#b45309]"}`}>
                              {t.paymentStatus === "credited" ? "🟢 Credited" : t.paymentStatus === "failed" ? "🔴 Failed" : "🟡 Processing"}
                            </span>
                          </td>
                          <td className="mono text-xs">{t.agentId}</td>
                          <td className="text-xs text-[#4a6080]">{new Date(t.createdAt).toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Booking status changes */}
              <div className="bg-white border border-[#c0d0e2] rounded-lg p-5">
                <h3 className="font-semibold text-[#1a2332] mb-3">Booking Status Change Log</h3>
                <div className="space-y-2">
                  {state.bookings.slice(0, 5).map((b, i) => (
                    <div key={b.id} className="flex items-center gap-4 py-2 border-b border-[#e0e8f0] last:border-0 text-xs">
                      <span className="text-[#4a6080] w-20 shrink-0">{new Date(b.createdAt).toLocaleDateString("en-IN")}</span>
                      <span className="mono font-bold text-[#1a3a6b] w-32 shrink-0">{b.id}</span>
                      <span className="font-medium w-28 shrink-0">{b.farmerName}</span>
                      <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                        b.status === "accepted" ? "badge-accepted" :
                        b.status === "rejected" ? "badge-rejected" :
                        b.status === "completed" ? "badge-completed" :
                        b.status === "rescheduled" ? "badge-rescheduled" : "badge-pending"
                      }`}>{b.status.toUpperCase()}</span>
                      {b.rejectionReason && <span className="text-[#4a6080] truncate">Reason: {b.rejectionReason}</span>}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#4a6080] mt-3 italic">
                  Full audit trail stored in PostgreSQL audit_logs table. Immutable — no records can be deleted or modified. Compliant with government procurement regulations.
                </p>
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
