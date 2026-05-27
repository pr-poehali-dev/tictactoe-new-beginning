import { useState, useEffect, useCallback, useRef } from "react";
import { type Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";
import { type User } from "@/hooks/useAuth";
import FUNCTIONS from "@/lib/api";

interface GamePageProps {
  navigate: (page: Page) => void;
  user: User;
  updateUser: (u: Partial<User>) => void;
}

type Mode = null | "ai-easy" | "ai-medium" | "ai-expert" | "pvp" | "friend";
type Cell = "X" | "O" | null;

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function checkWinner(board: Cell[]): { winner: "X" | "O" | null; line: number[] } {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], line };
  }
  return { winner: null, line: [] };
}

function minimax(board: Cell[], isMax: boolean): number {
  const { winner } = checkWinner(board);
  if (winner === "O") return 10;
  if (winner === "X") return -10;
  if (board.every(c => c !== null)) return 0;
  if (isMax) {
    let best = -Infinity;
    board.forEach((c, i) => { if (!c) { board[i] = "O"; best = Math.max(best, minimax(board, false)); board[i] = null; } });
    return best;
  } else {
    let best = Infinity;
    board.forEach((c, i) => { if (!c) { board[i] = "X"; best = Math.min(best, minimax(board, true)); board[i] = null; } });
    return best;
  }
}

function getBotMove(board: Cell[], difficulty: string): number {
  const empty = board.map((c, i) => c === null ? i : -1).filter(i => i !== -1);
  if (difficulty === "ai-easy") {
    for (const i of empty) { const b = [...board]; b[i] = "O"; if (checkWinner(b).winner === "O") return i; }
    return empty[Math.floor(Math.random() * empty.length)];
  }
  if (difficulty === "ai-medium") {
    for (const i of empty) { const b = [...board]; b[i] = "O"; if (checkWinner(b).winner === "O") return i; }
    for (const i of empty) { const b = [...board]; b[i] = "X"; if (checkWinner(b).winner === "X") return i; }
    if (Math.random() < 0.2) return empty[Math.floor(Math.random() * empty.length)];
    if (board[4] === null) return 4;
    const corners = [0,2,6,8].filter(i => board[i] === null);
    if (corners.length) return corners[0];
    return empty[Math.floor(Math.random() * empty.length)];
  }
  let best = -Infinity; let move = empty[0];
  for (const i of empty) { const b = [...board]; b[i] = "O"; const s = minimax(b, false); if (s > best) { best = s; move = i; } }
  return move;
}

const modeOptions = [
  { id: "ai-easy",   label: "Новичок",      desc: "Бот ошибается — идеально для начала",         icon: "Bot",    tag: "ЛЕГКО"    },
  { id: "ai-medium", label: "Любитель",     desc: "Бот защищается, иногда даёт слабину",         icon: "Bot",    tag: "СРЕДНЕ"   },
  { id: "ai-expert", label: "Эксперт",      desc: "Минимакс — максимум что добьёшься: ничья",    icon: "Cpu",    tag: "ВЫЗОВ"    },
  { id: "pvp",       label: "Быстрая игра", desc: "Онлайн по рейтингу, 15 сек на ход",           icon: "Swords", tag: "+МОНЕТЫ"  },
  { id: "friend",    label: "С другом",     desc: "На одном устройстве, без рейтинга",           icon: "Users",  tag: "ДРУЗЬЯ"   },
];

const OPPONENT_LABEL: Record<string, string> = {
  "ai-easy":   "Bot (Новичок)",
  "ai-medium": "Bot (Любитель)",
  "ai-expert": "Bot (Эксперт)",
  "pvp":       "Opponent",
  "friend":    "Friend",
};

interface FinishResult {
  elo_delta: number;
  new_elo: number;
  coins_earned: number;
  new_coins: number;
  xp_earned: number;
  new_level: number;
  rank: string;
}

export default function GamePage({ navigate, user, updateUser }: GamePageProps) {
  const [mode, setMode]           = useState<Mode>(null);
  const [board, setBoard]         = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn]           = useState<"X" | "O">("X");
  const [status, setStatus]       = useState<"playing" | "won" | "lost" | "draw">("playing");
  const [winLine, setWinLine]     = useState<number[]>([]);
  const [botThinking, setBotThinking] = useState(false);
  const [timer, setTimer]         = useState(15);
  const [finishResult, setFinishResult] = useState<FinishResult | null>(null);
  const [savingResult, setSavingResult] = useState(false);
  const gameStartRef              = useRef<number>(Date.now());

  const startGame = (m: Mode) => {
    setMode(m);
    setBoard(Array(9).fill(null));
    setTurn("X");
    setStatus("playing");
    setWinLine([]);
    setTimer(15);
    setFinishResult(null);
    gameStartRef.current = Date.now();
  };

  const resetGame = () => {
    setMode(null);
    setBoard(Array(9).fill(null));
    setStatus("playing");
    setWinLine([]);
    setFinishResult(null);
  };

  // Сохраняем результат в БД
  const saveResult = useCallback(async (result: "won" | "lost" | "draw", currentMode: Mode) => {
    if (!currentMode) return;
    const token = localStorage.getItem("xo_token");
    if (!token) return;

    setSavingResult(true);
    const duration = Math.round((Date.now() - gameStartRef.current) / 1000);
    try {
      const res = await fetch(FUNCTIONS.game, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          action: "finish",
          mode: currentMode,
          result,
          opponent: OPPONENT_LABEL[currentMode] || "Opponent",
          duration_sec: duration,
        }),
      });
      if (res.ok) {
        const data: FinishResult = await res.json();
        setFinishResult(data);
        updateUser({
          coins: data.new_coins,
          elo: data.new_elo,
          wins:   result === "won"  ? user.wins + 1  : user.wins,
          losses: result === "lost" ? user.losses + 1: user.losses,
          draws:  result === "draw" ? user.draws + 1 : user.draws,
          level: data.new_level,
          rank: data.rank,
        });
      }
    } finally {
      setSavingResult(false);
    }
  }, [user, updateUser]);

  const makeMove = useCallback((index: number) => {
    if (board[index] || status !== "playing" || botThinking) return;
    const nb = [...board]; nb[index] = turn;
    const { winner, line } = checkWinner(nb);
    setBoard(nb);
    if (winner) {
      setWinLine(line);
      const result = winner === "X" ? "won" : "lost";
      setStatus(result);
      return;
    }
    if (nb.every(c => c !== null)) { setStatus("draw"); return; }
    setTurn(turn === "X" ? "O" : "X");
  }, [board, turn, status, botThinking]);

  // Сохраняем при изменении статуса
  useEffect(() => {
    if (status === "playing" || !mode) return;
    saveResult(status as "won" | "lost" | "draw", mode);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ход бота
  useEffect(() => {
    if (!mode || mode === "pvp" || mode === "friend" || turn !== "O" || status !== "playing") return;
    setBotThinking(true);
    const t = setTimeout(() => {
      const nb = [...board]; nb[getBotMove(board, mode)] = "O";
      const { winner, line } = checkWinner(nb);
      setBoard(nb);
      if (winner) { setWinLine(line); setStatus("lost"); }
      else if (nb.every(c => c !== null)) setStatus("draw");
      else setTurn("X");
      setBotThinking(false);
    }, mode === "ai-expert" ? 700 : 400);
    return () => clearTimeout(t);
  }, [turn, mode, board, status]);

  // Таймер PvP
  useEffect(() => {
    if (mode !== "pvp" || status !== "playing") return;
    if (timer <= 0) { makeMove(board.findIndex(c => c === null)); return; }
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer, mode, status, board, makeMove]);

  useEffect(() => { if (mode === "pvp") setTimer(15); }, [turn, mode]);

  const isAI = mode !== "pvp" && mode !== "friend";
  const modeName = modeOptions.find(m => m.id === mode)?.label;

  // --- Экран выбора режима ---
  if (!mode) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-5">
        <div className="max-w-xl mx-auto">
          <div className="mb-10 animate-fade-in">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Игровая арена</p>
            <h1 className="font-black text-4xl tracking-tight">Выбор режима</h1>
          </div>
          <div className="flex flex-col gap-2">
            {modeOptions.map((m, i) => (
              <button
                key={m.id}
                onClick={() => startGame(m.id as Mode)}
                className="card-premium p-4 flex items-center gap-4 hover:border-muted-foreground/30 transition-all text-left group animate-fade-in"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center cream shrink-0 group-hover:border-muted-foreground/40 transition-colors">
                  <Icon name={m.icon} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm mb-0.5">{m.label}</div>
                  <div className="text-muted-foreground text-xs font-medium">{m.desc}</div>
                </div>
                <span className={`shrink-0 ${m.tag === "+МОНЕТЫ" ? "badge-cream" : "badge-muted"}`}>
                  {m.tag}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-surface-2 border border-border">
            <p className="text-xs text-muted-foreground font-medium text-center">
              Победы над ботом тоже приносят монеты · Онлайн-матчи дают Elo
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- Экран игры ---
  return (
    <div className="min-h-screen pt-20 pb-16 px-5">
      <div className="max-w-md mx-auto">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-7 animate-fade-in">
          <button onClick={resetGame} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={14} />
            Режимы
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{modeName}</span>
          {mode === "pvp" ? (
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-base border-2 transition-colors
              ${timer <= 5 ? "border-red-500 text-red-500" : "border-border cream"}`}>
              {timer}
            </div>
          ) : <div className="w-9" />}
        </div>

        {/* Players */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all border
            ${turn === "X" && status === "playing"
              ? "border-cream/30 bg-cream-subtle"
              : "border-transparent bg-transparent"}`}>
            <span className="text-2xl">{user.avatar_emoji}</span>
            <div>
              <div className="font-bold text-xs">{user.login}</div>
              <div className="sym-x font-black text-base leading-none">X</div>
            </div>
          </div>
          <div className="font-black text-muted-foreground text-sm">VS</div>
          <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all border
            ${turn === "O" && status === "playing"
              ? "border-muted-foreground/20 bg-surface-2"
              : "border-transparent bg-transparent"}`}>
            <div className="text-right">
              <div className="font-bold text-xs">{isAI ? "Bot" : "Player 2"}</div>
              <div className="sym-o font-black text-base leading-none text-right">O</div>
            </div>
            <div className="text-2xl">{isAI ? "🤖" : "🎮"}</div>
          </div>
        </div>

        {/* Board */}
        <div className="grid grid-cols-3 gap-2 mb-6 animate-fade-in">
          {board.map((cell, i) => {
            const isWin = winLine.includes(i);
            return (
              <button
                key={i}
                onClick={() => makeMove(i)}
                disabled={!!cell || status !== "playing" || (isAI && turn === "O")}
                className={`aspect-square rounded-xl border-2 flex items-center justify-center text-5xl font-black transition-all duration-150
                  ${cell ? "cursor-default" : "cursor-pointer hover:bg-surface-2"}
                  ${isWin ? "border-cream/50 bg-cream-subtle" : "border-border bg-card"}
                  ${!cell && status === "playing" ? "hover:border-muted-foreground/30" : ""}
                `}
              >
                {cell === "X" && <span className={`sym-x ${isWin ? "cream" : ""}`}>×</span>}
                {cell === "O" && <span className={`sym-o ${isWin ? "" : "opacity-80"}`}>○</span>}
              </button>
            );
          })}
        </div>

        {/* Bot thinking */}
        {botThinking && (
          <div className="text-center text-xs text-muted-foreground font-medium mb-4 animate-pulse">
            Бот думает...
          </div>
        )}

        {/* Result */}
        {status !== "playing" && (
          <div className="card-premium p-6 text-center animate-scale-in">
            <div className="text-4xl mb-3">
              {status === "won" ? "🏆" : status === "lost" ? "💀" : "🤝"}
            </div>
            <div className="font-black text-2xl tracking-tight mb-1">
              {status === "won" ? "Победа!" : status === "lost" ? "Поражение" : "Ничья"}
            </div>

            {/* Rewards */}
            {finishResult && !savingResult && (
              <div className="flex items-center justify-center gap-4 mt-3 mb-4">
                {finishResult.coins_earned > 0 && (
                  <div className="flex items-center gap-1.5 text-sm font-bold cream">
                    <span>⬡</span>
                    <span>+{finishResult.coins_earned} монет</span>
                  </div>
                )}
                {finishResult.elo_delta !== 0 && (
                  <div className={`flex items-center gap-1 text-sm font-bold ${finishResult.elo_delta > 0 ? "text-green-400" : "text-red-400"}`}>
                    <Icon name="TrendingUp" size={14} />
                    <span>{finishResult.elo_delta > 0 ? "+" : ""}{finishResult.elo_delta} Elo</span>
                  </div>
                )}
                {finishResult.xp_earned > 0 && (
                  <div className="flex items-center gap-1 text-sm font-bold text-blue-400">
                    <Icon name="Zap" size={14} />
                    <span>+{finishResult.xp_earned} XP</span>
                  </div>
                )}
              </div>
            )}
            {savingResult && (
              <div className="text-xs text-muted-foreground animate-pulse mt-2 mb-4">Сохраняем результат...</div>
            )}

            <div className="flex gap-2 mt-2">
              <button onClick={() => startGame(mode)} className="flex-1 btn-cream py-2.5 text-sm">
                Реванш
              </button>
              <button onClick={resetGame} className="flex-1 btn-ghost py-2.5 text-sm">
                В меню
              </button>
            </div>
          </div>
        )}

        {/* Status line */}
        {status === "playing" && !botThinking && (
          <div className="text-center text-xs text-muted-foreground font-medium">
            Ход: <span className={turn === "X" ? "cream font-bold" : "font-bold"}>{turn === "X" ? user.login : (isAI ? "Bot" : "Player 2")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
