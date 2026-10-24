import { useState } from "react";
import { useStore } from "../store";
import KishanSetuLogo from "../components/KishanSetuLogo";

interface Props { onExit: () => void; }

type Tab = "overview" | "farmers" | "agents" | "bookings" | "payments" | "documents" | "security" | "settings";

const ADMIN_PASS = "admin2026";

const FARMER_DOC_TYPES = ["Aadhaar Card Photo", "Farmer Photo", "Kisan Credit Card", "Land Record / 7-12 Extract"];
const AGENT_DOC_TYPES = [
  "Aadhaar Card", "PAN Card", "Agent License / APMC ID", "Government Employment ID",
  "Centre GST Certificate", "Centre FSSAI License", "Centre Weighbridge Certificate",
  "Centre Bank Passbook", "Centre Land Record / Lease Deed", "Centre Photo",
  "Centre Geo-Tagged Exterior Photo", "Centre Interior Weighbridge Photo",
  "Agent Photo (recent)", "Agent Signature Scan", "Agent Bank Passbook", "Agent Form-16 / IT Return",
];

type DocStatus = "verified" | "pending" | "rejected" | "missing";

interface DocRecord {
  id: string;
  name: string;
  role: "farmer" | "agent";
  userId: string;
  documents: { type: string; status: DocStatus; uploadedAt: string }[];
}

function randomStatus(seed: number): DocStatus {
  const statuses: DocStatus[] = ["verified", "verified", "verified", "pending", "pending", "rejected"];
  return statuses[seed % statuses.length];
}

function buildDocRecords(farmers: { id: string; name: string }[]): DocRecord[] {
  const records: DocRecord[] = [];
  const now = new Date();

  const agentRecords: DocRecord[] = [
    {
      id: "agt-1",
      name: "Rajesh Kumar (APMC Lucknow)",
      role: "agent",
      userId: "AGT-LKO-01",
      documents: AGENT_DOC_TYPES.map((type, i) => ({
        type,
        status: randomStatus(i + 3),
        uploadedAt: new Date(now.getTime() - (i + 1) * 86400000 * 2).toLocaleDateString("en-IN"),
      })),
    },
    {
      id: "agt-2",
      name: "Priya Sharma (Govt Centre Bhopal)",
      role: "agent",
      userId: "AGT-BHO-02",
      documents: AGENT_DOC_TYPES.map((type, i) => ({
        type,
        status: i < 11 ? "verified" : "pending",
        uploadedAt: new Date(now.getTime() - (i + 1) * 86400000).toLocaleDateString("en-IN"),
      })),
    },
  ];

  farmers.slice(0, 10).forEach((f, fi) => {
    records.push({
      id: f.id,
      name: f.name,
      role: "farmer",
      userId: `KF-${f.id}`,
      documents: FARMER_DOC_TYPES.map((type, di) => ({
        type,
        status: randomStatus(fi + di),
        uploadedAt: new Date(now.getTime() - (di + 1) * 86400000 * (fi + 1)).toLocaleDateString("en-IN"),
      })),
    });
  });

  return [...agentRecords, ...records];
}

const STATUS_COLORS: Record<DocStatus, { bg: string; text: string; label: string }> = {
  verified: { bg: "#f0fdf4", text: "#15803d", label: "✓ Verified" },
  pending: { bg: "#fefce8", text: "#a16207", label: "⏳ Pending" },
  rejected: { bg: "#fef2f2", text: "#dc2626", label: "✗ Rejected" },
  missing: { bg: "#f9fafb", text: "#9ca3af", label: "— Missing" },
};

function DocumentsPanel({ farmers }: { farmers: { id: string; name: string }[] }) {
  const [filter, setFilter] = useState<"all" | "farmer" | "agent">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | DocStatus>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const allRecords = buildDocRecords(farmers);
  const filtered = allRecords.filter(r => {
    if (filter !== "all" && r.role !== filter) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.userId.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && !r.documents.some(d => d.status === statusFilter)) return false;
    return true;
  });

  const totalDocs = allRecords.reduce((s, r) => s + r.documents.length, 0);
  const verifiedDocs = allRecords.reduce((s, r) => s + r.documents.filter(d => d.status === "verified").length, 0);
  const pendingDocs = allRecords.reduce((s, r) => s + r.documents.filter(d => d.status === "pending").length, 0);
  const rejectedDocs = allRecords.reduce((s, r) => s + r.documents.filter(d => d.status === "rejected").length, 0);

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Documents", value: totalDocs, color: "#1a3a6b", icon: "📄" },
          { label: "Verified", value: verifiedDocs, color: "#15803d", icon: "✅" },
          { label: "Pending Review", value: pendingDocs, color: "#a16207", icon: "⏳" },
          { label: "Rejected", value: rejectedDocs, color: "#dc2626", icon: "❌" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3 items-center">
            <span className="text-2xl">{k.icon}</span>
            <div>
              <div className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
              <div className="text-xs text-gray-400">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or ID…"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy flex-1 min-w-48"
        />
        <div className="flex gap-2">
          {(["all", "farmer", "agent"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors"
              style={{ background: filter === f ? "#1a3a6b" : "#f1f5f9", color: filter === f ? "white" : "#64748b" }}>
              {f === "all" ? "All" : f === "farmer" ? "🌾 Farmers" : "🏢 Agents"}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(["all", "verified", "pending", "rejected"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors"
              style={{ background: statusFilter === s ? "#1a3a6b" : "#f1f5f9", color: statusFilter === s ? "white" : "#64748b" }}>
              {s === "all" ? "All Status" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Document Records */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">No records match the current filters.</div>
        )}
        {filtered.map(rec => {
          const isOpen = expanded === rec.id;
          const docVerified = rec.documents.filter(d => d.status === "verified").length;
          const docTotal = rec.documents.length;
          const hasIssues = rec.documents.some(d => d.status === "rejected" || d.status === "pending");
          return (
            <div key={rec.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(isOpen ? null : rec.id)}>
                <span className="text-2xl">{rec.role === "farmer" ? "🌾" : "🏢"}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-navy text-sm">{rec.name}</div>
                  <div className="text-xs text-gray-400">{rec.userId} · {rec.role === "farmer" ? "Farmer" : "Procurement Agent"}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: docVerified === docTotal ? "#15803d" : "#a16207" }}>
                      {docVerified}/{docTotal}
                    </div>
                    <div className="text-xs text-gray-400">verified</div>
                  </div>
                  {hasIssues && (
                    <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full font-semibold">Needs Review</span>
                  )}
                  {!hasIssues && docVerified === docTotal && (
                    <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">Complete</span>
                  )}
                  <span className="text-gray-300 text-sm">{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 p-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {rec.documents.map(doc => {
                      const s = STATUS_COLORS[doc.status];
                      return (
                        <div key={doc.type} className="rounded-xl border p-3 flex gap-3 items-start"
                          style={{ background: s.bg, borderColor: s.text + "22" }}>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-navy leading-tight">{doc.type}</div>
                            <div className="text-xs mt-1 font-semibold" style={{ color: s.text }}>{s.label}</div>
                            <div className="text-xs text-gray-400 mt-0.5">Uploaded: {doc.uploadedAt}</div>
                          </div>
                          {doc.status === "verified" ? (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm flex-shrink-0">✓</div>
                          ) : doc.status === "pending" ? (
                            <button className="text-xs bg-navy text-white rounded-lg px-2 py-1 font-semibold flex-shrink-0 hover:opacity-90">Review</button>
                          ) : doc.status === "rejected" ? (
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm flex-shrink-0">✗</div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminConsoleFull({ onExit }: Props) {
  const { state } = useStore();
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [passErr, setPassErr] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy" style={{ background: "linear-gradient(135deg,#060f24,#1a3a6b)" }}>
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6"><KishanSetuLogo size={52} /></div>
          <h2 className="font-display font-bold text-navy text-xl text-center mb-1">Admin Console</h2>
          <p className="text-gray-400 text-sm text-center mb-6">Restricted access · Authorized personnel only</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5 uppercase tracking-wide">Admin Password</label>
              <input type="password" value={pass} onChange={e => { setPass(e.target.value); setPassErr(""); }}
                placeholder="Enter admin password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy"
                onKeyDown={e => e.key === "Enter" && (pass === ADMIN_PASS ? setAuth(true) : setPassErr("Incorrect. Demo: admin2026"))}
              />
              {passErr && <p className="text-red-600 text-xs mt-1">{passErr}</p>}
              <p className="text-xs text-saffron mt-1">Demo password: <strong>admin2026</strong></p>
            </div>
            <button onClick={() => pass === ADMIN_PASS ? setAuth(true) : setPassErr("Incorrect. Demo: admin2026")}
              className="w-full py-3.5 rounded-xl font-bold text-white"
              style={{ background: "linear-gradient(135deg,#1a3a6b,#2a5298)" }}>
              Access Console →
            </button>
            <button onClick={onExit} className="w-full py-2 text-sm text-gray-400 hover:underline">← Back to main site</button>
          </div>
        </div>
      </div>
    );
  }

  const farmers = state.farmers;
  const bookings = state.bookings;
  const transactions = state.transactions;
  const grievances = state.grievances;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "farmers", label: "Farmers", icon: "🌾" },
    { id: "agents", label: "Agents / Centres", icon: "🏢" },
    { id: "bookings", label: "Bookings", icon: "📅" },
    { id: "payments", label: "Payments", icon: "💰" },
    { id: "documents", label: "Uploaded Documents", icon: "📁" },
    { id: "security", label: "Security & Audit", icon: "🔒" },
    { id: "settings", label: "Platform Settings", icon: "⚙️" },
  ];

  const kpis = [
    { label: "Total Farmers", value: (14234 + farmers.length).toLocaleString(), delta: "+247 this week", color: "#1a3a6b" },
    { label: "Procurement Centres", value: "6,218", delta: "+12 this month", color: "#52b788" },
    { label: "Total Bookings", value: (bookings.length + 38921).toLocaleString(), delta: "+89 today", color: "#d4500a" },
    { label: "Pending KYC", value: "1,284", delta: "Needs review", color: "#f5c842" },
    { label: "PFMS Disbursed", value: "₹84.2 Cr", delta: "+₹2.1 Cr today", color: "#8b5cf6" },
    { label: "Active Grievances", value: (grievances.length + 23).toString(), delta: "3 critical", color: "#ef4444" },
  ];

  const recentActivity = [
    { time: "09:41", action: "New farmer registered", detail: "Raju Singh — UP-Sitapur", type: "info" },
    { time: "09:38", action: "PFMS transfer completed", detail: "₹48,200 → KF-543210", type: "success" },
    { time: "09:31", action: "Agent document pending", detail: "AGT-Bhopal-02 — 3 docs", type: "warn" },
    { time: "09:12", action: "KYC flagged for review", detail: "Aadhaar mismatch — KF-221198", type: "error" },
    { time: "08:55", action: "New procurement centre", detail: "Raipur Central — Govt", type: "info" },
    { time: "08:40", action: "Grievance escalated", detail: "#GRV-0042 — Payment dispute", type: "error" },
  ];

  const auditLog = [
    { ts: "2026-09-10 09:41", user: "system", action: "User registration", detail: "Farmer ID KF-543890 created", ip: "203.0.113.12" },
    { ts: "2026-09-10 09:38", user: "admin", action: "PFMS transfer approved", detail: "TXN-2026-09841 ₹48,200", ip: "10.0.0.2" },
    { ts: "2026-09-10 09:20", user: "admin", action: "Agent verified", detail: "AGT-Kanpur-07 docs approved", ip: "10.0.0.2" },
    { ts: "2026-09-10 08:55", user: "admin", action: "Centre activated", detail: "Raipur Central Warehouse", ip: "10.0.0.2" },
    { ts: "2026-09-10 08:30", user: "admin", action: "Admin login", detail: "Console session started", ip: "10.0.0.2" },
  ];

  const filteredFarmers = farmers.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.mobile.includes(search) ||
    f.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col" style={{ background: "linear-gradient(180deg,#060f24,#1a3a6b)" }}>
        <div className="p-5 border-b border-white/10">
          <KishanSetuLogo size={36} light />
          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/50 text-xs">Admin Session Active</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${tab === t.id
                ? "bg-white/15 text-white font-semibold"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button onClick={() => setAuth(false)} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-white/40 hover:text-red-400 rounded-xl transition-colors">
            <span>🔓</span> Lock Console
          </button>
          <button onClick={onExit} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-white/40 hover:text-white/70 rounded-xl transition-colors">
            <span>←</span> Back to Site
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
          <div>
            <h1 className="font-display font-bold text-navy text-xl">{tabs.find(t => t.id === tab)?.label}</h1>
            <p className="text-gray-400 text-xs mt-0.5">KishanSetu Admin Console · {new Date().toLocaleString("en-IN")}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full font-semibold text-yellow-700">⚠ Demo Mode</span>
            <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold">A</div>
          </div>
        </div>

        <div className="p-8">

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {kpis.map(k => (
                  <div key={k.label} className="kpi-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{k.label}</span>
                      <div className="w-2 h-2 rounded-full" style={{ background: k.color }} />
                    </div>
                    <div className="font-display font-bold text-2xl text-navy">{k.value}</div>
                    <div className="text-xs text-gray-400 mt-1">{k.delta}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-navy mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.map((a, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-xs text-gray-300 font-mono w-10 flex-shrink-0 mt-0.5">{a.time}</span>
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.type === "success" ? "bg-green-500" : a.type === "warn" ? "bg-yellow-400" : a.type === "error" ? "bg-red-500" : "bg-blue-400"}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-navy">{a.action}</div>
                          <div className="text-xs text-gray-400 truncate">{a.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-navy mb-4">System Health</h3>
                  <div className="space-y-4">
                    {[
                      { name: "API Gateway", status: 99.8, color: "#52b788" },
                      { name: "OTP Service (MSG91)", status: 98.2, color: "#52b788" },
                      { name: "PFMS Integration", status: 100, color: "#52b788" },
                      { name: "Aadhaar / UIDAI Bridge", status: 97.5, color: "#f5c842" },
                      { name: "Bhashini Voice AI", status: 94.1, color: "#f5c842" },
                      { name: "Geolocation Service", status: 100, color: "#52b788" },
                    ].map(s => (
                      <div key={s.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">{s.name}</span>
                          <span className="text-xs font-mono font-semibold" style={{ color: s.color }}>{s.status}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${s.status}%`, background: s.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FARMERS */}
          {tab === "farmers" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <input type="text" placeholder="Search by name, phone, district..." value={search} onChange={e => setSearch(e.target.value)}
                  className="flex-1 min-w-64 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-navy" />
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-semibold text-navy">{14234 + farmers.length}</span> registered
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="data-table w-full">
                  <thead>
                    <tr>
                      <th>Farmer ID</th><th>Name</th><th>Mobile</th><th>District / State</th>
                      <th>KYC Status</th><th>DBT</th><th>Land (Ac)</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Demo rows */}
                    {[
                      { id:"KF-543210", name:"Ramesh Kumar", mob:"9876543210", loc:"Lucknow, UP", kyc:"verified", dbt:true, land:3.5 },
                      { id:"KF-221198", name:"Suman Devi", mob:"9765432101", loc:"Patna, Bihar", kyc:"pending", dbt:false, land:1.2 },
                      { id:"KF-110234", name:"Mohan Lal", mob:"9654321012", loc:"Jaipur, Rajasthan", kyc:"verified", dbt:true, land:8.0 },
                    ].concat(filteredFarmers.map(f => ({ id:f.id, name:f.name, mob:f.mobile, loc:`${f.district}, ${f.state}`, kyc:f.kycStatus, dbt:f.consentGiven, land:f.landAcres }))).map(f => (
                      <tr key={f.id}>
                        <td className="font-mono text-xs">{f.id}</td>
                        <td className="font-semibold">{f.name}</td>
                        <td>{f.mob}</td>
                        <td className="text-gray-400">{f.loc}</td>
                        <td><span className={`badge-${f.kyc === "verified" ? "verified" : "pending"}`}>{f.kyc}</span></td>
                        <td>{f.dbt ? "✓" : "—"}</td>
                        <td>{f.land}</td>
                        <td>
                          <button className="text-xs text-navy font-semibold hover:underline">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AGENTS */}
          {tab === "agents" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="text" placeholder="Search centres..." value={search} onChange={e => setSearch(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-navy" />
                <span className="text-sm text-gray-500"><span className="font-semibold text-navy">6,218</span> centres</span>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="data-table w-full">
                  <thead>
                    <tr><th>Centre ID</th><th>Name</th><th>Type</th><th>Location</th><th>Docs</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { id:"AGT-LKO-01", name:"State Agri Warehouse", type:"Govt", loc:"Lucknow, UP", docs:"Verified", status:"Active" },
                      { id:"AGT-BHO-02", name:"MP Grain Centre", type:"Private", loc:"Bhopal, MP", docs:"Pending", status:"Review" },
                      { id:"AGT-CHD-03", name:"Punjab Mandi Board", type:"Govt", loc:"Chandigarh, PB", docs:"Verified", status:"Active" },
                    ].map(a => (
                      <tr key={a.id}>
                        <td className="font-mono text-xs">{a.id}</td>
                        <td className="font-semibold">{a.name}</td>
                        <td><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${a.type === "Govt" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>{a.type}</span></td>
                        <td className="text-gray-400">{a.loc}</td>
                        <td><span className={`badge-${a.docs === "Verified" ? "verified" : "pending"}`}>{a.docs}</span></td>
                        <td><span className={`text-xs font-semibold ${a.status === "Active" ? "text-green-600" : "text-yellow-600"}`}>{a.status}</span></td>
                        <td className="flex gap-2">
                          <button className="text-xs text-navy font-semibold hover:underline">Edit</button>
                          <button className="text-xs text-red-500 font-semibold hover:underline">Suspend</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BOOKINGS */}
          {tab === "bookings" && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Total", val: bookings.length + 38921, color: "blue" },
                  { label: "Pending", val: bookings.filter(b=>b.status==="pending").length + 8241, color: "yellow" },
                  { label: "Completed", val: bookings.filter(b=>b.status==="completed").length + 28190, color: "green" },
                  { label: "Cancelled", val: bookings.filter(b=>b.status==="cancelled").length + 2490, color: "red" },
                ].map(k => (
                  <div key={k.label} className="kpi-card">
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{k.label}</div>
                    <div className="font-display font-bold text-xl text-navy">{k.val.toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="data-table w-full">
                  <thead><tr><th>Booking ID</th><th>Farmer</th><th>Crop</th><th>Qty (Q)</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {bookings.slice(0, 10).map(b => (
                      <tr key={b.id}>
                        <td className="font-mono text-xs">{b.id}</td>
                        <td className="font-semibold">{b.farmerName}</td>
                        <td>{b.crop}</td>
                        <td>{b.quantity}</td>
                        <td className="text-gray-400">{b.date}</td>
                        <td><span className={`text-xs font-semibold ${b.status==="completed"?"text-green-600":b.status==="pending"?"text-yellow-600":"text-red-500"}`}>{b.status}</span></td>
                        <td><button className="text-xs text-navy hover:underline">View</button></td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-8 text-gray-400 text-sm">No bookings in demo session · Live data would appear here</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {tab === "payments" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Total Disbursed", val: "₹84.2 Cr", sub: "PFMS Verified" },
                  { label: "Pending Transfers", val: "₹1.24 Cr", sub: "12 transactions" },
                  { label: "Avg. Processing Time", val: "2.4 hrs", sub: "Last 30 days" },
                ].map(k => (
                  <div key={k.label} className="kpi-card">
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{k.label}</div>
                    <div className="font-display font-bold text-2xl text-navy">{k.val}</div>
                    <div className="text-xs text-gray-400 mt-1">{k.sub}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-navy mb-4">Recent Transactions</h3>
                <table className="data-table w-full">
                  <thead><tr><th>TXN ID</th><th>Farmer</th><th>Crop</th><th>Gross</th><th>Net</th><th>UTR</th><th>Status</th></tr></thead>
                  <tbody>
                    {transactions.slice(0,8).map(t => (
                      <tr key={t.id}>
                        <td className="font-mono text-xs">{t.id.slice(0,12)}…</td>
                        <td className="font-semibold">{t.farmerName}</td>
                        <td>{t.crop}</td>
                        <td>₹{t.grossAmount.toLocaleString()}</td>
                        <td className="font-semibold text-green-700">₹{t.netAmount.toLocaleString()}</td>
                        <td className="font-mono text-xs text-gray-400">{t.utrNumber}</td>
                        <td><span className={`badge-${t.paymentStatus === "credited" ? "verified" : "pending"}`}>{t.paymentStatus}</span></td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-8 text-gray-400 text-sm">No transactions in demo session</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DOCUMENTS */}
          {tab === "documents" && (
            <DocumentsPanel farmers={farmers} />
          )}

          {/* SECURITY */}
          {tab === "security" && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-navy mb-4">🔒 Audit Log</h3>
                  <div className="space-y-3">
                    {auditLog.map((a, i) => (
                      <div key={i} className="flex gap-3 text-xs border-b border-gray-50 pb-3">
                        <span className="font-mono text-gray-300 w-28 flex-shrink-0">{a.ts.split(" ")[1]}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-navy">{a.action}</div>
                          <div className="text-gray-400">{a.detail}</div>
                          <div className="text-gray-300 mt-0.5">IP: {a.ip} · by {a.user}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-semibold text-navy mb-3">DPDP Act 2023 Compliance</h3>
                    {[
                      ["Aadhaar Masking", "✓ Active — XXXX XXXX XXXX"],
                      ["Consent Logging", "✓ All consents timestamped"],
                      ["Data Retention", "7 years (SRO mandate)"],
                      ["Right to Erasure", "Available via Grievance portal"],
                      ["Encryption at Rest", "AES-256 (simulated)"],
                      ["Encryption in Transit", "TLS 1.3"],
                    ].map(([k,v]) => (
                      <div key={k as string} className="flex justify-between py-2 border-b border-gray-50 text-sm">
                        <span className="text-gray-500">{k}</span>
                        <span className="font-semibold text-navy text-xs">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                    <h4 className="font-semibold text-red-700 mb-2 text-sm">⚠ Active Alerts</h4>
                    <div className="space-y-1.5 text-xs text-red-600">
                      <div>• KYC mismatch detected — KF-221198 (Aadhaar name mismatch)</div>
                      <div>• 3 accounts flagged for unusual login patterns</div>
                      <div>• Agent AGT-BHO-02 document verification overdue (7 days)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab === "settings" && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                <h3 className="font-semibold text-navy">Platform Configuration</h3>
                {[
                  { label: "Demo Mode", desc: "All data is simulated — disable for production", type: "toggle", val: true },
                  { label: "OTP Provider", desc: "MSG91 API integration", type: "select", val: "MSG91" },
                  { label: "Voice AI Provider", desc: "Bhashini API for 11 languages", type: "select", val: "Bhashini" },
                  { label: "PFMS Environment", desc: "Government payment rails", type: "select", val: "Staging" },
                  { label: "KYC Verification Mode", desc: "Aadhaar OTP / UIDAI API", type: "select", val: "Simulated" },
                  { label: "Maintenance Window", desc: "Schedule downtime notification to users", type: "text", val: "None scheduled" },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between py-3 border-b border-gray-50">
                    <div>
                      <div className="text-sm font-semibold text-navy">{s.label}</div>
                      <div className="text-xs text-gray-400">{s.desc}</div>
                    </div>
                    {s.type === "toggle" ? (
                      <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${s.val ? "bg-navy" : "bg-gray-300"} relative`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${s.val ? "left-5" : "left-0.5"}`} />
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">{s.val}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-navy mb-4">Supported Crops (MSP Table)</h3>
                <div className="grid grid-cols-3 gap-2">
                  {state.cropPrices.map(cp => (
                    <div key={cp.crop} className="text-xs bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                      <div className="font-semibold text-navy">{cp.crop}</div>
                      <div className="text-gray-400">₹{cp.mspPerQ}/Q</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
                ⚠ This is a demo console. In production, all settings changes would require 2-FA admin authentication and would be logged to the audit trail.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
