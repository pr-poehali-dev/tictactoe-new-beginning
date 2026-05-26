import Icon from "@/components/ui/icon";

const difficulties = [
  {
    name: "Новичок",
    icon: "😊",
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-900/10",
    desc: "Бот делает случайные ходы. Побеждает только если угрожает победа следующим ходом. Идеально для знакомства с игрой.",
    algo: "Случайный выбор + проверка победного хода",
    tag: "ЛЕГКО",
  },
  {
    name: "Любитель",
    icon: "🎯",
    color: "text-yellow-400",
    border: "border-yellow-500/30",
    bg: "bg-yellow-900/10",
    desc: "Бот атакует и защищается, занимает центр и углы. С вероятностью 20% делает «глупый» ход, имитируя человека.",
    algo: "Эвристика: победа → блок → центр → углы",
    tag: "СРЕДНЕ",
  },
  {
    name: "Эксперт",
    icon: "🤖",
    color: "text-red-400",
    border: "border-red-500/30",
    bg: "bg-red-900/10",
    desc: "Алгоритм Минимакс. Просчитывает все возможные ходы. Никогда не проигрывает. Максимум, что вы можете добиться — ничья.",
    algo: "Минимакс — полный перебор дерева игры",
    tag: "НЕВОЗМОЖНО",
  },
];

const rules = [
  { icon: "Grid3X3", text: "Поле 3×3 клетки. Первый ход — за игроком X." },
  { icon: "Trophy", text: "Победа — три своих символа по горизонтали, вертикали или диагонали." },
  { icon: "Clock", text: "В PvP-режиме 15 секунд на ход. При просрочке — случайный ход." },
  { icon: "Star", text: "PvP матчи влияют на рейтинг Elo. Игры с ботом — нет." },
  { icon: "Coins", text: "Монеты начисляются за победы в PvP, ежедневный вход и достижения." },
  { icon: "Shield", text: "Все расчёты победы проходят на сервере для защиты от читов." },
];

const timeline = [
  { year: "2025", event: "Идея и запуск первой версии" },
  { year: "Сезон 1", event: "Базовые скины, 5 000 игроков" },
  { year: "Сезон 2", event: "PvP в реальном времени, Elo-рейтинг" },
  { year: "Сезон 3", event: "PRO-подписка, 14 000+ игроков" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-14 animate-fade-in">
          <div className="flex justify-center gap-4 text-6xl font-display font-bold mb-6">
            <span className="symbol-x">X</span>
            <span className="text-muted-foreground/30 text-4xl self-center font-light">vs</span>
            <span className="symbol-o">O</span>
          </div>
          <h1 className="font-display text-5xl font-bold uppercase mb-4">О игре</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            ХО-Battle — это современная интерпретация классической игры. Мы взяли простую механику и добавили соревновательную глубину, кастомизацию и живое сообщество.
          </p>
        </div>

        {/* Rules */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold uppercase">Правила</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {rules.map((r, i) => (
              <div
                key={i}
                className="glass-card rounded-xl p-4 flex items-start gap-4 border border-border animate-fade-in"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center gold-text flex-shrink-0">
                  <Icon name={r.icon} size={18} />
                </div>
                <p className="text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Levels */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold uppercase">Уровни ИИ</h2>
            <p className="text-muted-foreground mt-2 text-sm">Бот работает на сервере — нечестная игра исключена</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {difficulties.map((d, i) => (
              <div
                key={i}
                className={`glass-card rounded-2xl p-6 border ${d.border} ${d.bg} animate-fade-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{d.icon}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${d.border} ${d.color} bg-transparent`}>
                    {d.tag}
                  </span>
                </div>
                <h3 className={`font-display font-bold text-xl uppercase mb-3 ${d.color}`}>{d.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{d.desc}</p>
                <div className="border-t border-border pt-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Алгоритм</div>
                  <div className="text-xs font-medium">{d.algo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monetization */}
        <div className="mb-14 glass-card rounded-2xl p-8 border border-border animate-fade-in">
          <h2 className="font-display text-2xl font-bold uppercase mb-6">Монетизация</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Как заработать монеты</div>
              <ul className="flex flex-col gap-2">
                {["Победа в PvP: +10–25 монет", "Ежедневный вход: +10 монет", "Просмотр видеорекламы: +5 монет", "Выполнение достижений"].map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Icon name="Check" size={14} className="gold-text flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">На что тратить</div>
              <ul className="flex flex-col gap-2">
                {["Скины для X и O", "Поля сражений", "Аватары и значки", "Анимированные стикеры"].map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Icon name="ShoppingBag" size={14} className="text-cyan-400 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="animate-fade-in">
          <h2 className="font-display text-2xl font-bold uppercase mb-8 text-center">История проекта</h2>
          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
            {timeline.map((t, i) => (
              <div key={i} className="relative mb-8 last:mb-0">
                <div className="absolute -left-5 w-4 h-4 rounded-full border-2 border-primary bg-background" />
                <div className="text-xs gold-text font-bold uppercase tracking-wider mb-1">{t.year}</div>
                <div className="text-sm">{t.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
