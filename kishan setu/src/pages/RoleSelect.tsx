import { t } from "../i18n";
import { Lang } from "../auth";

interface Props {
  lang: Lang;
  onFarmer: () => void;
  onAgent: () => void;
}

export default function RoleSelect({ lang, onFarmer, onAgent }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f7fa] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#1a3a6b] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="9" stroke="#d4500a" strokeWidth="1.5"/>
                <path d="M6 11h10M11 6v10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="11" cy="11" r="3" fill="#d4500a"/>
              </svg>
            </div>
            <span className="text-[#1a3a6b] font-bold text-2xl tracking-tight">{t("appName", lang)}</span>
          </div>
          <h2 className="text-xl font-bold text-[#1a3a6b]">Who are you?</h2>
          <p className="text-sm text-gray-500 mt-1">आप कौन हैं? · আপনি কে?</p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={onFarmer}
            className="group relative overflow-hidden bg-white border-2 border-[#1a3a6b] rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-[#d4500a]"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 text-3xl">
                🌾
              </div>
              <div>
                <div className="font-bold text-[#1a3a6b] text-lg">{t("iAmFarmer", lang)}</div>
                <div className="text-sm text-gray-500 mt-1">{t("farmerDesc", lang)}</div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4500a]">
                  {t("login", lang)} / {t("register", lang)} →
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -translate-y-8 translate-x-8 group-hover:bg-green-100 transition-colors" />
          </button>

          <button
            onClick={onAgent}
            className="group relative overflow-hidden bg-white border-2 border-[#1a3a6b] rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-[#d4500a]"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-3xl">
                🏢
              </div>
              <div>
                <div className="font-bold text-[#1a3a6b] text-lg">{t("iAmAgent", lang)}</div>
                <div className="text-sm text-gray-500 mt-1">{t("agentDesc", lang)}</div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4500a]">
                  {t("login", lang)} / {t("register", lang)} →
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -translate-y-8 translate-x-8 group-hover:bg-orange-100 transition-colors" />
          </button>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="text-xs font-semibold text-[#1a3a6b] mb-2">Demo Credentials</div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Farmer: <span className="font-mono font-bold">9876543210</span> → OTP: <span className="font-mono font-bold">123456</span></div>
            <div>Agent: <span className="font-mono font-bold">9988776655</span> → OTP: <span className="font-mono font-bold">123456</span></div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          SIH 2026 · GIGW Compliant · DPDP Act 2023
        </p>
      </div>
    </div>
  );
}
