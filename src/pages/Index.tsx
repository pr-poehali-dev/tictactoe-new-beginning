import { useState } from "react";
import LandingPage from "@/components/pages/LandingPage";
import DashboardPage from "@/components/pages/DashboardPage";
import GamePage from "@/components/pages/GamePage";
import StorePage from "@/components/pages/StorePage";
import LeaderboardPage from "@/components/pages/LeaderboardPage";
import ProPage from "@/components/pages/ProPage";
import AboutPage from "@/components/pages/AboutPage";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/AuthModal";

export type Page = "landing" | "dashboard" | "game" | "store" | "leaderboard" | "pro" | "about";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authModal, setAuthModal] = useState<"login" | "register" | null>(null);
  const [coins, setCoins] = useState(50);

  const navigate = (page: Page) => {
    if ((page === "dashboard" || page === "game") && !isLoggedIn) {
      setAuthModal("login");
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setAuthModal(null);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("landing");
  };

  return (
    <div className="min-h-screen bg-background">
      {currentPage !== "landing" && (
        <Navigation
          currentPage={currentPage}
          navigate={navigate}
          isLoggedIn={isLoggedIn}
          coins={coins}
          onLogout={handleLogout}
          onAuthClick={() => setAuthModal("login")}
        />
      )}

      <main>
        {currentPage === "landing" && (
          <LandingPage
            navigate={navigate}
            onLoginClick={() => setAuthModal("login")}
            onRegisterClick={() => setAuthModal("register")}
          />
        )}
        {currentPage === "dashboard" && (
          <DashboardPage navigate={navigate} coins={coins} />
        )}
        {currentPage === "game" && (
          <GamePage navigate={navigate} coins={coins} setCoins={setCoins} />
        )}
        {currentPage === "store" && (
          <StorePage coins={coins} setCoins={setCoins} />
        )}
        {currentPage === "leaderboard" && <LeaderboardPage />}
        {currentPage === "pro" && <ProPage />}
        {currentPage === "about" && <AboutPage />}
      </main>

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={handleLogin}
          onSwitch={(m) => setAuthModal(m)}
        />
      )}
    </div>
  );
};

export default Index;
