import Icon from "@/components/ui/icon";

const features = [
  { icon: "BanIcon",    label: "Без рекламы",       desc: "Никаких баннеров и прерываний во время игры" },
  { icon: "BarChart3",  label: "Анализ матчей",      desc: "Показывает решающий ход и где была допущена ошибка" },
  { icon: "Map",        label: "Тепловая карта",     desc: "Статистика ходов по клеткам за все матчи" },
  { icon: "BadgeCheck", label: "Значок PRO",          desc: "Эксклюзивная метка рядом с именем в рейтинге" },
  { icon: "Zap",        label: "×2 монеты",          desc: "Удвоенный заработок за победы онлайн" },
  { icon: "Unlock",     label: "Ранний доступ",      desc: "Новые скины и режимы — раньше остальных" },
];

const plans = [
  { id: "month",   name: "Месяц",    price: "199 ₽",   sub: "в месяц",   save: "",          popular: false },
  { id: "quarter", name: "3 месяца", price: "449 ₽",   sub: "за 3 мес",  save: "−25%",     popular: true  },
  { id: "year",    name: "Год",      price: "1 490 ₽", sub: "в год",     save: "−38%",     popular: false },
];

const comparison = [
  ["Игры с ботом",       true,  true ],
  ["Онлайн-матчи",       true,  true ],
  ["Базовые скины",      true,  true ],
  ["Реклама",            "Да",  "Нет"],
  ["Анализ матчей",      false, true ],
  ["Тепловая карта",     false, true ],
  ["Значок PRO",         false, true ],
  ["×2 монеты за победу",false, true ],
];

const faq = [
  { q: "Можно ли отменить подписку?", a: "Да, в любой момент. Доступ сохраняется до конца оплаченного периода." },
  { q: "Что случится со скинами?",    a: "Скины, купленные за монеты, остаются навсегда. PRO-значок скрывается при отмене." },
  { q: "Есть ли пробный период?",     a: "7 дней бесплатно для новых пользователей при первой подписке." },
];

export default function ProPage() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-5">
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <div className="py-16 border-b border-border mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 border border-border rounded-full px-3 py-1 text-xs font-bold text-muted-foreground mb-8 uppercase tracking-widest">
            <Icon name="Star" size={11} className="cream" />
            Подписка PRO
          </div>
          <h1 className="font-black text-5xl lg:text-6xl tracking-tight leading-[0.93] mb-5">
            Раскрой<br /><span className="cream">полный потенциал</span>
          </h1>
          <p className="text-muted-foreground text-base font-medium max-w-md leading-relaxed">
            Отключи рекламу, получи глубокую аналитику и выдели себя среди тысяч игроков.
          </p>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-16">
          {features.map((f, i) => (
            <div key={i} className="card-premium p-5 flex gap-4 animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center cream shrink-0 mt-0.5">
                <Icon name={f.icon} size={16} />
              </div>
              <div>
                <div className="font-bold text-sm mb-1">{f.label}</div>
                <div className="text-muted-foreground text-xs leading-relaxed font-medium">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="mb-14">
          <div className="mb-8">
            <h2 className="font-black text-3xl tracking-tight mb-2">Выбери план</h2>
            <p className="text-muted-foreground text-sm font-medium">7 дней бесплатно · Отмена в любой момент</p>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {plans.map((plan, i) => (
              <div
                key={plan.id}
                className={`card-premium p-6 flex flex-col gap-5 relative animate-fade-in
                  ${plan.popular ? "border-cream/30 bg-cream-subtle" : ""}
                `}
                style={{ animationDelay: `${i * 0.09}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-5 badge-cream">Лучший выбор</div>
                )}
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{plan.name}</div>
                  <div className="font-black text-4xl tracking-tight">{plan.price}</div>
                  <div className="text-muted-foreground text-xs font-medium mt-0.5">{plan.sub}</div>
                </div>
                {plan.save && (
                  <div className="text-xs font-bold text-green-400 bg-green-950/40 border border-green-900/40 px-3 py-1.5 rounded w-fit">
                    {plan.save}
                  </div>
                )}
                <button className={`mt-auto w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all
                  ${plan.popular ? "btn-cream" : "btn-ghost"}
                `}>
                  Начать
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <div className="mb-14 animate-fade-in">
          <h2 className="font-black text-2xl tracking-tight mb-6">Сравнение планов</h2>
          <div className="card-premium overflow-hidden">
            <div className="grid grid-cols-3 px-5 py-3 border-b border-border bg-surface-2">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Функция</div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">Бесплатно</div>
              <div className="text-xs font-bold uppercase tracking-widest cream text-center">Про</div>
            </div>
            <div className="divide-y divide-border">
              {comparison.map(([feat, free, pro], i) => (
                <div key={i} className="grid grid-cols-3 px-5 py-3.5 items-center">
                  <div className="text-sm font-medium">{feat as string}</div>
                  <div className="flex justify-center">
                    {typeof free === "boolean"
                      ? <Icon name={free ? "Check" : "Minus"} size={15} className={free ? "text-green-400" : "text-muted-foreground"} />
                      : <span className={`text-xs font-semibold ${free === "Нет" ? "text-red-400" : "text-muted-foreground"}`}>{free as string}</span>
                    }
                  </div>
                  <div className="flex justify-center">
                    {typeof pro === "boolean"
                      ? <Icon name={pro ? "Check" : "Minus"} size={15} className={pro ? "cream" : "text-muted-foreground"} />
                      : <span className={`text-xs font-semibold ${pro === "Нет" ? "text-green-400" : "text-muted-foreground"}`}>{pro as string}</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="animate-fade-in">
          <h2 className="font-black text-2xl tracking-tight mb-6">Частые вопросы</h2>
          <div className="flex flex-col gap-2">
            {faq.map((item, i) => (
              <div key={i} className="card-premium p-5">
                <div className="font-bold text-sm mb-2">{item.q}</div>
                <div className="text-muted-foreground text-sm font-medium leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}