import { useEffect, useState } from "react";
import KishanSetuLogo from "../components/KishanSetuLogo";
import { useLang } from "../hooks/useLang";

interface Props { onStart: () => void; isLoggedIn?: boolean; onDashboard?: () => void; }

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${4 + (i * 4.3) % 92}%`,
  duration: `${5 + (i * 1.1) % 7}s`,
  delay: `${(i * 0.6) % 5}s`,
  size: 8 + (i * 3) % 16,
  color: i % 3 === 0 ? "#FF6B00" : i % 3 === 1 ? "#138808" : "#ffffff",
}));

const QUOTES = [
  { text: "Connecting every farmer to fair markets", lang: "English" },
  { text: "हर किसान को उचित मूल्य, हर फसल को सही बाज़ार", lang: "हिंदी" },
  { text: "প্রতিটি কৃষককে ন্যায্য বাজারের সাথে সংযুক্ত করা", lang: "বাংলা" },
  { text: "ஒவ்வொரு விவசாயிக்கும் நியாயமான சந்தை", lang: "தமிழ்" },
  { text: "ప్రతి రైతుకు న్యాయమైన విలువ", lang: "తెలుగు" },
  { text: "प्रत्येक शेतकऱ्याला योग्य बाजार", lang: "मराठी" },
  { text: "દરેક ખેડૂતને ઉચિત ભાવ અને સારું બજાર", lang: "ગુજરાતી" },
  { text: "ਹਰ ਕਿਸਾਨ ਨੂੰ ਸਹੀ ਮੁੱਲ ਅਤੇ ਸਹੀ ਬਾਜ਼ਾਰ", lang: "ਪੰਜਾਬੀ" },
  { text: "ಪ್ರತಿ ರೈತನಿಗೆ ನ್ಯಾಯಯುತ ಮಾರುಕಟ್ಟೆ", lang: "ಕನ್ನಡ" },
  { text: "ପ୍ରତ୍ୟେକ କୃଷକଙ୍କ ପାଇଁ ଉଚିତ ବଜାର", lang: "ଓଡ଼ିଆ" },
  { text: "ഓരോ കർഷകനും ന്യായമായ വില", lang: "മലയാളം" },
];

export default function WelcomeSplash({ onStart, isLoggedIn = false, onDashboard }: Props) {
  const { T } = useLang();
  const [phase, setPhase] = useState<"logo" | "tagline" | "ready">("logo");
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("tagline"), 700);
    const t2 = setTimeout(() => setPhase("ready"), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setQuoteIdx(q => (q + 1) % QUOTES.length), 2600);
    return () => clearInterval(iv);
  }, []);

  const quote = QUOTES[quoteIdx];

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col"
      style={{ background: "linear-gradient(160deg, #000080 0%, #06065e 25%, #0d3d00 65%, #003300 100%)" }}>

      {/* Indian tricolor top stripe */}
      <div className="absolute top-0 left-0 right-0 h-3 flex z-20">
        <div className="flex-1" style={{ background: "#FF6B00" }} />
        <div className="flex-1" style={{ background: "#FFFFFF" }} />
        <div className="flex-1" style={{ background: "#138808" }} />
      </div>
      {/* Bottom stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-3 flex z-20">
        <div className="flex-1" style={{ background: "#138808" }} />
        <div className="flex-1" style={{ background: "#FFFFFF" }} />
        <div className="flex-1" style={{ background: "#FF6B00" }} />
      </div>

      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{ top:"10%", left:"5%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,107,0,0.25) 0%, transparent 70%)" }} />
        <div className="absolute" style={{ bottom:"15%", right:"5%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(19,136,8,0.25) 0%, transparent 70%)" }} />
        <div className="absolute" style={{ top:"30%", left:"35%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)" }} />

        {/* Ashoka Chakra */}
        <div className="absolute" style={{ top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:480, height:480, opacity:0.07 }}>
          <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
            <circle cx="100" cy="100" r="88" fill="none" stroke="white" strokeWidth="3"/>
            <circle cx="100" cy="100" r="10" fill="white"/>
            {Array.from({length:24}, (_, i) => {
              const angle = (i * 360/24) * Math.PI / 180;
              const x2 = 100 + 76 * Math.cos(angle);
              const y2 = 100 + 76 * Math.sin(angle);
              return <line key={i} x1="100" y1="100" x2={x2} y2={y2} stroke="white" strokeWidth="1.5"/>;
            })}
          </svg>
        </div>

        {/* Farm image overlay */}
        <div className="absolute inset-0 opacity-8"
          style={{ backgroundImage:"url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop&auto=format)", backgroundSize:"cover", backgroundPosition:"center", mixBlendMode:"luminosity" }} />

        {/* Floating particles (tricolor) */}
        {PARTICLES.map(p => (
          <div key={p.id} className="absolute bottom-0"
            style={{ left:p.left, width:`${p.size*0.35}px`, height:`${p.size}px`,
              background:p.color, opacity:0.45, borderRadius:"50% 50% 50% 50% / 60% 60% 40% 40%",
              animation:`floatUp ${p.duration} linear ${p.delay} infinite` }} />
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-3xl mx-auto w-full">

        {/* Logo mark */}
        <div className={`mb-6 transition-all duration-600 ${phase === "logo" ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}>
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full blur-2xl scale-150" style={{ background:"rgba(255,107,0,0.35)" }} />
            <KishanSetuLogo size={96} light />
          </div>
        </div>

        {/* Brand name */}
        <div className={`transition-all duration-500 delay-100 ${phase === "logo" ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"}`}>
          <h1 className="font-display font-extrabold text-white leading-none mb-1"
            style={{ fontSize:"clamp(3.5rem,10vw,6.5rem)", letterSpacing:"-0.025em" }}>
            Kishan<span style={{ color:"#FF8C2A" }}>Setu</span>
          </h1>
          <p className="font-devanagari text-white/40 text-xl tracking-[0.3em]">किसानसेतु</p>
        </div>

        {/* Rotating multilingual quote — all 11 languages */}
        <div className={`mt-10 transition-all duration-500 delay-200 ${phase === "ready" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ minHeight: 72 }}>
          <div key={quoteIdx} className="animate-fade-in text-center">
            <p className="text-white/85 text-lg font-light leading-relaxed max-w-md mx-auto"
              style={{ fontFamily: "var(--font-devanagari), var(--font-sans)" }}>
              {quote.text}
            </p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <div className="h-0.5 w-6 rounded-full" style={{ background:"#FF6B00" }} />
              <span className="text-white/25 text-xs tracking-widest">{quote.lang}</span>
              <div className="h-0.5 w-6 rounded-full" style={{ background:"#138808" }} />
            </div>
          </div>
        </div>

        {/* Language dots indicator */}
        <div className={`flex gap-1 mt-4 transition-all duration-500 delay-250 ${phase === "ready" ? "opacity-100" : "opacity-0"}`}>
          {QUOTES.map((_, i) => (
            <div key={i} className="h-1 rounded-full transition-all duration-300"
              style={{ width: i === quoteIdx ? 16 : 4, background: i === quoteIdx ? "#FF6B00" : "rgba(255,255,255,0.25)" }} />
          ))}
        </div>

        {/* Stats */}
        <div className={`mt-10 flex items-center gap-10 sm:gap-16 transition-all duration-500 delay-300 ${phase === "ready" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {[
            { v:"28", l:"States", c:"#FF8C2A" },
            { v:"1.4 Cr", l:"Farmers", c:"#FFFFFF" },
            { v:"₹84 Cr", l:"Disbursed", c:"#2ecc40" },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className="font-display font-extrabold text-2xl sm:text-3xl" style={{ color:s.c }}>{s.v}</div>
              <div className="text-white/35 text-xs mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className={`mt-12 transition-all duration-500 delay-400 ${phase === "ready" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {isLoggedIn ? (
            <button onClick={onDashboard}
              className="group relative inline-flex items-center gap-3 px-12 py-4 rounded-2xl font-display font-bold text-xl text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background:"linear-gradient(135deg,#138808,#1eaf0a)", boxShadow:"0 8px 40px rgba(19,136,8,0.55), inset 0 0 0 1px rgba(255,255,255,0.15)" }}>
              <span>{T("dashboard")}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </button>
          ) : (
            <button onClick={onStart}
              className="group relative inline-flex items-center gap-3 px-12 py-4 rounded-2xl font-display font-bold text-xl text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background:"linear-gradient(135deg,#FF6B00,#FF8C2A)", boxShadow:"0 8px 40px rgba(255,107,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.15)" }}>
              <span>{T("continueBtn")}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </button>
          )}

          {/* Tricolor line under button */}
          <div className="flex justify-center gap-1 mt-5">
            <div className="h-1 w-10 rounded-full" style={{ background:"#FF6B00" }} />
            <div className="h-1 w-10 rounded-full" style={{ background:"rgba(255,255,255,0.6)" }} />
            <div className="h-1 w-10 rounded-full" style={{ background:"#138808" }} />
          </div>
          <p className="text-white/20 text-xs mt-3">Ministry of Agriculture & Farmers Welfare · Government of India</p>
        </div>
      </div>
    </div>
  );
}
