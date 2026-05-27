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



// Сценарии: X побеждает по диагонали [0,4,8], O побеждает по строке [3,4,5]
const SCENARIOS: Array<{
  moves: Array<{ cell: number; sym: "X" | "O" }>;
  winner: "X" | "O";
  winLine: [number, number]; // от центра до центра в % [x1,y1,x2,y2]
  lineCoords: [number, number, number, number];
}> = [
  {
    moves: [
      { cell: 4, sym: "X" }, { cell: 1, sym: "O" },
      { cell: 0, sym: "X" }, { cell: 3, sym: "O" },
      { cell: 8, sym: "X" },
    ],
    winner: "X",
    winLine: [0, 0, 0, 0],
    lineCoords: [8, 8, 92, 92],
  },
  {
    moves: [
      { cell: 4, sym: "O" }, { cell: 0, sym: "X" },
      { cell: 3, sym: "O" }, { cell: 2, sym: "X" },
      { cell: 5, sym: "O" },
    ],
    winner: "O",
    winLine: [0, 0, 0, 0],
    lineCoords: [8, 50, 92, 50],
  },
  {
    moves: [
      { cell: 6, sym: "X" }, { cell: 0, sym: "O" },
      { cell: 7, sym: "X" }, { cell: 4, sym: "O" },
      { cell: 8, sym: "X" },
    ],
    winner: "X",
    winLine: [0, 0, 0, 0],
    lineCoords: [8, 83, 92, 83],
  },
];

function AnimatedBoard() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [cells, setCells] = useState<Array<"X" | "O" | null>>(Array(9).fill(null));
  const [showLine, setShowLine] = useState(false);

  const scenario = SCENARIOS[scenarioIdx];

  useEffect(() => {
    setCells(Array(9).fill(null));
    setStep(0);
    setShowLine(false);
  }, [scenarioIdx]);

  useEffect(() => {
    if (step < scenario.moves.length) {
      const t = setTimeout(() => {
        const { cell, sym } = scenario.moves[step];
        setCells(prev => { const n = [...prev]; n[cell] = sym; return n; });
        setStep(s => s + 1);
      }, 650);
      return () => clearTimeout(t);
    }
    if (step === scenario.moves.length) {
      const t = setTimeout(() => setShowLine(true), 200);
      return () => clearTimeout(t);
    }
    if (showLine) {
      const t = setTimeout(() => {
        setScenarioIdx(i => (i + 1) % SCENARIOS.length);
      }, 1600);
      return () => clearTimeout(t);
    }
  }, [step, showLine, scenario.moves.length, scenario]);

  const SIZE = 270;
  const [x1, y1, x2, y2] = scenario.lineCoords.map(v => (v / 100) * SIZE);
  const winnerColor = "#f5b731";

  return (
    <div className="relative select-none" style={{ width: SIZE, height: SIZE }}>
      {/* Grid lines */}
      <svg className="absolute inset-0" width={SIZE} height={SIZE}>
        {/* vertical */}
        <line x1={SIZE/3} y1={10} x2={SIZE/3} y2={SIZE-10} stroke="rgba(77,217,240,0.2)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1={SIZE*2/3} y1={10} x2={SIZE*2/3} y2={SIZE-10} stroke="rgba(77,217,240,0.2)" strokeWidth="1.5" strokeLinecap="round" />
        {/* horizontal */}
        <line x1={10} y1={SIZE/3} x2={SIZE-10} y2={SIZE/3} stroke="rgba(77,217,240,0.2)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1={10} y1={SIZE*2/3} x2={SIZE-10} y2={SIZE*2/3} stroke="rgba(77,217,240,0.2)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Win line */}
        {showLine && (
          <line
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={winnerColor}
            strokeWidth="4"
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${winnerColor})`,
              strokeDasharray: 400,
              strokeDashoffset: 0,
              animation: "xo-line 0.45s cubic-bezier(0.4,0,0.2,1) forwards",
            }}
          />
        )}
      </svg>
      {/* Cells */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {cells.map((cell, i) => (
          <div key={i} className="flex items-center justify-center">
            {cell && (
              <span
                className="leading-none"
                style={{
                  fontSize: 62,
                  fontWeight: 900,
                  color: cell === "X" ? "#4dd9f0" : "#f04d6a",
                  textShadow: cell === "X"
                    ? "0 0 22px rgba(77,217,240,0.85)"
                    : "0 0 22px rgba(240,77,106,0.85)",
                  WebkitTextStroke: cell === "O" ? "2px #f04d6a" : undefined,
                  animation: "xo-pop 0.32s cubic-bezier(0.34,1.56,0.64,1) both",
                }}
              >
                {cell === "X" ? "×" : "○"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage({ navigate, onLoginClick, onRegisterClick }: LandingPageProps) {
  const [activeNav, setActiveNav] = useState(0);
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
            <div className="font-black text-sm tracking-widest text-white">КРЕСТИКИ-</div>
            <div className="font-black text-sm tracking-widest" style={{ color: "#4dd9f0" }}>НОЛИКИ</div>
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

            {/* Animated XO board */}
            <div className="flex-1 flex items-center justify-center shrink-0">
              <AnimatedBoard />
            </div>

            {/* Hero text */}
            <div className="flex-1 flex flex-col items-start justify-center">
              <h1 className="font-black text-5xl md:text-6xl leading-none tracking-tight mb-2"
                style={{ color: "#f5b731", textShadow: "0 0 30px #f5b73144" }}>
                БИТВА<br />АРЕНА
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
              МОИ ТУРНИРЫ
            </h3>
            <div className="rounded-lg p-3 mb-2 cursor-pointer hover:brightness-110 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              onClick={() => navigate("pro")}>
              <div className="font-black text-sm text-white mb-0.5">ГЛАВНЫЙ ТУРНИР</div>
              <div className="font-bold text-xs mb-2" style={{ color: "#f5b731" }}>ПРИЗОВОЙ ФОНД $100К</div>
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

    </div>
  );
}