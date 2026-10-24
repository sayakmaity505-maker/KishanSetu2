import { useState } from "react";
import { useAuth } from "./auth";
import WelcomeSplash from "./pages/WelcomeSplash";
import LanguageSelect from "./pages/LanguageSelect";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FarmerDashboardWeb from "./pages/FarmerDashboardWeb";
import AgentDashboardWeb from "./pages/AgentDashboardWeb";
import AdminConsoleFull from "./pages/AdminConsoleFull";
import DemoVideo from "./pages/DemoVideo";
import { Lang } from "./auth";

// Legacy type kept for old pages still in the codebase
export type Portal = "landing" | "farmer" | "centre" | "admin";

type AppPage = "splash" | "language" | "login" | "register" | "demo" | "admin";

const DEMO_KEY = "ks_demo_shown_";

function hasSeenDemo(userId: string) {
  return localStorage.getItem(DEMO_KEY + userId) === "1";
}
function markDemoSeen(userId: string) {
  localStorage.setItem(DEMO_KEY + userId, "1");
}

export default function App() {
  const { user, lang, setLang, logout } = useAuth();
  const [page, setPage] = useState<AppPage>("splash");
  const [showDemo, setShowDemo] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // When user is logged in and demo not showing, show dashboard
  // (but NOT when on splash page — "Back to Home" must work from dashboards)
  if (user && !showDemo && page !== "admin" && page !== "splash") {
    if (user.role === "farmer") {
      return (
        <FarmerDashboardWeb
          onHome={() => setPage("splash")}
          onLogout={() => { logout(); setPage("login"); }}
        />
      );
    }
    if (user.role === "agent") {
      return (
        <AgentDashboardWeb
          onHome={() => setPage("splash")}
          onLogout={() => { logout(); setPage("login"); }}
        />
      );
    }
  }

  // Demo video — shown once per user after first registration
  if (showDemo) {
    return (
      <DemoVideo
        lang={lang}
        role={user?.role ?? "farmer"}
        onSkip={() => {
          if (user) markDemoSeen(user.id);
          setShowDemo(false);
          setIsNewUser(false);
        }}
      />
    );
  }

  // Admin console
  if (page === "admin") {
    return <AdminConsoleFull onExit={() => setPage("login")} />;
  }

  // Splash screen (entry point)
  if (page === "splash") {
    return (
      <WelcomeSplash
        isLoggedIn={!!user}
        onStart={() => setPage("language")}
        onDashboard={() => setPage("login")}
      />
    );
  }

  // Language selection
  if (page === "language") {
    return (
      <LanguageSelect
        initialLang={lang}
        onSelect={(l: Lang) => {
          setLang(l);
          setPage("login");
        }}
      />
    );
  }

  // Registration
  if (page === "register") {
    return (
      <RegisterPage
        onLogin={() => setPage("login")}
        onBack={() => setPage("login")}
        onComplete={(userId) => {
          setIsNewUser(true);
          // Show demo only if user hasn't seen it before
          if (!hasSeenDemo(userId)) {
            setShowDemo(true);
          }
        }}
      />
    );
  }

  // Login (default for authenticated flow)
  return (
    <LoginPage
      onRegister={() => setPage("register")}
      onAdmin={() => setPage("admin")}
      onBack={() => setPage("splash")}
    />
  );
}
