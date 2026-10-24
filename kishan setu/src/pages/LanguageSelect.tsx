import { useEffect, useState } from "react";
import { LANGUAGES } from "../i18n";
import { Lang } from "../auth";

interface Props {
  initialLang: Lang;
  onSelect: (lang: Lang) => void;
}

function getDeviceLang(): Lang {
  const nav = navigator.language?.split("-")[0] as Lang;
  const supported: Lang[] = ["en","hi","bn","ta","te","mr","gu","pa","kn","or","ml"];
  return supported.includes(nav) ? nav : "en";
}

const LANG_DESCRIPTIONS: Record<Lang, string> = {
  en: "English · United Kingdom & India",
  hi: "हिंदी · उत्तर भारत",
  bn: "বাংলা · পশ্চিমবঙ্গ",
  ta: "தமிழ் · தமிழ்நாடு",
  te: "తెలుగు · ఆంధ్రప్రదేశ్",
  mr: "मराठी · महाराष्ट्र",
  gu: "ગુજરાતી · ગુજરાત",
  pa: "ਪੰਜਾਬੀ · ਪੰਜਾਬ",
  kn: "ಕನ್ನಡ · ಕರ್ನಾಟಕ",
  or: "ଓଡ଼ିଆ · ଓଡ଼ିଶା",
  ml: "മലയാളം · കേരളം",
};

export default function LanguageSelect({ initialLang, onSelect }: Props) {
  const deviceLang = getDeviceLang();
  // Pre-select: previously chosen lang → device lang → en
  const preselect = initialLang || deviceLang;
  const [selected, setSelected] = useState<Lang | null>(null);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSelected(preselect), 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePick(code: Lang) {
    if (advancing) return;
    setSelected(code);
    setAdvancing(true);
    setTimeout(() => onSelect(code), 550);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #faf8f4 0%, #eef2f7 100%)" }}>
      {/* Top band */}
      <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#1a3a6b" }}>
          <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" fill="#1a3a6b"/>
            <path d="M16 32 Q32 18 48 32" stroke="#f5c842" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M20 40 Q32 32 44 40" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="font-display font-bold text-navy text-lg">Kishan<span className="text-saffron">Setu</span></span>
        <span className="font-devanagari text-gray-400 text-sm ml-1">किसानसेतु</span>
      </div>

      {/* Content */}
      <div className={`flex-1 flex flex-col items-center justify-center px-6 py-12 transition-all duration-500 ${advancing ? "opacity-0 scale-98 pointer-events-none" : "opacity-100 scale-100"}`}>
        <div className="max-w-4xl w-full">
          {/* Heading */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
              <span className="text-sm">🌐</span>
              <span className="text-xs font-semibold text-navy">11 Indian Languages Supported</span>
            </div>
            <h1 className="font-display font-extrabold text-navy mb-2" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
              Choose Your Language
            </h1>
            <p className="text-gray-500 text-base">अपनी भाषा चुनें · ভাষা বেছে নিন · உங்கள் மொழி தேர்ந்தெடுக்கவும்</p>
            {deviceLang !== "en" && (
              <div className="mt-3 inline-flex items-center gap-2 text-xs text-saffron bg-orange-50 border border-orange-100 rounded-full px-3 py-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.24a.75.75 0 00-1.1 1.02l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75z" clipRule="evenodd"/></svg>
                Device language detected — <strong>{LANGUAGES.find(l => l.code === deviceLang)?.native}</strong>
              </div>
            )}
          </div>

          {/* Language grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 animate-slide-up delay-100">
            {LANGUAGES.map((lang, i) => {
              const isSelected = selected === lang.code;
              const isDevice = deviceLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handlePick(lang.code)}
                  className={`lang-card rounded-2xl p-4 text-left border-2 transition-all ${isSelected
                    ? "selected border-navy"
                    : isDevice
                    ? "device-lang border-saffron bg-orange-50"
                    : "border-transparent bg-white hover:border-navy/20"
                  }`}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{lang.flag}</span>
                    {isDevice && !isSelected && (
                      <span className="text-[10px] font-bold text-saffron bg-orange-100 px-1.5 py-0.5 rounded-full">DEVICE</span>
                    )}
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-saffron flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={`font-bold text-base leading-tight ${isSelected ? "text-white" : "text-navy"}`}>
                    {lang.native}
                  </div>
                  <div className={`text-xs mt-0.5 ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                    {lang.name}
                  </div>
                  <div className={`text-[10px] mt-1 truncate ${isSelected ? "text-white/50" : "text-gray-300"}`}>
                    {LANG_DESCRIPTIONS[lang.code].split("·")[1]?.trim()}
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-center text-gray-400 text-xs mt-8 animate-slide-up delay-300">
            Tap any language to continue · भाषा चुनने पर अगला पेज अपने आप खुलेगा
          </p>
        </div>
      </div>

      {/* Advancing overlay */}
      {advancing && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ background: "rgba(10,20,50,0.6)", zIndex: 50 }}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-saffron rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-display font-semibold">
              {LANGUAGES.find(l => l.code === selected)?.native}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
