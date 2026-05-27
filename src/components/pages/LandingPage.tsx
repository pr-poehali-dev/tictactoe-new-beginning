import { useState, useEffect } from "react";
import { type Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface LandingPageProps {
  navigate: (page: Page) => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const topPlayers = [
  { rank: 1, name: "VORTEX",   elo: 2840, badge: "🌀" },
  { rank: 2, name: "NOVA",     elo: 2710, badge: "⚡" },
  { rank: 3, name: "SPECTRUM", elo: 2685, badge: "🔮" },
];

const navLinks: { label: string; page: Page | null }[] = [
  { label: "ГЛАВНАЯ",   page: null },
  { label: "РЕЖИМЫ",    page: "game" },
  { label: "ТУРНИРЫ",   page: "pro" },
  { label: "КЛАНЫ",     page: "about" },
  { label: "МАГАЗИН",   page: "store" },
  { label: "ПРОФИЛЬ",   page: "dashboard" },
];

const bottomTabs = [
  { icon: "Users",      label: "Друзья" },
  { icon: "Newspaper",  label: "Новости" },
  { icon: "MessageCircle", label: "Чат" },
];

export default function LandingPage({ navigate, onLoginClick, onRegisterClick }: LandingPageProps) {
  const [activeNav, setActiveNav] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [matchCount, setMatchCount] = useState(1420);
  const [onlineCount, setOnlineCount] = useState(5689);

  useEffect(() => {
    const t = setInterval(() => {
      setMatchCount(v => v + Math.floor(Math.random() * 3));
      setOnlineCount(v => v + Math.floor(Math.random() * 5) - 2);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const handleNav = (idx: number, page: Page | null) => {
    setActiveNav(idx);
    if (page) navigate(page);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden" style={{
      background: "linear-gradient(160deg, hsl(230,45%,7%) 0%, hsl(228,50%,10%) 60%, hsl(225,40%,8%) 100%)"
    }}>

      {/* ─── HEADER ─── */}
      <header className="relative z-50 flex items-center justify-between px-6 py-3 border-b border-white/5"
        style={{ background: "rgba(10,12,30,0.85)", backdropFilter: "blur(12px)" }}>

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("landing")}>
          <div className="relative flex items-center gap-0.5">
            <span className="font-black text-2xl leading-none" style={{ color: "#4dd9f0", textShadow: "0 0 12px #4dd9f088" }}>X</span>
            <span className="font-black text-2xl leading-none" style={{ color: "#f04d6a", textShadow: "0 0 12px #f04d6a88" }}>O</span>
          </div>
          <div className="leading-none">
            <div className="font-black text-sm tracking-widest text-white">NEXUS</div>
            <div className="font-black text-sm tracking-widest" style={{ color: "#4dd9f0" }}>GRID</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((n, i) => (
            <button
              key={i}
              onClick={() => handleNav(i, n.page)}
              className="px-4 py-2 text-xs font-bold tracking-widest transition-all duration-200 rounded"
              style={{
                color: activeNav === i ? "#4dd9f0" : "rgba(180,200,240,0.6)",
                borderBottom: activeNav === i ? "2px solid #4dd9f0" : "2px solid transparent",
                textShadow: activeNav === i ? "0 0 8px #4dd9f066" : "none",
              }}
            >
              {n.label}
            </button>
          ))}
        </nav>

        {/* Auth */}
        <button
          onClick={onRegisterClick}
          className="flex items-center gap-2 px-5 py-2 rounded-full font-black text-xs tracking-widest transition-all duration-200 hover:scale-105"
          style={{
            background: "linear-gradient(90deg, #f5b731, #f08c1a)",
            color: "#0a0c1e",
            boxShadow: "0 0 18px #f5b73155",
          }}
        >
          ВОЙТИ / РЕГИСТРАЦИЯ
          <Icon name="User" size={14} />
        </button>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex flex-1 gap-4 px-4 py-4 max-w-[1400px] mx-auto w-full">

        {/* Left sidebar — quick actions */}
        <div className="hidden lg:flex flex-col gap-2 mt-8">
          {[
            { icon: "X",           color: "#f04d6a" },
            { icon: "RefreshCw",   color: "#4dd9f0" },
            { icon: "Shield",      color: "#4dd9f0" },
            { icon: "Users",       color: "#4dd9f0" },
          ].map((item, i) => (
            <button
              key={i}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Icon name={item.icon} size={16} style={{ color: item.color }} />
            </button>
          ))}
        </div>

        {/* ─── HERO CARD ─── */}
        <div className="flex-1 relative rounded-2xl overflow-hidden min-h-[480px]"
          style={{
            border: "1px solid rgba(77,217,240,0.2)",
            boxShadow: "0 0 40px rgba(77,217,240,0.08), inset 0 0 60px rgba(0,0,0,0.3)",
            background: "rgba(10,14,35,0.8)",
          }}>

          {/* Neon corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none" style={{
            background: "linear-gradient(135deg, rgba(77,217,240,0.3) 0%, transparent 60%)",
          }} />
          <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none" style={{
            background: "linear-gradient(315deg, rgba(240,77,106,0.3) 0%, transparent 60%)",
          }} />

          {/* Slider dots */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
            {[0,1,2,3].map(i => (
              <div key={i} className="rounded-full transition-all" style={{
                width: i === 0 ? 20 : 6, height: 6,
                background: i === 0 ? "#f5b731" : "rgba(255,255,255,0.2)",
              }} />
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center h-full p-6 md:p-10 gap-8">
            {/* Game image */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative">
                <img
                  src="https://cdn.poehali.dev/projects/dfe95798-d875-4edf-a02d-60a24f7901f2/bucket/fb9e95d9-71a5-49ea-905e-e47fe9f2740f.png"
                  alt="Nexus Grid game"
                  className="w-72 md:w-96 object-contain animate-fade-in"
                  style={{
                    filter: "drop-shadow(0 0 30px rgba(77,217,240,0.4))",
                    clipPath: "inset(0 57% 0 0)",
                  }}
                />
              </div>
            </div>

            {/* Hero text */}
            <div className="flex-1 flex flex-col items-start justify-center">
              <h1 className="font-black text-5xl md:text-6xl leading-none tracking-tight mb-2"
                style={{ color: "#f5b731", textShadow: "0 0 30px #f5b73144" }}>
                GRAVITY<br />ARENA
              </h1>
              <p className="text-xs font-bold tracking-widest mb-8"
                style={{ color: "rgba(180,200,240,0.7)" }}>
                БИТВА ГИГАНТОВ | РЕЙТИНГ
              </p>

              <button
                onClick={onRegisterClick}
                className="px-10 py-4 rounded font-black text-sm tracking-widest mb-8 transition-all hover:scale-105 hover:brightness-110 active:scale-95"
                style={{
                  background: "linear-gradient(90deg, #f5b731, #f08c1a)",
                  color: "#0a0c1e",
                  boxShadow: "0 0 30px #f5b73155, 0 4px 16px rgba(0,0,0,0.4)",
                  letterSpacing: "0.12em",
                }}
              >
                ИГРАТЬ СЕЙЧАС
              </button>

              {/* Stats */}
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-[10px] font-bold tracking-widest mb-1"
                    style={{ color: "rgba(180,200,240,0.5)" }}>АКТИВНЫЕ МАТЧИ:</p>
                  <p className="font-black text-2xl" style={{ color: "#fff" }}>
                    {matchCount.toLocaleString("ru")}
                  </p>
                </div>
                <div className="w-px h-10" style={{ background: "rgba(255,255,255,0.1)" }} />
                <div>
                  <p className="text-[10px] font-bold tracking-widest mb-1"
                    style={{ color: "rgba(180,200,240,0.5)" }}>ИГРОКИ ОНЛАЙН:</p>
                  <p className="font-black text-2xl" style={{ color: "#fff" }}>
                    {onlineCount.toLocaleString("ru")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT SIDEBAR ─── */}
        <div className="hidden lg:flex flex-col gap-4 w-72 shrink-0">

          {/* Tournaments */}
          <div className="rounded-xl p-4" style={{
            background: "rgba(10,14,35,0.8)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}>
            <h3 className="font-black text-xs tracking-widest mb-3" style={{ color: "#fff" }}>
              ТУРНИРЫ NEXUS
            </h3>
            <div className="rounded-lg p-3 mb-2 cursor-pointer hover:brightness-110 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              onClick={() => navigate("pro")}>
              <div className="font-black text-sm text-white mb-0.5">NEXUS PRIME</div>
              <div className="font-bold text-xs mb-2" style={{ color: "#f5b731" }}>$100K PRIZE POOL</div>
              <div className="h-1 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full w-3/4" style={{ background: "linear-gradient(90deg,#f04d6a,#f5b731)" }} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold"
                style={{ color: "#f04d6a" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                24 ЧАСА ОСТАЛОСЬ
              </div>
            </div>
            <button onClick={() => navigate("pro")} className="w-full text-xs font-bold py-2 rounded transition-all hover:brightness-110"
              style={{ color: "#4dd9f0", background: "rgba(77,217,240,0.07)", border: "1px solid rgba(77,217,240,0.15)" }}>
              Все турниры →
            </button>
          </div>

          {/* Top Players */}
          <div className="rounded-xl p-4 flex-1" style={{
            background: "rgba(10,14,35,0.8)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}>
            <h3 className="font-black text-xs tracking-widest mb-3" style={{ color: "#fff" }}>
              ТОП ИГРОКОВ
            </h3>
            <div className="flex flex-col gap-2">
              {topPlayers.map(p => (
                <div key={p.rank}
                  className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:brightness-110 transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  onClick={() => navigate("leaderboard")}>
                  <span className="text-xs font-black w-5" style={{
                    color: p.rank === 1 ? "#f5b731" : p.rank === 2 ? "#9ab8d8" : "#cd7f32"
                  }}>#{p.rank}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg shrink-0"
                    style={{ background: "rgba(77,217,240,0.1)", border: "1px solid rgba(77,217,240,0.2)" }}>
                    {p.badge}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-xs text-white truncate">{p.name}</div>
                    <div className="text-[10px]" style={{ color: "rgba(180,200,240,0.5)" }}>Ело {p.elo}</div>
                  </div>
                  <span className="text-xs font-black" style={{
                    color: p.rank === 1 ? "#f5b731" : p.rank === 2 ? "#9ab8d8" : "#cd7f32"
                  }}>#{p.rank}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("leaderboard")} className="w-full text-xs font-bold py-2 mt-2 rounded transition-all hover:brightness-110"
              style={{ color: "#4dd9f0", background: "rgba(77,217,240,0.07)", border: "1px solid rgba(77,217,240,0.15)" }}>
              Полный рейтинг →
            </button>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM BAR ─── */}
      <div className="relative z-50 border-t flex items-center justify-between px-6 py-2"
        style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(8,10,24,0.9)", backdropFilter: "blur(12px)" }}>

        {/* Prev/Next */}
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Icon name="ChevronLeft" size={16} style={{ color: "rgba(180,200,240,0.6)" }} />
          </button>
          <button className="w-9 h-9 rounded flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "rgba(77,217,240,0.12)", border: "1px solid rgba(77,217,240,0.25)" }}>
            <Icon name="Gamepad2" size={16} style={{ color: "#4dd9f0" }} />
          </button>
          <button className="w-9 h-9 rounded flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Icon name="ChevronRight" size={16} style={{ color: "rgba(180,200,240,0.6)" }} />
          </button>
        </div>

        {/* Bottom tabs */}
        <div className="flex items-center gap-6">
          {bottomTabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all"
            >
              <Icon name={tab.icon} size={18} style={{
                color: activeTab === i ? "#4dd9f0" : "rgba(180,200,240,0.4)",
                filter: activeTab === i ? "drop-shadow(0 0 6px #4dd9f0)" : "none",
              }} />
              <span className="text-[10px] font-bold tracking-widest" style={{
                color: activeTab === i ? "#4dd9f0" : "rgba(180,200,240,0.4)",
              }}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Play button */}
        <button
          onClick={() => navigate("game")}
          className="px-6 py-2 rounded font-black text-xs tracking-widest transition-all hover:scale-105"
          style={{
            background: "linear-gradient(90deg,#4dd9f0,#2a7fb8)",
            color: "#0a0c1e",
            boxShadow: "0 0 16px rgba(77,217,240,0.3)",
          }}
        >
          ИГРАТЬ
        </button>
      </div>

    </div>
  );
}
