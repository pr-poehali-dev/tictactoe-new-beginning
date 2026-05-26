import { type Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface DashboardPageProps {
  navigate: (page: Page) => void;
  coins: number;
}

const stats = [
  { label: "Всего игр", value: "142", icon: "Gamepad2", color: "text-blue-400" },
  { label: "Побед", value: "89", icon: "Trophy", color: "text-yellow-400" },
  { label: "Поражений", value: "31", icon: "X", color: "text-red-400" },
  { label: "Ничьих", value: "22", icon: "Minus", color: "text-gray-400" },
];

const recentMatches = [
  { opponent: "Dragon_Pro", result: "win", rating: "+18", time: "5 мин назад", mode: "PvP" },
  { opponent: "Bot (Эксперт)", result: "draw", rating: "+3", time: "22 мин назад", mode: "ИИ" },
  { opponent: "Vanya_88", result: "loss", rating: "-14", time: "1 ч назад", mode: "PvP" },
  { opponent: "Bot (Любитель)", result: "win", rating: "—", time: "2 ч назад", mode: "ИИ" },
  { opponent: "KingXO", result: "win", rating: "+21", time: "вчера", mode: "PvP" },
];

const achievements = [
  { icon: "🏆", name: "Первая победа", unlocked: true },
  { icon: "⚡", name: "5 побед подряд", unlocked: true },
  { icon: "🎯", name: "Мастер центра", unlocked: false },
  { icon: "🛡️", name: "Непробиваемый", unlocked: false },
  { icon: "👑", name: "Чемпион сезона", unlocked: false },
  { icon: "💎", name: "PRO-игрок", unlocked: false },
];

export default function DashboardPage({ navigate, coins }: DashboardPageProps) {
  const winRate = Math.round((89 / 142) * 100);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Profile Header */}
        <div className="glass-card rounded-2xl p-6 mb-6 animate-fade-in flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center text-3xl font-display font-bold symbol-x border border-primary/30">
              А
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-background" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="font-display text-2xl font-bold uppercase">Alexxx_Pro</h1>
              <span className="text-xs bg-primary/20 gold-text border border-primary/30 px-2.5 py-0.5 rounded-full font-semibold">Ветеран</span>
            </div>
            <div className="text-muted-foreground text-sm">alexxx@mail.ru · Играет с марта 2025</div>
            <div className="flex flex-wrap gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-sm">
                <Icon name="Star" size={14} className="gold-text" />
                <span className="font-bold">Elo: <span className="gold-text">1 482</span></span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Icon name="TrendingUp" size={14} />
                <span>Топ 8% игроков</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2 bg-secondary border border-border rounded-xl px-4 py-2">
              <span className="gold-text text-lg">⬡</span>
              <span className="font-display font-bold text-xl">{coins}</span>
              <span className="text-muted-foreground text-xs">монет</span>
            </div>
            <button onClick={() => navigate("store")} className="text-xs gold-text hover:underline">
              Пополнить →
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={`${s.color} mb-3`}>
                <Icon name={s.icon} size={20} />
              </div>
              <div className="font-display text-3xl font-bold mb-1">{s.value}</div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Play + Winrate */}
          <div className="flex flex-col gap-4">
            {/* Play Button */}
            <button
              onClick={() => navigate("game")}
              className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-8 text-center hover:opacity-95 transition-all group animate-pulse-gold"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Icon name="Play" size={36} className="mx-auto mb-3" />
              <div className="font-display text-2xl font-bold uppercase tracking-widest">Играть</div>
              <div className="text-primary-foreground/70 text-sm mt-1">Найти соперника</div>
            </button>

            {/* Winrate */}
            <div className="glass-card rounded-xl p-5">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Процент побед</div>
              <div className="font-display text-4xl font-bold gold-text mb-3">{winRate}%</div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${winRate}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>89 побед</span>
                <span>142 игры</span>
              </div>
            </div>

            {/* Achievements */}
            <div className="glass-card rounded-xl p-5">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Достижения</div>
              <div className="grid grid-cols-3 gap-2">
                {achievements.map((a, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-3 text-center transition-all
                      ${a.unlocked ? "bg-primary/10 border border-primary/25" : "bg-secondary/40 border border-border opacity-40"}
                    `}
                    title={a.name}
                  >
                    <div className="text-2xl">{a.icon}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Recent Matches */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display font-bold uppercase tracking-wider text-lg">История матчей</h2>
                <span className="text-xs text-muted-foreground">Последние 5</span>
              </div>
              <div className="divide-y divide-border">
                {recentMatches.map((m, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors">
                    <div className={`w-2 h-10 rounded-full flex-shrink-0
                      ${m.result === "win" ? "bg-green-500" : m.result === "loss" ? "bg-red-500" : "bg-gray-500"}
                    `} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{m.opponent}</div>
                      <div className="text-xs text-muted-foreground">{m.mode} · {m.time}</div>
                    </div>
                    <div className={`text-sm font-bold
                      ${m.result === "win" ? "text-green-400" : m.result === "loss" ? "text-red-400" : "text-muted-foreground"}
                    `}>
                      {m.result === "win" ? "Победа" : m.result === "loss" ? "Поражение" : "Ничья"}
                    </div>
                    <div className={`text-xs font-semibold min-w-[40px] text-right
                      ${m.rating.startsWith("+") ? "gold-text" : m.rating.startsWith("-") ? "text-red-400" : "text-muted-foreground"}
                    `}>
                      {m.rating}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-border">
                <button className="text-xs gold-text hover:underline">Вся история матчей →</button>
              </div>
            </div>

            {/* Daily bonus */}
            <div className="mt-4 glass-card rounded-xl p-5 flex items-center gap-4 border border-primary/20">
              <div className="text-3xl">🎁</div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Ежедневный бонус</div>
                <div className="text-muted-foreground text-xs">+10 монет за вход каждый день</div>
              </div>
              <button className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Забрать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
