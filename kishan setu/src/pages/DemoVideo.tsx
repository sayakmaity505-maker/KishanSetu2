import { useEffect, useRef, useState } from "react";
import KishanSetuLogo from "../components/KishanSetuLogo";
import { FARMER_SCENE_TEXT, AGENT_SCENE_TEXT } from "../i18n";
import type { Lang } from "../auth";
import { useBhashiniVoice } from "../hooks/useBhashiniVoice";
import { BHASHINI_LANGUAGE } from "../services/bhashini";

interface Props { onSkip: () => void; lang?: string; role?: "farmer" | "agent"; }

interface Scene {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  voiceText: string;
  bg: string;
  visual: React.ReactNode;
}

const scenes: Scene[] = [
  {
    id: 0,
    title: "Welcome to KishanSetu",
    subtitle: "India's Smart Agricultural Gateway",
    emoji: "🌾",
    voiceText: "Welcome to Kishan Setu — India's smart agricultural gateway. We connect farmers directly with government-verified procurement centres, ensuring fair prices and transparent payments.",
    bg: "linear-gradient(135deg, #060f24, #1a3a6b)",
    visual: (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-saffron/20 blur-3xl scale-150" />
          <div className="text-9xl">🌾</div>
        </div>
        <div className="flex gap-12 text-center">
          {[["28","States"],["1.4 Cr","Farmers"],["6,200+","Centres"],["₹84 Cr","Paid"]].map(([v,l]) => (
            <div key={l}><div className="font-display font-bold text-white text-2xl">{v}</div><div className="text-white/40 text-xs mt-1">{l}</div></div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 1,
    title: "Register in Minutes",
    subtitle: "Simple phone OTP — no paperwork",
    emoji: "📱",
    voiceText: "Registering on Kishan Setu takes only a few minutes. Enter your mobile number, verify with a one-time password, fill in your Aadhaar, bank account, and land details — and you're ready. Your Aadhaar is always stored masked for your security.",
    bg: "linear-gradient(135deg, #0f2a50, #1a4a30)",
    visual: (
      <div className="flex items-center justify-center h-full">
        <div className="w-72 bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-navy p-4 text-white text-center">
            <div className="text-sm font-semibold">KishanSetu · Registration</div>
          </div>
          <div className="p-5 space-y-3">
            <div className="text-xs font-bold text-navy uppercase tracking-wide">Step 1 of 5 · Phone Verification</div>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
              <span>🇮🇳</span>
              <span className="font-mono text-navy">+91 98765 43210</span>
              <div className="ml-auto w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="bg-saffron/10 rounded-xl p-3 border border-saffron/30">
              <div className="text-center font-mono font-bold text-navy text-2xl tracking-widest">1 2 3 4 5 6</div>
            </div>
            <div className="bg-navy rounded-xl p-3 text-white text-center text-sm font-bold">OTP Verified ✓</div>
            <div className="flex gap-2 text-xs text-gray-400 items-center">
              <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Aadhaar stored masked for security
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Find Nearby Centres",
    subtitle: "AI-powered centre discovery by harvest date",
    emoji: "📍",
    voiceText: "Once registered, the platform uses AI to find the best procurement centres near your village. Enter your crop type and expected harvest date — and Kishan Setu shows you the nearest centres with available slots, real-time queue status, and MSP rates.",
    bg: "linear-gradient(135deg, #1a2a50, #0f3a2a)",
    visual: (
      <div className="flex items-center justify-center h-full">
        <div className="w-80 space-y-3">
          <div className="bg-white rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center text-white text-xs">📍</div>
              <span className="font-semibold text-navy text-sm">Nearest Centres — Wheat · 2.5 Q</span>
            </div>
            {[
              { name: "State Agri Warehouse", dist: "1.2 km", queue: "6 farmers", msp: "₹2,275/Q", type: "Govt" },
              { name: "UP Grain Centre", dist: "3.8 km", queue: "2 farmers", msp: "₹2,275/Q", type: "Private" },
            ].map(c => (
              <div key={c.name} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-sm">🏛</div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-navy">{c.name}</div>
                  <div className="text-xs text-gray-400">{c.dist} · {c.queue}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-green-700">{c.msp}</div>
                  <div className="text-[10px] text-gray-300">{c.type}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-saffron/10 border border-saffron/30 rounded-2xl p-3 text-xs text-center font-semibold text-saffron">
            🤖 AI suggests: Book slot at State Agri Warehouse for 15 Sep
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Digital Procurement & Weighment",
    subtitle: "Real-time bills generated at the centre",
    emoji: "⚖️",
    voiceText: "At the procurement centre, your crop is weighed digitally. The agent verifies your booking, records actual quantity and quality grade, applies any deductions, and instantly generates a digital bill. No manual paperwork — everything is traceable.",
    bg: "linear-gradient(135deg, #2a1a50, #1a3a6b)",
    visual: (
      <div className="flex items-center justify-center h-full">
        <div className="w-80 bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-saffron p-3 text-center">
            <div className="font-display font-bold text-navy text-sm">PROCUREMENT BILL</div>
            <div className="text-navy/60 text-[10px]">KishanSetu · State Agri Warehouse · 15 Sep 2026</div>
          </div>
          <div className="p-4 space-y-2 text-xs">
            {[
              ["Farmer", "Ramesh Kumar · KF-543210"],
              ["Crop", "Wheat (GW-322)"],
              ["Booked Qty", "2.50 Quintal"],
              ["Actual Qty", "2.48 Quintal"],
              ["Quality Grade", "A+ · Moisture 12%"],
              ["MSP Rate", "₹2,275 / Quintal"],
              ["Gross Amount", "₹5,642.00"],
              ["Quality Deduction", "−₹42.00"],
              ["Net Payable", "₹5,600.00"],
            ].map(([k,v]) => (
              <div key={k as string} className={`flex justify-between py-1 ${k === "Net Payable" ? "border-t border-gray-200 font-bold text-navy text-sm pt-2 mt-1" : "border-b border-gray-50 text-gray-500"}`}>
                <span>{k}</span><span className={k === "Net Payable" ? "text-green-700" : "text-navy font-medium"}>{v}</span>
              </div>
            ))}
            <div className="bg-green-50 border border-green-200 rounded-xl p-2 text-center text-green-700 font-semibold mt-2">
              ✓ PFMS Transfer Initiated · UTR: SBI2026091500891
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Direct Bank Payment",
    subtitle: "PFMS/DBT — no middlemen, no delay",
    emoji: "💰",
    voiceText: "Payment is transferred directly to your registered bank account through the government's PFMS system — the Public Financial Management System. No middlemen, no cash handling. You receive the full net amount within 48 hours, with a unique UTR reference number.",
    bg: "linear-gradient(135deg, #0a2a1a, #1a4a30)",
    visual: (
      <div className="flex items-center justify-center h-full">
        <div className="w-80 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-xl text-center">
            <div className="text-4xl mb-3">🏦</div>
            <div className="text-gray-400 text-xs mb-1">Payment Received</div>
            <div className="font-display font-bold text-4xl text-green-700">₹5,600</div>
            <div className="text-gray-400 text-xs mt-2">State Bank of India · XXXXXXXX4821</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
              <div className="text-lg mb-1">⚡</div>
              <div className="text-xs font-bold text-navy">PFMS Verified</div>
              <div className="text-[10px] text-gray-400">Government rails</div>
            </div>
            <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
              <div className="text-lg mb-1">🔒</div>
              <div className="text-xs font-bold text-navy">DBT Linked</div>
              <div className="text-[10px] text-gray-400">Direct to bank</div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-center">
            <div className="text-[10px] text-gray-400 mb-0.5">PFMS UTR Reference</div>
            <div className="font-mono text-xs font-bold text-navy">SBI2026091500891</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "AI Voice Support — 11 Languages",
    subtitle: "Bhashini-powered multilingual assistance",
    emoji: "🎙️",
    voiceText: "KishanSetu supports 11 Indian languages with Bhashini-powered voice AI. Ask questions in Hindi, Tamil, Telugu, Bengali, Marathi, or any supported language — and the platform responds in your language. Accessible to every farmer across India.",
    bg: "linear-gradient(135deg, #2a0a3a, #1a1a6b)",
    visual: (
      <div className="flex items-center justify-center h-full">
        <div className="w-80 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white text-lg">🤖</div>
              <div>
                <div className="font-semibold text-navy text-sm">KishanSetu AI</div>
                <div className="text-xs text-green-500">● Online · 11 Languages</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-2xl rounded-tl-none p-3 text-xs text-gray-700 font-devanagari">
                "मेरी गेहूं की बुकिंग कब है?"
              </div>
              <div className="bg-navy rounded-2xl rounded-tr-none p-3 text-xs text-white ml-8">
                आपकी अगली बुकिंग 15 सितंबर को State Agri Warehouse पर सुबह 9 बजे है। Slot: A-03
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            {["हिंदी","বাংলা","தமிழ்","తెలుగు","मराठी","ਪੰਜਾਬੀ"].map(l => (
              <span key={l} className="text-xs bg-white/10 text-white px-2 py-1 rounded-full border border-white/20">{l}</span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

const AGENT_SCENES: Scene[] = [
  { id:0, title:"KishanSetu — Procurement Agent Portal", subtitle:"Your Digital Procurement Command Centre", emoji:"🏢", bg:"linear-gradient(135deg,#000080,#FF6B00 60%,#138808)",
    voiceText:"Welcome to KishanSetu's Procurement Agent Portal. This is your digital command centre for managing farmer procurement operations, document verification, and PFMS payments.",
    visual: <div className="flex flex-col items-center justify-center h-full"><div className="text-7xl mb-6">🏛️</div><div className="grid grid-cols-3 gap-4 text-center">{[["👥","Manage Queue"],["📋","Verify Docs"],["💰","PFMS Bills"]].map(([e,l])=><div key={l as string}><div className="text-3xl">{e}</div><div className="text-white/60 text-xs mt-1">{l}</div></div>)}</div></div>,
  },
  { id:1, title:"Farmer Queue Management", subtitle:"Accept, verify, and process farmers", emoji:"👥", bg:"linear-gradient(135deg,#000080,#06065e)",
    voiceText:"When farmers book slots through KishanSetu, they appear in your live queue. You can click on any farmer to view their documents, verify their identity, and accept or reject their procurement request.",
    visual: <div className="space-y-2 w-full max-w-sm mx-auto">{[["Ramesh Kumar","Wheat · 2.5Q","✓ Verified","waiting"],["Suman Devi","Rice · 1.8Q","Pending","waiting"],["Mohan Lal","Maize · 3.2Q","✓ Verified","in-progress"]].map(([n,c,k,s])=><div key={n as string} className="bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between"><div><div className="text-white font-bold text-sm">{n}</div><div className="text-white/60 text-xs">{c}</div></div><span className="text-xs font-bold px-2 py-1 rounded-full" style={{background:s==="in-progress"?"#FF6B00":"rgba(255,255,255,0.2)",color:"white"}}>{s}</span></div>)}</div>,
  },
  { id:2, title:"Document Verification", subtitle:"Aadhaar, Land Record, Bank — all in one place", emoji:"📋", bg:"linear-gradient(135deg,#003300,#138808)",
    voiceText:"Click on any farmer to view their complete document verification status. You can see Aadhaar, land records, bank details, and Kisan card verification. Flag suspicious documents for admin reverification, which temporarily suspends the farmer's account.",
    visual: <div className="w-full max-w-sm mx-auto space-y-2">{[["🪪 Aadhaar Card","verified"],["📜 Land Record","verified"],["🏦 Bank Passbook","pending"],["💳 Kisan Card","missing"]].map(([d,s])=><div key={d as string} className="bg-white/10 rounded-xl px-4 py-2 flex items-center justify-between"><span className="text-white text-sm">{d}</span><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s==="verified"?"bg-green-500 text-white":s==="pending"?"bg-yellow-400 text-black":"bg-red-500 text-white"}`}>{s}</span></div>)}</div>,
  },
  { id:3, title:"GPS Farmer Request Map", subtitle:"See where every farmer is requesting from", emoji:"🗺️", bg:"linear-gradient(135deg,#000080,#004d00)",
    voiceText:"The Request Map shows you exactly where each farmer is located on a live map of India. Farmer dots appear in colour based on their status — blue for pending, green for accepted, orange for in-progress, and red for rejected.",
    visual: <div className="flex items-center justify-center h-full"><div className="relative w-52 h-40 rounded-2xl overflow-hidden border-2 border-white/20" style={{background:"linear-gradient(160deg,#000080,#138808)"}}><div className="absolute inset-0 text-white/20 flex items-center justify-center text-xs">India Map</div>{[{top:"50%",left:"50%",c:"#FF6B00",l:"Centre"},{top:"35%",left:"45%",c:"#60a5fa",l:""},{top:"60%",left:"55%",c:"#2ecc40",l:""}].map((d,i)=><div key={i} className="absolute w-3 h-3 rounded-full border-2 border-white" style={{top:d.top,left:d.left,background:d.c,transform:"translate(-50%,-50%)"}}/>)}</div></div>,
  },
  { id:4, title:"Generate Bills & PFMS Transfer", subtitle:"One click from weighment to payment", emoji:"🧾", bg:"linear-gradient(135deg,#003300,#138808 50%,#000080)",
    voiceText:"After weighing the farmer's produce, enter the actual quantity and quality grade. KishanSetu automatically calculates the MSP payment and generates a PFMS bill. The payment is transferred directly to the farmer's bank account — no cash, no middlemen.",
    visual: <div className="w-full max-w-sm mx-auto bg-white/10 rounded-2xl p-4 space-y-2">{[["Farmer","Ramesh Kumar"],["Crop","Wheat · 2.48 Q"],["Rate","₹2,585/Q"],["Gross","₹6,411"],["Net Payable","₹6,160"]].map(([k,v])=><div key={k as string} className="flex justify-between text-sm"><span className="text-white/60">{k}</span><span className={`font-bold ${k==="Net Payable"?"text-green-400":"text-white"}`}>{v}</span></div>)}<div className="pt-2 border-t border-white/20 text-center text-xs text-white/40">PFMS Transfer Initiated ✓</div></div>,
  },
];

export default function DemoVideo({ onSkip, lang = "en", role = "farmer" }: Props) {
  const safeLang = (lang as Lang) in FARMER_SCENE_TEXT ? (lang as Lang) : "en";
  const rawScenes = role === "agent" ? AGENT_SCENES : scenes;
  const sceneTexts = role === "agent" ? AGENT_SCENE_TEXT[safeLang] : FARMER_SCENE_TEXT[safeLang];

  // Merge translated text over the original visual/emoji/bg
  const activeScenes = rawScenes.map((s, i) => ({
    ...s,
    title: sceneTexts[i]?.title ?? s.title,
    subtitle: sceneTexts[i]?.subtitle ?? s.subtitle,
    voiceText: sceneTexts[i]?.voiceText ?? s.voiceText,
  }));

  const [sceneIdx, setSceneIdx] = useState(0);
  const [voiceActive, setVoiceActive] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scene = activeScenes[sceneIdx];
  const progress = ((sceneIdx) / (activeScenes.length - 1)) * 100;
  const { speak, stop, status: voiceStatus, provider } = useBhashiniVoice(safeLang);

  useEffect(() => {
    if (voiceActive) void speak(scene.voiceText);
    else stop();
    return stop;
  }, [scene.voiceText, speak, stop, voiceActive]);

  useEffect(() => {
    if (!autoPlay) return;
    timerRef.current = setTimeout(() => {
      if (sceneIdx < activeScenes.length - 1) setSceneIdx(i => i + 1);
      else onSkip();
    }, 7000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [sceneIdx, autoPlay]);

  function goTo(idx: number) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAutoPlay(false);
    setSceneIdx(idx);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: scene.bg, transition: "background 0.8s ease" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <KishanSetuLogo size={40} light />
        <div className="flex items-center gap-4">
          <button onClick={() => setVoiceActive(v => !v)}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
            {voiceActive ? "🔊" : "🔇"} <span className="text-xs">{BHASHINI_LANGUAGE[safeLang].native} · {voiceActive ? "Voice On" : "Voice Off"}</span>
          </button>
          <button onClick={onSkip}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all">
            Skip Demo →
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="px-8 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="demo-progress-bar h-full rounded-full transition-all duration-700"
              style={{ width: `${((sceneIdx + 1) / activeScenes.length) * 100}%` }} />
          </div>
          <span className="text-white/40 text-xs">{sceneIdx + 1} / {activeScenes.length}</span>
        </div>
        <div className="flex gap-2 mt-2">
          {activeScenes.map((s, i) => (
            <button key={s.id} onClick={() => goTo(i)}
              className={`h-1 flex-1 rounded-full transition-all ${i <= sceneIdx ? "bg-saffron" : "bg-white/15"}`} />
          ))}
        </div>
      </div>

      {/* Scene */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 px-8 py-8">
        {/* Text side */}
        <div className="max-w-md">
          <div key={sceneIdx} className="page-enter">
            <div className="text-5xl mb-5">{scene.emoji}</div>
            <h2 className="font-display font-extrabold text-white text-4xl leading-tight mb-3">{scene.title}</h2>
            <p className="text-white/60 text-lg leading-relaxed">{scene.subtitle}</p>

            <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white/50 leading-relaxed">
              {voiceActive && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="demo-player">
                    {[1,2,3,4,5].map(b => <div key={b} className="voice-bar" style={{ animationDelay: `${b*0.15}s`, height: `${8 + (b*5)%16}px` }} />)}
                  </div>
                  <span className="text-white/30 text-[10px]">
                    {voiceStatus === "speaking" ? "AI Voice Narration Active" : "Narration ready"}
                    {provider === "bhashini" ? " · Bhashini Cloud" : provider === "device" ? " · Device voice" : ""}
                  </span>
                </div>
              )}
              {scene.voiceText}
            </div>
          </div>
        </div>

        {/* Visual side */}
        <div className="w-full max-w-md h-96 lg:h-[480px]" key={sceneIdx + "-visual"}>
          <div className="page-enter h-full">
            {scene.visual}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between px-8 py-5 border-t border-white/10">
        <button onClick={() => goTo(Math.max(0, sceneIdx - 1))}
          disabled={sceneIdx === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold disabled:opacity-30 transition-all">
          ← Previous
        </button>

        <div className="flex items-center gap-2">
          {activeScenes.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === sceneIdx ? "bg-saffron w-6" : "bg-white/30"}`} />
          ))}
        </div>

        {sceneIdx < activeScenes.length - 1 ? (
          <button onClick={() => goTo(sceneIdx + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
            style={{ background: "linear-gradient(135deg,#d4500a,#f06422)" }}>
            Next → <span className="text-white/60 text-xs">{activeScenes[sceneIdx + 1].title}</span>
          </button>
        ) : (
          <button onClick={onSkip}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all"
            style={{ background: "linear-gradient(135deg,#52b788,#3a8a5a)", boxShadow: "0 4px 16px rgba(82,183,136,0.4)" }}>
            ✓ Get Started →
          </button>
        )}
      </div>
    </div>
  );
}
