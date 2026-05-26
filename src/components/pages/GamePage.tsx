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
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
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
    board.forEach((c, i) => {
      if (!c) {
        board[i] = "O";
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    });
    return best;
  } else {
    let best = Infinity;
    board.forEach((c, i) => {
      if (!c) {
        board[i] = "X";
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    });
    return best;
  }
}

function getBotMove(board: Cell[], difficulty: string): number {
  const empty = board.map((c,i) => c === null ? i : -1).filter(i => i !== -1);
  if (difficulty === "ai-easy") {
    // Check win first, otherwise random
    for (const i of empty) {
      const b = [...board]; b[i] = "O";
      if (checkWinner(b).winner === "O") return i;
    }
    return empty[Math.floor(Math.random() * empty.length)];
  }
  if (difficulty === "ai-medium") {
    // Win if possible
    for (const i of empty) {
      const b = [...board]; b[i] = "O";
      if (checkWinner(b).winner === "O") return i;
    }
    // Block player
    for (const i of empty) {
      const b = [...board]; b[i] = "X";
      if (checkWinner(b).winner === "X") return i;
    }
    // With 20% chance make dumb move
    if (Math.random() < 0.2) return empty[Math.floor(Math.random() * empty.length)];
    if (board[4] === null) return 4;
    const corners = [0,2,6,8].filter(i => board[i] === null);
    if (corners.length) return corners[0];
    return empty[Math.floor(Math.random() * empty.length)];
  }
  // Expert: minimax
  let best = -Infinity; let move = empty[0];
  for (const i of empty) {
    const b = [...board]; b[i] = "O";
    const score = minimax(b, false);
    if (score > best) { best = score; move = i; }
  }
  return move;
}

const modeOptions = [
  { id: "ai-easy", label: "Новичок", desc: "Бот делает случайные ходы", icon: "Bot", badge: "БЕСПЛАТНО" },
  { id: "ai-medium", label: "Любитель", desc: "Бот защищается, иногда ошибается", icon: "Bot", badge: "БЕСПЛАТНО" },
  { id: "ai-expert", label: "Эксперт", desc: "Минимакс — нельзя победить", icon: "Cpu", badge: "ВЫЗОВ" },
  { id: "pvp", label: "Быстрая игра", desc: "PvP по рейтингу, 15 сек/ход", icon: "Swords", badge: "+МОНЕТЫ" },
  { id: "friend", label: "С другом", desc: "По ссылке, без рейтинга", icon: "Users", badge: "ДЛЯ ДРУЗЕЙ" },
];

export default function GamePage({ navigate, coins, setCoins }: GamePageProps) {
  const [mode, setMode] = useState<Mode>(null);
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [status, setStatus] = useState<"playing" | "won" | "lost" | "draw">("playing");
  const [winLine, setWinLine] = useState<number[]>([]);
  const [botThinking, setBotThinking] = useState(false);
  const [timer, setTimer] = useState(15);

  const startGame = (selectedMode: Mode) => {
    setMode(selectedMode);
    setBoard(Array(9).fill(null));
    setTurn("X");
    setStatus("playing");
    setWinLine([]);
    setTimer(15);
  };

  const resetGame = () => {
    setMode(null);
    setBoard(Array(9).fill(null));
    setStatus("playing");
    setWinLine([]);
  };

  const makeMove = useCallback((index: number) => {
    if (board[index] || status !== "playing" || botThinking) return;
    const newBoard = [...board];
    newBoard[index] = turn;
    const { winner, line } = checkWinner(newBoard);
    setBoard(newBoard);
    if (winner) {
      setWinLine(line);
      if (winner === "X") {
        setStatus("won");
        if (mode === "pvp") setCoins(coins + 15);
      } else {
        setStatus("lost");
      }
      return;
    }
    if (newBoard.every(c => c !== null)) { setStatus("draw"); return; }
    setTurn(turn === "X" ? "O" : "X");
  }, [board, turn, status, botThinking, mode, coins, setCoins]);

  // Bot move
  useEffect(() => {
    if (!mode || mode === "pvp" || mode === "friend") return;
    if (turn !== "O" || status !== "playing") return;
    setBotThinking(true);
    const delay = mode === "ai-expert" ? 700 : 400;
    const timeout = setTimeout(() => {
      const idx = getBotMove(board, mode);
      const newBoard = [...board];
      newBoard[idx] = "O";
      const { winner, line } = checkWinner(newBoard);
      setBoard(newBoard);
      if (winner) { setWinLine(line); setStatus("lost"); }
      else if (newBoard.every(c => c !== null)) setStatus("draw");
      else setTurn("X");
      setBotThinking(false);
    }, delay);
    return () => clearTimeout(timeout);
  }, [turn, mode, board, status]);

  // PvP timer
  useEffect(() => {
    if (mode !== "pvp" || status !== "playing") return;
    if (timer <= 0) { makeMove(board.findIndex(c => c === null)); return; }
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer, mode, status, board, makeMove]);

  useEffect(() => {
    if (mode === "pvp") setTimer(15);
  }, [turn, mode]);

  if (!mode) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 bg-grid">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-3">Игровая арена</p>
            <h1 className="font-display text-5xl font-bold uppercase">Выбор режима</h1>
          </div>
          <div className="flex flex-col gap-3">
            {modeOptions.map((m, i) => (
              <button
                key={m.id}
                onClick={() => startGame(m.id as Mode)}
                className="glass-card rounded-2xl p-5 flex items-center gap-5 hover:border-primary/40 transition-all group animate-fade-in text-left"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center gold-text group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <Icon name={m.icon} size={24} />
                </div>
                <div className="flex-1">
                  <div className="font-display font-bold uppercase tracking-wide text-lg">{m.label}</div>
                  <div className="text-muted-foreground text-sm">{m.desc}</div>
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full border
                  ${m.badge === "+МОНЕТЫ" ? "gold-text border-primary/30 bg-primary/10" : "text-muted-foreground border-border bg-secondary"}
                `}>
                  {m.badge}
                </div>
              </button>
            ))}
          </div>

          {mode === null && (
            <div className="mt-4 glass-card rounded-xl p-4 border border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                💡 Игры с ботом не приносят монеты. PvP — источник заработка.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const isAI = mode !== "pvp" && mode !== "friend";
  const currentLabel = modeOptions.find(m => m.id === mode)?.label;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <button onClick={resetGame} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <Icon name="ArrowLeft" size={16} />
            Режимы
          </button>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{currentLabel}</div>
          {mode === "pvp" && (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg border-2 transition-colors
              ${timer <= 5 ? "border-red-500 text-red-500" : "border-primary gold-text"}
            `}>
              {timer}
            </div>
          )}
          {mode !== "pvp" && <div className="w-10" />}
        </div>

        {/* Players */}
        <div className="flex items-center justify-between mb-6 animate-fade-in delay-100">
          <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${turn === "X" && status === "playing" ? "bg-primary/15 border border-primary/30" : "border border-transparent"}`}>
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-display font-bold symbol-x text-lg">A</div>
            <div>
              <div className="font-semibold text-sm">Alexxx_Pro</div>
              <div className="text-xs text-muted-foreground">Elo: 1482</div>
            </div>
            <span className="symbol-x font-display font-bold text-xl ml-1">X</span>
          </div>

          <div className="text-muted-foreground font-display font-bold text-sm">VS</div>

          <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${turn === "O" && status === "playing" ? "bg-cyan-900/20 border border-cyan-500/30" : "border border-transparent"}`}>
            <span className="symbol-o font-display font-bold text-xl mr-1">O</span>
            <div className="text-right">
              <div className="font-semibold text-sm">{isAI ? "Бот" : "Соперник"}</div>
              <div className="text-xs text-muted-foreground">{isAI ? currentLabel : "Elo: ~1470"}</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-cyan-900/30 flex items-center justify-center">
              {isAI ? <Icon name="Bot" size={16} className="text-cyan-400" /> : <Icon name="User" size={16} />}
            </div>
          </div>
        </div>

        {/* Board */}
        <div className="relative mb-6 animate-scale-in delay-200">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/8 to-cyan-500/5 blur-2xl" />
          <div className="relative grid grid-cols-3 gap-3 bg-card border border-border p-4 rounded-2xl">
            {board.map((cell, i) => (
              <button
                key={i}
                onClick={() => (mode === "friend" ? true : turn === "X") && makeMove(i)}
                disabled={!!cell || status !== "playing" || (isAI && turn === "O")}
                className={`h-24 sm:h-28 flex items-center justify-center rounded-xl font-display font-bold text-5xl transition-all duration-200 border
                  ${winLine.includes(i)
                    ? "bg-primary/20 border-primary scale-105"
                    : cell
                      ? "bg-secondary border-border cursor-default"
                      : "bg-secondary/60 border-border hover:bg-secondary hover:border-primary/30 hover:scale-[1.02] active:scale-95"
                  }
                `}
              >
                {cell && (
                  <span className={`${cell === "X" ? "symbol-x" : "symbol-o"} animate-scale-in`}>
                    {cell}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="animate-fade-in delay-300">
          {status === "playing" && (
            <div className="text-center text-muted-foreground text-sm">
              {botThinking ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Бот думает...
                </span>
              ) : (
                <span>Ход: <strong className={turn === "X" ? "gold-text" : "text-cyan-400"}>{turn === "X" ? "Вы (X)" : isAI ? "Бот (O)" : "Соперник (O)"}</strong></span>
              )}
            </div>
          )}

          {status !== "playing" && (
            <div className="glass-card rounded-2xl p-6 text-center border border-primary/20">
              <div className="text-4xl mb-3">
                {status === "won" ? "🏆" : status === "lost" ? "😤" : "🤝"}
              </div>
              <h2 className="font-display text-3xl font-bold uppercase mb-2">
                {status === "won" ? "Победа!" : status === "lost" ? "Поражение" : "Ничья"}
              </h2>
              {mode === "pvp" && status === "won" && (
                <p className="gold-text text-sm font-semibold mb-4">+15 монет · +18 рейтинга</p>
              )}
              {mode === "pvp" && status === "lost" && (
                <div className="mb-4">
                  <p className="text-muted-foreground text-sm mb-3">Потеряно -14 рейтинга</p>
                  <button className="flex items-center gap-2 mx-auto text-xs border border-primary/40 gold-text px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors">
                    <Icon name="Play" size={13} />
                    Восстановить рейтинг (смотреть рекламу)
                  </button>
                </div>
              )}
              <div className="flex gap-3 justify-center mt-4">
                <button
                  onClick={() => startGame(mode)}
                  className="bg-primary text-primary-foreground font-display font-bold uppercase tracking-wide px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Ещё раз
                </button>
                <button
                  onClick={resetGame}
                  className="border border-border text-foreground px-6 py-3 rounded-xl hover:bg-secondary transition-colors font-medium"
                >
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
