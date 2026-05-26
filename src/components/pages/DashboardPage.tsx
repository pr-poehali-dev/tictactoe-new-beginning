import { type Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface DashboardPageProps {
  navigate: (page: Page) => void;
  coins: number;
}

const statCards = [
  { label: "Всего игр",   value: "142", icon: "Gamepad2",  sub: "+12 эта неделя" },
  { label: "Побед",       value: "89",  icon: "Trophy",    sub: "63% WR" },
  { label: "Поражений",   value: "31",  icon: "X",         sub: "22% RL" },
  { label: "Ничьих",      value: "22",  icon: "Minus",     sub: "15% DR" },
];

const recentMatches = [
  { opponent: "Dragon_Pro", result: "win",  delta: "+18", time: "5 мин назад",  mode: "PvP" },
  { opponent: "Bot (Эксперт)", result: "draw", delta: "+3",  time: "22 мин назад", mode: "ИИ"  },
  { opponent: "Vanya_88",   result: "loss", delta: "−14", time: "1 ч назад",    mode: "PvP" },
  { opponent: "Bot (Любитель)", result: "win", delta: "—",  time: "2 ч назад",  mode: "ИИ"  },
  { opponent: "KingXO",     result: "win",  delta: "+21", time: "вчера",         mode: "PvP" },
];

const achievements = [
  { icon: "🏆", name: "Первая победа",  unlocked: true  },
  { icon: "⚡", name: "5 побед подряд", unlocked: true  },
  { icon: "🎯", name: "Мастер центра",  unlocked: false },
  { icon: "🛡️", name: "Непробиваемый",  unlocked: false },
  { icon: "👑", name: "Чемпион сезона", unlocked: false },
  { icon: "💎", name: "PRO-игрок",      unlocked: false },
];

export default function DashboardPage({ navigate, coins }: DashboardPageProps) {
  const winRate = Math.round((89 / 142) * 100);

  return (
    <div className="min-h-screen pt-20 pb-16 px-5">
      <div className="max-w-6xl mx-auto">

        {/* Profile */}
        <div className="card-premium p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 animate-fade-in">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-xl bg-surface-2 border border-border flex items-center justify-center font-black text-2xl sym-x">
              A
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 mb-1">
              <h1 className="font-black text-xl tracking-tight">Alexxx_Pro</h1>
              <span className="badge-cream">ВЕТЕРАН</span>
            </div>
            <p className="text-muted-foreground text-xs font-medium mb-3">alexxx@mail.ru · с марта 2025</p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Icon name="Star" size={13} className="cream" />
                Elo: <span className="cream font-bold">1 482</span>
              </span>
              <span className="text-muted-foreground">Топ 8% игроков</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-surface-2 border border-border rounded-lg px-4 py-2.5">
              <span className="cream font-bold text-lg leading-none">⬡</span>
              <span className="font-black text-xl">{coins}</span>
              <span className="text-muted-foreground text-xs font-medium">монет</span>
            </div>
            <button onClick={() => navigate("store")} className="text-xs cream hover:underline underline-offset-4 font-semibold">
              Пополнить →
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {statCards.map((s, i) => (
            <div key={i} className="card-premium p-5 animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
              <Icon name={s.icon} size={16} className="text-muted-foreground mb-3" />
              <div className="font-black text-3xl tracking-tight mb-0.5">{s.value}</div>
              <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">{s.label}</div>
              <div className="text-muted-foreground text-xs mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">

          {/* Left column */}
          <div className="flex flex-col gap-4">

            {/* Play button */}
            <button
              onClick={() => navigate("game")}
              className="btn-cream w-full py-8 rounded-xl flex flex-col items-center gap-2 group"
            >
              <Icon name="Play" size={28} />
              <span className="font-black text-lg tracking-tight">Играть</span>
              <span className="text-primary-foreground/60 text-xs font-semibold">Найти соперника</span>
            </button>

            {/* Winrate */}
            <div className="card-premium p-5">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3">Процент побед</div>
              <div className="font-black text-4xl tracking-tight cream mb-3">{winRate}%</div>
              <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
                <div className="h-full bg-cream rounded-full transition-all duration-1000" style={{ width: `${winRate}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
                <span>89 побед</span>
                <span>142 игры</span>
              </div>
            </div>

            {/* Achievements */}
            <div className="card-premium p-5">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3">Достижения</div>
              <div className="grid grid-cols-3 gap-2">
                {achievements.map((a, i) => (
                  <div
                    key={i}
                    title={a.name}
                    className={`rounded-lg p-3 text-center text-2xl transition-all
                      ${a.unlocked
                        ? "bg-cream-subtle border border-cream/20"
                        : "bg-surface-2 border border-border opacity-30"
                      }
                    `}
                  >
                    {a.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Match history */}
            <div className="card-premium overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold text-sm tracking-tight">История матчей</h2>
                <span className="text-xs text-muted-foreground font-medium">Последние 5</span>
              </div>
              <div className="divide-y divide-border">
                {recentMatches.map((m, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center gap-4 hover:bg-surface-2 transition-colors">
                    <div className={`w-1 h-8 rounded-full shrink-0
                      ${m.result === "win" ? "bg-green-500" : m.result === "loss" ? "bg-red-500" : "bg-border"}
                    `} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{m.opponent}</div>
                      <div className="text-xs text-muted-foreground font-medium">{m.mode} · {m.time}</div>
                    </div>
                    <div className={`text-xs font-bold
                      ${m.result === "win" ? "text-green-400" : m.result === "loss" ? "text-red-400" : "text-muted-foreground"}
                    `}>
                      {m.result === "win" ? "Победа" : m.result === "loss" ? "Поражение" : "Ничья"}
                    </div>
                    <div className={`text-xs font-bold w-10 text-right
                      ${m.delta.startsWith("+") ? "cream" : m.delta.startsWith("−") ? "text-red-400" : "text-muted-foreground"}
                    `}>
                      {m.delta}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-border">
                <button className="text-xs cream hover:underline underline-offset-4 font-semibold">
                  Вся история →
                </button>
              </div>
            </div>

            {/* Daily bonus */}
            <div className="card-premium p-4 flex items-center gap-4">
              <div className="text-3xl leading-none">🎁</div>
              <div className="flex-1">
                <div className="font-bold text-sm mb-0.5">Ежедневный бонус</div>
                <div className="text-xs text-muted-foreground font-medium">+10 монет за вход каждый день</div>
              </div>
              <button className="btn-cream text-xs px-4 py-2 shrink-0">
                Забрать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
