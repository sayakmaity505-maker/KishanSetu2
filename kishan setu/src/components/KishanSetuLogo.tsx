import { useAuth } from "../auth";

// App name in each language
const APP_NAMES: Record<string, { roman: string; native: string }> = {
  en: { roman: "KishanSetu", native: "KishanSetu" },
  hi: { roman: "KishanSetu", native: "किसानसेतु" },
  bn: { roman: "KishanSetu", native: "কিষাণসেতু" },
  ta: { roman: "KishanSetu", native: "கிஷான்சேது" },
  te: { roman: "KishanSetu", native: "కిసాన్సేతు" },
  mr: { roman: "KishanSetu", native: "किसानसेतू" },
  gu: { roman: "KishanSetu", native: "કિસાનસેતુ" },
  pa: { roman: "KishanSetu", native: "ਕਿਸਾਨਸੇਤੂ" },
  kn: { roman: "KishanSetu", native: "ಕಿಸಾನ್ಸೇತು" },
  or: { roman: "KishanSetu", native: "କିଶାନ ସେତୁ" },
  ml: { roman: "KishanSetu", native: "കിഷൻസേതു" },
};

interface LogoProps {
  size?: number;
  variant?: "full" | "mark" | "wordmark";
  light?: boolean;
}

export default function KishanSetuLogo({ size = 48, variant = "full", light = false }: LogoProps) {
  let lang = "en";
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const auth = useAuth();
    lang = auth.lang ?? "en";
  } catch (_) { /* outside provider */ }
  const names = APP_NAMES[lang] ?? APP_NAMES["en"];
  const mark = (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer circle */}
      <circle cx="32" cy="32" r="30" fill="#1a3a6b" />
      <circle cx="32" cy="32" r="28" fill="none" stroke="#d4500a" strokeWidth="1.5" />

      {/* Sun arc at top */}
      <path d="M16 32 Q32 12 48 32" stroke="#f5c842" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Sun rays */}
      <line x1="32" y1="10" x2="32" y2="6" stroke="#f5c842" strokeWidth="2" strokeLinecap="round"/>
      <line x1="22" y1="13" x2="20" y2="9.5" stroke="#f5c842" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="42" y1="13" x2="44" y2="9.5" stroke="#f5c842" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="22" x2="10.5" y2="20" stroke="#f5c842" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="50" y1="22" x2="53.5" y2="20" stroke="#f5c842" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Bridge / setu arc */}
      <path d="M18 40 Q32 30 46 40" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="18" y1="40" x2="18" y2="46" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="32" y1="30" x2="32" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 2"/>
      <line x1="46" y1="40" x2="46" y2="46" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>

      {/* Wheat stalk left */}
      <line x1="22" y1="50" x2="22" y2="36" stroke="#52b788" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="22" cy="33" rx="3" ry="5" fill="#52b788" transform="rotate(-15 22 33)"/>
      <ellipse cx="19" cy="37" rx="2" ry="3.5" fill="#52b788" transform="rotate(-25 19 37)"/>
      <ellipse cx="25" cy="37" rx="2" ry="3.5" fill="#52b788" transform="rotate(25 25 37)"/>

      {/* Wheat stalk right */}
      <line x1="42" y1="50" x2="42" y2="36" stroke="#52b788" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="42" cy="33" rx="3" ry="5" fill="#52b788" transform="rotate(15 42 33)"/>
      <ellipse cx="45" cy="37" rx="2" ry="3.5" fill="#52b788" transform="rotate(25 45 37)"/>
      <ellipse cx="39" cy="37" rx="2" ry="3.5" fill="#52b788" transform="rotate(-25 39 37)"/>

      {/* Ground line */}
      <line x1="14" y1="50" x2="50" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round"/>

      {/* KS monogram hint */}
      <text x="32" y="28" textAnchor="middle" fontSize="6" fontWeight="800" fill="white" fontFamily="'Baloo 2', sans-serif" opacity="0.7">KS</text>
    </svg>
  );

  if (variant === "mark") return mark;

  const [first, second] = names.native.length > 5
    ? [names.native.slice(0, Math.ceil(names.native.length / 2)), names.native.slice(Math.ceil(names.native.length / 2))]
    : ["Kishan", "Setu"];

  if (variant === "wordmark") {
    return (
      <div className="flex flex-col">
        <span className="font-display font-extrabold text-3xl tracking-tight leading-none" style={{ color: light ? "white" : "#1a3a6b" }}>
          {first}<span style={{ color: "#d4500a" }}>{second}</span>
        </span>
        <span className="font-devanagari text-xs tracking-wide mt-0.5" style={{ color: light ? "rgba(255,255,255,0.7)" : "#4a6080" }}>
          {names.native !== "KishanSetu" ? names.native : "किसानसेतु"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {mark}
      <div className="flex flex-col">
        <span className="font-display font-extrabold tracking-tight leading-none" style={{
          fontSize: size * 0.5,
          color: light ? "white" : "#1a3a6b"
        }}>
          {first}<span style={{ color: "#d4500a" }}>{second}</span>
        </span>
        <span className="font-devanagari tracking-wide" style={{
          fontSize: size * 0.22,
          color: light ? "rgba(255,255,255,0.65)" : "#4a6080"
        }}>
          {names.native !== "KishanSetu" ? names.native : "किसानसेतु"}
        </span>
      </div>
    </div>
  );
}
