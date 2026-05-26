import { useState } from "react";
import { type Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface NavigationProps {
  currentPage: Page;
  navigate: (page: Page) => void;
  isLoggedIn: boolean;
  coins: number;
  onLogout: () => void;
  onAuthClick: () => void;
}

const navItems: { page: Page; label: string; icon: string }[] = [
  { page: "dashboard", label: "Кабинет", icon: "User" },
  { page: "game", label: "Играть", icon: "Swords" },
  { page: "store", label: "Магазин", icon: "ShoppingBag" },
  { page: "leaderboard", label: "Рейтинг", icon: "Trophy" },
  { page: "pro", label: "PRO", icon: "Star" },
  { page: "about", label: "О игре", icon: "Info" },
];

export default function Navigation({ currentPage, navigate, isLoggedIn, coins, onLogout, onAuthClick }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border glass-card">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <button
          onClick={() => navigate("dashboard")}
          className="font-display text-xl font-bold tracking-wider flex items-center gap-2"
        >
          <span className="symbol-x text-2xl">X</span>
          <span className="text-foreground/80">О</span>
          <span className="gold-text ml-1">Battle</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ page, label, icon }) => (
            <button
              key={page}
              onClick={() => navigate(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5
                ${currentPage === page
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }
                ${page === "pro" ? "gold-text font-semibold" : ""}
              `}
            >
              <Icon name={icon} size={15} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <div className="hidden sm:flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full text-sm">
                <span className="gold-text">⬡</span>
                <span className="font-semibold">{coins}</span>
              </div>
              <button
                onClick={onLogout}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="LogOut" size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={onAuthClick}
              className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Войти
            </button>
          )}

          <button
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 glass-card border-b border-border py-3 px-4 flex flex-col gap-1 animate-fade-in">
          {navItems.map(({ page, label, icon }) => (
            <button
              key={page}
              onClick={() => { navigate(page); setMenuOpen(false); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${currentPage === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}
              `}
            >
              <Icon name={icon} size={16} />
              {label}
            </button>
          ))}
          {isLoggedIn && (
            <div className="flex items-center gap-2 px-3 py-2 mt-1 border-t border-border">
              <span className="gold-text">⬡</span>
              <span className="font-semibold text-sm">{coins} монет</span>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
