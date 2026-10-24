import { LANGUAGES } from "../i18n";
import { Lang } from "../auth";

interface Props {
  selected: Lang;
  onSelect: (lang: Lang) => void;
  onContinue: () => void;
}

export default function LanguagePicker({ selected, onSelect, onContinue }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f7fa] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#1a3a6b] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="9" stroke="#d4500a" strokeWidth="1.5"/>
                <path d="M6 11h10M11 6v10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="11" cy="11" r="3" fill="#d4500a"/>
              </svg>
            </div>
            <span className="text-[#1a3a6b] font-bold text-2xl tracking-tight">KishanSetu</span>
          </div>
          <h1 className="text-xl font-semibold text-[#1a3a6b]">Choose Your Language</h1>
          <p className="text-sm text-gray-500 mt-1">अपनी भाषा चुनें · ভাষা বেছে নিন · உங்கள் மொழி</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-2 gap-px bg-gray-100">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onSelect(lang.code)}
                className={`flex flex-col items-center gap-1.5 p-4 bg-white transition-all ${
                  selected === lang.code
                    ? "bg-[#1a3a6b] text-white"
                    : "hover:bg-blue-50"
                }`}
                style={selected === lang.code ? { backgroundColor: "#1a3a6b", color: "#fff" } : {}}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className={`text-sm font-semibold ${selected === lang.code ? "text-white" : "text-[#1a3a6b]"}`}>
                  {lang.native}
                </span>
                <span className={`text-xs ${selected === lang.code ? "text-blue-200" : "text-gray-400"}`}>
                  {lang.name}
                </span>
                {selected === lang.code && (
                  <div className="w-4 h-4 rounded-full bg-[#d4500a] flex items-center justify-center mt-0.5">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onContinue}
          className="mt-6 w-full py-4 bg-[#d4500a] text-white font-bold rounded-xl text-lg shadow hover:bg-[#b84208] transition-colors"
        >
          Continue · जारी रखें · তুমি চালিয়ে যাও
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          SIH 2026 Prototype · किसानसेतु · GIGW Compliant
        </p>
      </div>
    </div>
  );
}
