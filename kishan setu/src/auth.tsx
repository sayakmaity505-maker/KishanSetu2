import { createContext, useContext, useState, ReactNode } from "react";

export type Lang =
  | "en" | "hi" | "bn" | "ta" | "te"
  | "mr" | "gu" | "pa" | "kn" | "or" | "ml";

export interface FarmerUser {
  role: "farmer";
  id: string;
  name: string;
  phone: string;
  aadhaarMasked: string;
  state: string;
  district: string;
  block: string;
  village: string;
  lat?: number | null;
  lng?: number | null;
  farmerId: string;
  bankMasked: string;
  ifscMasked: string;
  panMasked: string;
  kycStatus: "verified" | "pending";
  digilockerVerified?: boolean;
  verifiedDocuments?: string[];
  dbtLinked: boolean;
  kisanCard: string;
  landAcres: number;
  registeredAt: string;
}

export interface AgentUser {
  role: "agent";
  id: string;
  name: string;
  phone: string;
  aadhaarMasked: string;
  centreName: string;
  centreType: "govt" | "private";
  state: string;
  district: string;
  block: string;
  address: string;
  pincode: string;
  lat: number | null;
  lng: number | null;
  documentsStatus: "pending" | "under_review" | "verified";
  registeredAt: string;
}

export type AppUser = FarmerUser | AgentUser;

interface AuthCtx {
  user: AppUser | null;
  lang: Lang;
  langChosen: boolean;
  setLang: (l: Lang) => void;
  login: (u: AppUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

const LS_USER = "ks_v2_user";
const LS_LANG = "ks_v2_lang";
const LS_LANG_CHOSEN = "ks_v2_lang_chosen";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const s = localStorage.getItem(LS_USER);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem(LS_LANG) as Lang) || "en";
  });

  const [langChosen, setLangChosen] = useState<boolean>(() => {
    return localStorage.getItem(LS_LANG_CHOSEN) === "1";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    setLangChosen(true);
    localStorage.setItem(LS_LANG, l);
    localStorage.setItem(LS_LANG_CHOSEN, "1");
  };

  const login = (u: AppUser) => {
    setUser(u);
    localStorage.setItem(LS_USER, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LS_USER);
  };

  return (
    <AuthContext.Provider value={{ user, lang, langChosen, setLang, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
