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
import { useAuth } from "@/hooks/useAuth";

export type Page = "landing" | "dashboard" | "game" | "store" | "leaderboard" | "pro" | "about";

const Index = () => {
  const { user, loading, register, login, logout, updateUser } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [authModal, setAuthModal] = useState<"login" | "register" | null>(null);

  const isLoggedIn = !!user;

  const navigate = (page: Page) => {
    if ((page === "dashboard" || page === "game") && !isLoggedIn) {
      setAuthModal("login");
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = (dailyBonus?: number) => {
    setAuthModal(null);
    setCurrentPage("dashboard");
    if (dailyBonus) {
      setTimeout(() => {
        import("sonner").then(({ toast }) => {
          toast.success(`+${dailyBonus} монет за ежедневный вход!`);
        });
      }, 500);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentPage("landing");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm animate-pulse">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {currentPage !== "landing" && (
        <Navigation
          currentPage={currentPage}
          navigate={navigate}
          isLoggedIn={isLoggedIn}
          coins={user?.coins ?? 0}
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
        {currentPage === "dashboard" && user && (
          <DashboardPage navigate={navigate} user={user} updateUser={updateUser} />
        )}
        {currentPage === "game" && user && (
          <GamePage navigate={navigate} user={user} updateUser={updateUser} />
        )}
        {currentPage === "store" && (
          <StorePage coins={user?.coins ?? 0} setCoins={(c) => updateUser({ coins: c })} />
        )}
        {currentPage === "leaderboard" && <LeaderboardPage />}
        {currentPage === "pro" && <ProPage />}
        {currentPage === "about" && <AboutPage />}
      </main>

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={handleSuccess}
          onSwitch={(m) => setAuthModal(m)}
          onRegister={register}
          onLogin={login}
        />
      )}
    </div>
  );
};

export default Index;
