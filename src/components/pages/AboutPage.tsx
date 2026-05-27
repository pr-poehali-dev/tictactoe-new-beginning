import Icon from "@/components/ui/icon";

const difficulties = [
  {
    name: "Новичок",
    tag: "ЛЕГКО",
    tagClass: "text-green-400 border-green-800",
    desc: "Бот делает случайные ходы и побеждает лишь если следующий ход выигрышный. Идеально для первого знакомства.",
    algo: "Случайный выбор + проверка победного хода",
  },
  {
    name: "Любитель",
    tag: "СРЕДНЕ",
    tagClass: "cream border-amber-800",
    desc: "Бот атакует, защищается, занимает центр и углы. С вероятностью 20% делает случайный ход, имитируя человека.",
    algo: "Эвристика: победа → блок → центр → углы",
  },
  {
    name: "Эксперт",
    tag: "НЕПОБЕДИМ",
    tagClass: "text-red-400 border-red-900",
    desc: "Алгоритм Минимакс — просчитывает всё дерево вариантов. Никогда не проигрывает. Максимум что можно добиться — ничья.",
    algo: "Минимакс: полный перебор дерева игры",
  },
];

const rules = [
  { icon: "Grid3X3",    text: "Поле 3×3. Первый ход — за игроком X." },
  { icon: "Trophy",     text: "Победа — три символа подряд по горизонтали, вертикали или диагонали." },
  { icon: "Clock",      text: "В онлайн-игре 15 секунд на ход. При просрочке — случайный ход." },
  { icon: "Star",       text: "Онлайн-матчи влияют на рейтинг Elo. Игры с ботом — нет." },
  { icon: "Coins",      text: "Монеты за победы онлайн, ежедневный вход и достижения." },
  { icon: "Shield",     text: "Все расчёты победы — на сервере. Читы исключены." },
];

const monetization = [
  { side: "Заработать", icon: "TrendingUp", items: ["Победа онлайн: +10–25 монет", "Ежедневный вход: +10 монет", "Просмотр рекламы: +5 монет", "Выполнение достижений"] },
  { side: "Потратить",  icon: "ShoppingBag", items: ["Скины для X и O", "Поля сражений", "Аватары и значки", "Анимированные стикеры"] },
];

const timeline = [
  { period: "Март 2025",  event: "Запуск первой версии — базовые онлайн-матчи" },
  { period: "Сезон 1",    event: "Скины, система достижений, 5 000 игроков" },
  { period: "Сезон 2",    event: "Онлайн в реальном времени, Elo-рейтинг, магазин" },
  { period: "Сезон 3",    event: "PRO-подписка, тепловые карты, 14 000+ игроков" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-5">
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <div className="py-16 border-b border-border mb-16 animate-fade-in">
          <div className="flex items-center gap-4 mb-8">
            <span className="sym-x font-black text-6xl leading-none">×</span>
            <span className="text-muted-foreground/20 font-thin text-4xl">против</span>
            <span className="sym-o font-black text-6xl leading-none">○</span>
          </div>
          <h1 className="font-black text-5xl tracking-tight mb-4">О игре</h1>
          <p className="text-muted-foreground text-base font-medium max-w-xl leading-relaxed">
            ХО-Battle — современная интерпретация классики. Мы взяли простую механику и добавили соревновательную глубину, кастомизацию и живое сообщество.
          </p>
        </div>

        {/* Rules */}
        <div className="mb-16">
          <h2 className="font-black text-3xl tracking-tight mb-8">Правила</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {rules.map((r, i) => (
              <div key={i} className="card-premium p-4 flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center cream shrink-0 mt-0.5">
                  <Icon name={r.icon} size={15} />
                </div>
                <p className="text-sm font-medium leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Levels */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="font-black text-3xl tracking-tight mb-2">Уровни ИИ</h2>
            <p className="text-muted-foreground text-sm font-medium">Бот работает на сервере — нечестная игра исключена</p>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {difficulties.map((d, i) => (
              <div key={i} className="card-premium p-6 flex flex-col gap-4 animate-fade-in" style={{ animationDelay: `${i * 0.09}s` }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-lg tracking-tight">{d.name}</h3>
                  <span className={`text-[10px] font-bold border px-2 py-0.5 rounded uppercase tracking-widest ${d.tagClass}`}>
                    {d.tag}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed flex-1">{d.desc}</p>
                <div className="border-t border-border pt-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Алгоритм</div>
                  <div className="text-xs font-semibold">{d.algo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monetization */}
        <div className="mb-16">
          <h2 className="font-black text-3xl tracking-tight mb-8">Монетизация</h2>
          <div className="card-premium p-6 grid sm:grid-cols-2 gap-8">
            {monetization.map((m, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon name={m.icon} size={15} className="cream" />
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{m.side}</div>
                </div>
                <ul className="flex flex-col gap-2">
                  {m.items.map((t, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm font-medium">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="font-black text-3xl tracking-tight mb-8">История проекта</h2>
          <div className="relative pl-6">
            <div className="absolute left-0 top-1.5 bottom-1.5 w-px bg-border" />
            {timeline.map((t, i) => (
              <div key={i} className="relative mb-8 last:mb-0 animate-fade-in" style={{ animationDelay: `${i * 0.09}s` }}>
                <div className="absolute -left-[25px] w-3.5 h-3.5 rounded-full border-2 border-border bg-background" />
                <div className="text-xs font-bold uppercase tracking-widest cream mb-1">{t.period}</div>
                <div className="text-sm font-medium">{t.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}