import Icon from "@/components/ui/icon";

const features = [
  { icon: "BanIcon", label: "Без рекламы", desc: "Никаких баннеров и прерываний" },
  { icon: "BarChart3", label: "Аналитика матчей", desc: "Тепловая карта ходов и решающий момент" },
  { icon: "Calendar", label: "Статистика по дням", desc: "Винрейт, активность, прогресс по неделям" },
  { icon: "BadgeCheck", label: "PRO-значок", desc: "Эксклюзивная метка в профиле и рейтинге" },
  { icon: "Zap", label: "Двойной опыт", desc: "×2 монеты за победы в PvP без видеорекламы" },
  { icon: "Unlock", label: "Ранний доступ", desc: "Новые скины и режимы первым" },
];

const plans = [
  {
    id: "month",
    name: "Месяц",
    price: "199 ₽",
    per: "/ месяц",
    save: "",
    popular: false,
  },
  {
    id: "quarter",
    name: "3 месяца",
    price: "449 ₽",
    per: "/ 3 мес",
    save: "Экономия 25%",
    popular: true,
  },
  {
    id: "year",
    name: "Год",
    price: "1 490 ₽",
    per: "/ год",
    save: "Экономия 38%",
    popular: false,
  },
];

const faq = [
  { q: "Могу ли я отменить подписку?", a: "Да, в любой момент через личный кабинет. Доступ сохраняется до конца оплаченного периода." },
  { q: "Что случится с PRO-скинами после отмены?", a: "Скины, купленные за монеты, остаются навсегда. Эксклюзивный PRO-значок скрывается." },
  { q: "Есть ли пробный период?", a: "Да — 7 дней бесплатно для новых пользователей при первой подписке." },
];

export default function ProPage() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/8 to-transparent border border-primary/20 p-10 text-center mb-12 animate-fade-in">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary/20 gold-text border border-primary/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <Icon name="Star" size={13} />
              PRO-Игрок
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-bold uppercase mb-4">
              Раскрой<br /><span className="gold-text">полный потенциал</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Отключи рекламу, получи глубокую аналитику и выдели себя среди тысяч игроков.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-5 flex gap-4 border border-border hover:border-primary/30 transition-all animate-fade-in"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center gold-text flex-shrink-0 mt-0.5">
                <Icon name={f.icon} size={20} />
              </div>
              <div>
                <div className="font-semibold mb-1">{f.label}</div>
                <div className="text-muted-foreground text-sm">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="font-display text-3xl font-bold uppercase">Выбери план</h2>
          <p className="text-muted-foreground mt-2 text-sm">7 дней бесплатно · Отмена в любой момент</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className={`relative glass-card rounded-2xl p-6 flex flex-col gap-4 border transition-all animate-fade-in
                ${plan.popular ? "border-primary/50 bg-primary/5 scale-[1.02]" : "border-border"}
              `}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  Лучший выбор
                </div>
              )}
              <div>
                <div className="font-display font-bold uppercase text-sm text-muted-foreground mb-1">{plan.name}</div>
                <div className="font-display font-bold text-4xl">{plan.price}</div>
                <div className="text-muted-foreground text-xs">{plan.per}</div>
              </div>
              {plan.save && (
                <div className="bg-green-900/30 text-green-400 text-xs font-bold px-3 py-1.5 rounded-lg w-fit">
                  {plan.save}
                </div>
              )}
              <button className={`mt-auto w-full py-3 rounded-xl font-display font-bold uppercase tracking-wider transition-all
                ${plan.popular ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border hover:bg-secondary text-foreground"}
              `}>
                Начать
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="glass-card rounded-2xl overflow-hidden mb-12 animate-fade-in">
          <div className="grid grid-cols-3 bg-secondary/50 px-6 py-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <div className="col-span-1">Функция</div>
            <div className="text-center">Бесплатно</div>
            <div className="text-center gold-text">PRO</div>
          </div>
          {[
            ["Игры с ботом", true, true],
            ["PvP матчи", true, true],
            ["Базовые скины", true, true],
            ["Реклама", "Да", "Нет"],
            ["Аналитика матчей", false, true],
            ["Тепловая карта", false, true],
            ["PRO-значок", false, true],
            ["×2 монеты", false, true],
          ].map(([feat, free, pro], i) => (
            <div key={i} className="grid grid-cols-3 px-6 py-3.5 border-t border-border items-center">
              <div className="text-sm">{feat as string}</div>
              <div className="text-center text-sm">
                {typeof free === "boolean"
                  ? <Icon name={free ? "Check" : "X"} size={16} className={`mx-auto ${free ? "text-green-400" : "text-muted-foreground"}`} />
                  : <span className={free === "Нет" ? "text-red-400 text-xs" : "text-muted-foreground text-xs"}>{free as string}</span>
                }
              </div>
              <div className="text-center text-sm">
                {typeof pro === "boolean"
                  ? <Icon name={pro ? "Check" : "X"} size={16} className={`mx-auto ${pro ? "gold-text" : "text-muted-foreground"}`} />
                  : <span className={pro === "Нет" ? "text-green-400 text-xs font-semibold" : "text-muted-foreground text-xs"}>{pro as string}</span>
                }
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="animate-fade-in">
          <h2 className="font-display text-2xl font-bold uppercase mb-6 text-center">Частые вопросы</h2>
          <div className="flex flex-col gap-3">
            {faq.map((item, i) => (
              <div key={i} className="glass-card rounded-xl p-5 border border-border">
                <div className="font-semibold mb-2">{item.q}</div>
                <div className="text-muted-foreground text-sm">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
