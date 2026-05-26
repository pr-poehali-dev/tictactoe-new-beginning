import { useState, useEffect, useCallback } from "react";
import { type Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface GamePageProps {
  navigate: (page: Page) => void;
  coins: number;
  setCoins: (c: number) => void;
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
  { id: "ai-easy",   label: "Новичок",      desc: "Бот ошибается — идеально для начала",    icon: "Bot",   tag: "ЛЕГКО" },
  { id: "ai-medium", label: "Любитель",     desc: "Бот защищается, иногда даёт слабину",    icon: "Bot",   tag: "СРЕДНЕ" },
  { id: "ai-expert", label: "Эксперт",      desc: "Минимакс — максимум что вы добьётесь: ничья", icon: "Cpu",   tag: "ВЫЗОВ" },
  { id: "pvp",       label: "Быстрая игра", desc: "PvP по рейтингу, 15 сек на ход",         icon: "Swords", tag: "+МОНЕТЫ" },
  { id: "friend",    label: "С другом",     desc: "По ссылке, без рейтинга",                icon: "Users",  tag: "ДРУЗЬЯ" },
];

export default function GamePage({ navigate, coins, setCoins }: GamePageProps) {
  const [mode, setMode] = useState<Mode>(null);
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [status, setStatus] = useState<"playing" | "won" | "lost" | "draw">("playing");
  const [winLine, setWinLine] = useState<number[]>([]);
  const [botThinking, setBotThinking] = useState(false);
  const [timer, setTimer] = useState(15);

  const startGame = (m: Mode) => {
    setMode(m); setBoard(Array(9).fill(null));
    setTurn("X"); setStatus("playing"); setWinLine([]); setTimer(15);
  };
  const resetGame = () => { setMode(null); setBoard(Array(9).fill(null)); setStatus("playing"); setWinLine([]); };

  const makeMove = useCallback((index: number) => {
    if (board[index] || status !== "playing" || botThinking) return;
    const nb = [...board]; nb[index] = turn;
    const { winner, line } = checkWinner(nb);
    setBoard(nb);
    if (winner) {
      setWinLine(line);
      if (winner === "X") { setStatus("won"); if (mode === "pvp") setCoins(coins + 15); }
      else setStatus("lost");
      return;
    }
    if (nb.every(c => c !== null)) { setStatus("draw"); return; }
    setTurn(turn === "X" ? "O" : "X");
  }, [board, turn, status, botThinking, mode, coins, setCoins]);

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

  useEffect(() => {
    if (mode !== "pvp" || status !== "playing") return;
    if (timer <= 0) { makeMove(board.findIndex(c => c === null)); return; }
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer, mode, status, board, makeMove]);

  useEffect(() => { if (mode === "pvp") setTimer(15); }, [turn, mode]);

  const isAI = mode !== "pvp" && mode !== "friend";
  const modeName = modeOptions.find(m => m.id === mode)?.label;

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
              Игры с ботом не приносят монеты · PvP — источник заработка
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              ${timer <= 5 ? "border-red-500 text-red-500" : "border-border cream"}
            `}>
              {timer}
            </div>
          ) : <div className="w-9" />}
        </div>

        {/* Players */}
        <div className="flex items-center justify-between mb-6 animate-fade-in delay-100">
          <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all border
            ${turn === "X" && status === "playing" ? "border-cream/30 bg-cream-subtle" : "border-transparent"}
          `}>
            <div className="w-8 h-8 rounded-md bg-surface-2 border border-border flex items-center justify-center font-black sym-x text-sm">A</div>
            <div>
              <div className="font-bold text-xs">Alexxx_Pro</div>
              <div className="text-muted-foreground text-[10px] font-medium">Elo 1482</div>
            </div>
            <span className="sym-x font-black text-lg ml-1">×</span>
          </div>

          <span className="text-muted-foreground text-xs font-bold">VS</span>

          <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all border
            ${turn === "O" && status === "playing" ? "border-blue-400/30 bg-blue-950/20" : "border-transparent"}
          `}>
            <span className="sym-o font-black text-lg mr-1">○</span>
            <div className="text-right">
              <div className="font-bold text-xs">{isAI ? "Бот" : "Соперник"}</div>
              <div className="text-muted-foreground text-[10px] font-medium">{isAI ? modeName : "Elo ~1470"}</div>
            </div>
            <div className="w-8 h-8 rounded-md bg-surface-2 border border-border flex items-center justify-center">
              {isAI ? <Icon name="Bot" size={14} className="text-muted-foreground" /> : <Icon name="User" size={14} className="text-muted-foreground" />}
            </div>
          </div>
        </div>

        {/* Board */}
        <div className="relative mb-6 animate-scale-in delay-150">
          <div className="grid grid-cols-3 gap-3 bg-card border border-border p-4 rounded-xl">
            {board.map((cell, i) => (
              <button
                key={i}
                onClick={() => (mode === "friend" || turn === "X") && makeMove(i)}
                disabled={!!cell || status !== "playing" || (isAI && turn === "O")}
                className={`h-24 sm:h-28 flex items-center justify-center rounded-lg border font-black text-5xl transition-all duration-200
                  ${winLine.includes(i)
                    ? "bg-cream-subtle border-cream/30 scale-[1.04]"
                    : cell
                      ? "bg-surface-2 border-border cursor-default"
                      : "bg-secondary border-border hover:bg-surface-3 hover:border-muted-foreground/20 hover:scale-[1.02] active:scale-95"
                  }
                `}
              >
                {cell && (
                  <span className={`${cell === "X" ? "sym-x" : "sym-o"} animate-scale-in`}>{cell}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="animate-fade-in delay-200">
          {status === "playing" && (
            <div className="text-center text-xs text-muted-foreground font-semibold">
              {botThinking ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
                  Бот думает...
                </span>
              ) : (
                <span>Ход: <span className={turn === "X" ? "cream font-bold" : "text-blue-400 font-bold"}>{turn === "X" ? "Вы (×)" : isAI ? "Бот (○)" : "Соперник (○)"}</span></span>
              )}
            </div>
          )}

          {status !== "playing" && (
            <div className="card-premium p-6 text-center">
              <div className="text-4xl mb-3">
                {status === "won" ? "🏆" : status === "lost" ? "😤" : "🤝"}
              </div>
              <h2 className="font-black text-2xl tracking-tight mb-2">
                {status === "won" ? "Победа" : status === "lost" ? "Поражение" : "Ничья"}
              </h2>
              {mode === "pvp" && status === "won" && (
                <p className="cream text-xs font-bold mb-4">+15 монет · +18 рейтинга</p>
              )}
              {mode === "pvp" && status === "lost" && (
                <div className="mb-4">
                  <p className="text-muted-foreground text-xs font-medium mb-3">−14 рейтинга</p>
                  <button className="flex items-center gap-2 mx-auto text-xs border border-border text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg transition-colors font-semibold">
                    <Icon name="Play" size={12} />
                    Восстановить рейтинг (реклама)
                  </button>
                </div>
              )}
              <div className="flex gap-2 justify-center mt-5">
                <button onClick={() => startGame(mode)} className="btn-cream px-6 py-2.5 text-sm">
                  Ещё раз
                </button>
                <button onClick={resetGame} className="btn-ghost px-6 py-2.5 text-sm">
                  Меню
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
