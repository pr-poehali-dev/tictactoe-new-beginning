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

const navItems: { page: Page; label: string }[] = [
  { page: "dashboard",   label: "Кабинет" },
  { page: "game",        label: "Играть" },
  { page: "store",       label: "Магазин" },
  { page: "leaderboard", label: "Рейтинг" },
  { page: "pro",         label: "PRO" },
  { page: "about",       label: "О игре" },
];

export default function Navigation({ currentPage, navigate, isLoggedIn, coins, onLogout, onAuthClick }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-5 h-full flex items-center justify-between">

          {/* Logo */}
          <button onClick={() => navigate("dashboard")} className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded flex items-center justify-center bg-surface-2 border border-border">
              <span className="sym-x text-sm leading-none font-black">×</span>
            </div>
            <span className="font-black text-sm tracking-tight">
              ХО<span className="cream">·</span>Battle
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map(({ page, label }) => (
              <button
                key={page}
                onClick={() => navigate(page)}
                className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-all duration-150
                  ${currentPage === page
                    ? "bg-surface-3 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                  }
                  ${page === "pro" ? "cream" : ""}
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("store")}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="cream text-sm">⬡</span>
                  <span>{coins}</span>
                </button>
                <div className="w-px h-4 bg-border hidden sm:block" />
                <button onClick={onLogout} className="text-muted-foreground hover:text-foreground transition-colors" title="Выйти">
                  <Icon name="LogOut" size={15} />
                </button>
              </>
            ) : (
              <button onClick={onAuthClick} className="btn-cream text-xs px-4 py-1.5">
                Войти
              </button>
            )}
            <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
              <Icon name={menuOpen ? "X" : "Menu"} size={18} />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-40 bg-background border-b border-border py-2 px-3 flex flex-col gap-0.5 animate-fade-in">
          {navItems.map(({ page, label }) => (
            <button
              key={page}
              onClick={() => { navigate(page); setMenuOpen(false); }}
              className={`flex items-center justify-between px-3 py-2.5 rounded text-sm font-semibold transition-all
                ${currentPage === page ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:text-foreground"}
                ${page === "pro" ? "cream" : ""}
              `}
            >
              {label}
              {currentPage === page && <Icon name="ChevronRight" size={13} className="text-muted-foreground" />}
            </button>
          ))}
          {isLoggedIn && (
            <div className="flex items-center gap-2 px-3 py-2 mt-1 border-t border-border text-sm text-muted-foreground">
              <span className="cream">⬡</span>
              <span className="font-semibold">{coins} монет</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
