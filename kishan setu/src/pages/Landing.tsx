import { Portal } from "../App";
import { useStore } from "../store";

interface Props {
  onPortal: (p: Portal) => void;
  onStartDemo: () => void;
}

function KishanSetuLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill="#1a3a6b" stroke="#d4500a" strokeWidth="3" />
      <text x="32" y="28" textAnchor="middle" fontSize="22" fill="#f5c842">🌾</text>
      <path d="M18 40 Q32 34 46 40" stroke="#d4500a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <text x="32" y="54" textAnchor="middle" fontSize="8" fill="white" fontFamily="sans-serif" fontWeight="bold">किसानसेतु</text>
    </svg>
  );
}

function UtilityBar() {
  return (
    <div className="utility-bar py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px]">
          <a href="#main" className="hover:underline text-[#4a3f2f]">Skip to Main Content</a>
          <span className="text-[#c0b090]">|</span>
          <span>Screen Reader Access</span>
          <span className="text-[#c0b090]">|</span>
          <span>Font Size: <button className="hover:underline font-medium">A-</button> <button className="hover:underline font-bold">A</button> <button className="hover:underline font-extrabold">A+</button></span>
          <span className="text-[#c0b090]">|</span>
          <button className="hover:underline">High Contrast</button>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium">
          <span className="text-[#d4500a] font-bold">भाषा:</span>
          <button className="hover:underline text-[#1a3a6b] font-semibold">हिंदी</button>
          <span className="text-[#c0b090]">/</span>
          <button className="hover:underline text-[#1a3a6b] font-semibold underline">English</button>
        </div>
      </div>
    </div>
  );
}

export default function Landing({ onPortal, onStartDemo }: Props) {
  const { state } = useStore();

  const totalFarmers = state.farmers.length;
  const totalBookings = state.bookings.length;
  const completedTxn = state.transactions.length;
  const totalValue = state.transactions.reduce((s, t) => s + t.netAmount, 0);

  return (
    <div className="min-h-full flex flex-col">
      <UtilityBar />

      {/* Header */}
      <header className="bg-[#1a3a6b] text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <KishanSetuLogo size={56} />
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Kishan<span className="text-[#f5c842]">सेतु</span>
                </h1>
                <span className="text-[#93c5fd] text-sm font-medium">किसानसेतु</span>
              </div>
              <p className="text-[#93c5fd] text-xs mt-0.5">
                किसान और केंद्र के बीच एक स्मार्ट सेतु — A Digital Agriculture Initiative
              </p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[#93c5fd] text-xs">Ministry of Agriculture & Farmers Welfare</p>
            <p className="text-[#f5c842] text-xs font-semibold mt-0.5">⚠ SIH 2026 Prototype</p>
          </div>
        </div>

        {/* Nav strip */}
        <div className="bg-[#0e2247] border-t border-[#2a5298]/50">
          <div className="max-w-7xl mx-auto px-6 py-2 flex items-center gap-6 text-xs text-[#93c5fd]">
            <span className="text-white font-semibold">Home</span>
            <span className="hover:text-white cursor-pointer">About KishanSetu</span>
            <span className="hover:text-white cursor-pointer">Farmer Portal</span>
            <span className="hover:text-white cursor-pointer">Centre Login</span>
            <span className="hover:text-white cursor-pointer">Admin</span>
            <span className="hover:text-white cursor-pointer">Contact</span>
          </div>
        </div>
      </header>

      {/* Demo alert */}
      <div className="bg-[#fef3c7] border-b-2 border-[#f59e0b] px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-sm">
          <span className="text-[#b45309] font-bold">⚠ DEMO DATA</span>
          <span className="text-[#92400e]">
            This is an SIH 2026 prototype with simulated data. Not connected to live government systems.
          </span>
          <span className="ml-auto text-[#b45309] text-xs font-medium hidden md:block">
            Crop prices: ⚠ DEMO PRICE (CACP/Agmarknet integration-ready)
          </span>
        </div>
      </div>

      <main id="main" className="flex-1 bg-[#eef2f7]">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#1a3a6b] via-[#1e4080] to-[#2a5298] text-white py-16 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded px-4 py-1.5 text-sm mb-6">
              <span className="text-[#f5c842]">🏆</span>
              <span>Smart India Hackathon 2026 — Agricultural Procurement Platform</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Transparent Procurement.<br />
              <span className="text-[#f5c842]">Fair Prices. Fast Payment.</span>
            </h2>
            <p className="text-[#93c5fd] text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              KishanSetu digitizes the complete agricultural procurement journey — from farmer KYC and slot booking to weighment, bill generation, and DBT payment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onStartDemo}
                className="bg-[#d4500a] hover:bg-[#b84208] text-white font-bold text-lg px-8 py-3.5 rounded transition-colors shadow-lg flex items-center gap-2"
              >
                ▶ Start Guided Demo
                <span className="text-sm font-normal opacity-80">6 Scenes</span>
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => onPortal("farmer")}
                  className="bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-5 py-3 rounded transition-colors text-sm"
                >
                  👨‍🌾 Farmer App
                </button>
                <button
                  onClick={() => onPortal("centre")}
                  className="bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-5 py-3 rounded transition-colors text-sm"
                >
                  🏢 Centre Portal
                </button>
                <button
                  onClick={() => onPortal("admin")}
                  className="bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-5 py-3 rounded transition-colors text-sm"
                >
                  📊 Admin Console
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Live stats */}
        <section className="py-8 px-6 bg-white border-b border-[#c0d0e2]">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Registered Farmers", value: `${totalFarmers}+`, sub: "KYC Verified", color: "text-[#1a3a6b]" },
              { label: "Active Bookings", value: `${totalBookings}`, sub: "This Season", color: "text-[#d4500a]" },
              { label: "Transactions Completed", value: `${completedTxn}`, sub: "Demo Data", color: "text-[#1a6b2e]" },
              { label: "Total Procurement Value", value: `₹${(totalValue / 100000).toFixed(1)}L`, sub: "Net DBT Amount", color: "text-[#6d28d9]" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className={`text-3xl font-bold mono ${s.color}`}>{s.value}</p>
                <p className="text-sm font-semibold text-[#1a2332] mt-1">{s.label}</p>
                <p className="text-xs text-[#4a6080]">{s.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Demo credentials */}
        <section className="py-10 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#1a3a6b] rounded-lg p-6 text-white mb-8">
              <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                <span>🔑</span> Demo Credentials
              </h3>
              <p className="text-[#93c5fd] text-sm mb-4">Use these credentials to explore each portal</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { role: "Farmer Login", icon: "👨‍🌾", creds: [{ k: "Mobile", v: "9876543210" }, { k: "OTP", v: "123456" }] },
                  { role: "Centre Agent", icon: "🏢", creds: [{ k: "Centre ID", v: "CTR-024" }, { k: "Agent ID", v: "AGT-024-01" }, { k: "Password", v: "agent123" }] },
                  { role: "Admin Login", icon: "📊", creds: [{ k: "Username", v: "admin" }, { k: "Password", v: "demo123" }] },
                ].map((c) => (
                  <div key={c.role} className="bg-white/10 border border-white/20 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <span>{c.icon}</span> {c.role}
                    </p>
                    {c.creds.map((kv) => (
                      <div key={kv.k} className="flex items-center justify-between text-xs mt-1">
                        <span className="text-[#93c5fd]">{kv.k}:</span>
                        <span className="mono font-bold text-[#f5c842] bg-black/20 px-2 py-0.5 rounded">{kv.v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Process flow */}
            <h3 className="text-xl font-bold text-[#1a3a6b] mb-6 text-center">Complete Procurement Journey</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Farmer flow */}
              <div className="bg-white border border-[#c0d0e2] rounded-lg overflow-hidden shadow-sm">
                <div className="bg-[#1a6b2e] text-white px-5 py-3 flex items-center gap-2 font-semibold">
                  <span>👨‍🌾</span> Farmer Flow
                </div>
                <div className="p-5">
                  {[
                    { icon: "📱", step: "Onboarding & KYC", desc: "Mobile OTP, Aadhaar verification, land records" },
                    { icon: "🏠", step: "Home Dashboard", desc: "Centres, prices, capacity, bookings" },
                    { icon: "📅", step: "Book a Slot", desc: "Select crop, quantity, centre, date & slot" },
                    { icon: "⏳", step: "Await Decision", desc: "Centre accepts / rejects / reschedules" },
                    { icon: "🔢", step: "Queue Tracking", desc: "Position, estimated wait time" },
                    { icon: "🧾", step: "Post-Collection", desc: "Weighment → Bill → DBT Payment" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#e6f4ea] flex items-center justify-center text-sm flex-shrink-0">{item.icon}</div>
                        {i < 5 && <div className="w-0.5 h-4 bg-[#c0d0e2] mt-1" />}
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-semibold text-[#1a2332]">{item.step}</p>
                        <p className="text-xs text-[#4a6080]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Centre flow */}
              <div className="bg-white border border-[#c0d0e2] rounded-lg overflow-hidden shadow-sm">
                <div className="bg-[#1a3a6b] text-white px-5 py-3 flex items-center gap-2 font-semibold">
                  <span>🏢</span> Centre Agent Flow
                </div>
                <div className="p-5">
                  {[
                    { icon: "🔐", step: "Login & ID Check", desc: "Centre ID, Agent ID, authorization verification" },
                    { icon: "💰", step: "Price & Capacity", desc: "MSP prices, daily intake, remaining capacity" },
                    { icon: "📋", step: "Manage Queue", desc: "Accept / Reject / Reschedule farmer requests" },
                    { icon: "📱", step: "QR Scan", desc: "Farmer arrives, scan booking QR code" },
                    { icon: "⚖️", step: "Transaction Closing", desc: "Actual weight, quality grade, deductions" },
                    { icon: "📊", step: "Audit Export", desc: "CSV/Excel/PDF export with full audit trail" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#e8eef8] flex items-center justify-center text-sm flex-shrink-0">{item.icon}</div>
                        {i < 5 && <div className="w-0.5 h-4 bg-[#c0d0e2] mt-1" />}
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-semibold text-[#1a2332]">{item.step}</p>
                        <p className="text-xs text-[#4a6080]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "🎙️", title: "Bhashini Voice", desc: "Multilingual voice interaction in Indian languages" },
                { icon: "📡", title: "SMS / IVR", desc: "Exotel/Twilio-ready for non-smartphone farmers" },
                { icon: "🗺️", title: "PostGIS Centres", desc: "Geographic centre discovery & distance calculation" },
                { icon: "💳", title: "PFMS/DBT Payment", desc: "Direct Benefit Transfer via Aadhaar-linked account" },
                { icon: "🔒", title: "Aadhaar Masked", desc: "DPDP Act 2023 compliant — XXXX XXXX XXXX format" },
                { icon: "📦", title: "Queue Engine", desc: "Python/FastAPI backend queue with concurrency control" },
                { icon: "📊", title: "Admin Analytics", desc: "Crop-wise, centre-wise, district-wise procurement data" },
                { icon: "📋", title: "CPGRAMS Grievance", desc: "Ticketed grievance system with GRV-YYYY-XXXXX IDs" },
              ].map((f) => (
                <div key={f.title} className="bg-white border border-[#c0d0e2] rounded-lg p-4 gov-card-hover shadow-sm">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <p className="text-sm font-semibold text-[#1a3a6b] mb-1">{f.title}</p>
                  <p className="text-xs text-[#4a6080] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portal entry cards */}
        <section className="py-10 px-6 bg-white border-t border-[#c0d0e2]">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-center text-xl font-bold text-[#1a3a6b] mb-2">Access KishanSetu Portals</h3>
            <p className="text-center text-sm text-[#4a6080] mb-8">Choose your role to enter the respective portal</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "👨‍🌾",
                  title: "Farmer Portal",
                  subtitle: "किसान पोर्टल",
                  desc: "Register, book slots, track queue, view bills and payment status",
                  color: "bg-[#1a6b2e]",
                  border: "border-[#1a6b2e]",
                  portal: "farmer" as const,
                  action: "Open Farmer App",
                },
                {
                  icon: "🏢",
                  title: "Centre Agent Console",
                  subtitle: "केंद्र एजेंट कंसोल",
                  desc: "Manage bookings, queue, weighment and transaction closing",
                  color: "bg-[#1a3a6b]",
                  border: "border-[#1a3a6b]",
                  portal: "centre" as const,
                  action: "Open Centre Console",
                },
                {
                  icon: "📊",
                  title: "Admin & Audit Console",
                  subtitle: "एडमिन कंसोल",
                  desc: "Platform analytics, farmer/centre management, audit export",
                  color: "bg-[#6d28d9]",
                  border: "border-[#6d28d9]",
                  portal: "admin" as const,
                  action: "Open Admin Console",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className={`bg-white border-2 ${c.border} rounded-lg overflow-hidden shadow-sm gov-card-hover`}
                >
                  <div className={`${c.color} text-white p-5`}>
                    <div className="text-4xl mb-2">{c.icon}</div>
                    <h4 className="font-bold text-lg">{c.title}</h4>
                    <p className="text-white/70 text-sm hindi">{c.subtitle}</p>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-[#4a6080] mb-4 leading-relaxed">{c.desc}</p>
                    <button
                      onClick={() => onPortal(c.portal)}
                      className={`w-full ${c.color} text-white font-semibold py-2.5 rounded text-sm transition-opacity hover:opacity-90`}
                    >
                      {c.action} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* GIGW Footer */}
      <footer className="bg-[#0e2247] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-[#93c5fd] mb-6">
            <div>
              <p className="font-semibold text-white mb-2">KishanSetu</p>
              <p className="mb-1">किसानसेतु Digital Platform</p>
              <p>SIH 2026 Prototype</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Quick Links</p>
              <p className="mb-1 hover:text-white cursor-pointer">Farmer Registration</p>
              <p className="mb-1 hover:text-white cursor-pointer">Centre Locator</p>
              <p className="hover:text-white cursor-pointer">MSP Prices</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Support</p>
              <p className="mb-1 hover:text-white cursor-pointer">Help Center</p>
              <p className="mb-1 hover:text-white cursor-pointer">File Grievance</p>
              <p className="hover:text-white cursor-pointer">RTI</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Technology</p>
              <p className="mb-1">React + FastAPI</p>
              <p className="mb-1">PostgreSQL + PostGIS</p>
              <p>Bhashini · Exotel</p>
            </div>
          </div>
          <div className="border-t border-[#2a5298] pt-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[#6080a0]">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="hover:text-white cursor-pointer">Terms of Use</span>
              <span>·</span>
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span>·</span>
              <span className="hover:text-white cursor-pointer">Accessibility Statement</span>
              <span>·</span>
              <span className="hover:text-white cursor-pointer">Sitemap</span>
              <span>·</span>
              <span className="hover:text-white cursor-pointer">Contact Us</span>
            </div>
            <div className="text-right">
              <p>Last Updated: 08 September 2026</p>
              <p className="mt-0.5">Content Owned by KishanSetu Project Team (SIH 2026 Prototype)</p>
            </div>
          </div>
          <p className="text-center text-[10px] text-[#4a6080] mt-3">
            Best viewed in Chrome/Firefox, 1366×768 resolution · WCAG 2.1 AA Compliant
          </p>
        </div>
      </footer>
    </div>
  );
}
