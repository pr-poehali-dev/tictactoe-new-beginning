import { useState, useEffect } from "react";
import { type Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface LandingPageProps {
  navigate: (page: Page) => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const skins = [
  { name: "Неоновый",  sym: "×", symO: "○", colorX: "#d4a96a", colorO: "#7ab3e0" },
  { name: "Стимпанк",  sym: "⚙", symO: "⬡", colorX: "#c8955a", colorO: "#8fa8b8" },
  { name: "Кристалл",  sym: "◈", symO: "◇", colorX: "#9eb8cc", colorO: "#d4c49a" },
  { name: "Огонь",     sym: "✦", symO: "✧", colorX: "#cc8855", colorO: "#7a9dbf" },
  { name: "Тень",      sym: "▲", symO: "▽", colorX: "#a090c0", colorO: "#90a8c0" },
];

const features = [
  { icon: "Bot",        title: "3 уровня ИИ",     desc: "Новичок, любитель и Минимакс — непобедимый эксперт" },
  { icon: "Swords",     title: "PvP онлайн",       desc: "Рейтинговые матчи с таймером 15 секунд на ход" },
  { icon: "Shield",     title: "Защита от читов",  desc: "Все расчёты на сервере — нечестная игра исключена" },
  { icon: "TrendingUp", title: "Elo-рейтинг",      desc: "Сезонные таблицы, лиги и награды для лучших" },
];

const demoBoard = ["×", "", "○", "", "×", "", "○", "", "×"];
const WIN_CELLS = [0, 4, 8];

const shopItems = [
  { label: "Деревянный", price: "Бесплатно", tag: "free" },
  { label: "Карандаш",   price: "Бесплатно", tag: "free" },
  { label: "Неоновый",   price: "120 монет",  tag: "hit" },
  { label: "Стимпанк",   price: "200 монет",  tag: "" },
  { label: "Кристалл",   price: "180 монет",  tag: "new" },
  { label: "Огонь",      price: "250 монет",  tag: "" },
  { label: "Тень",       price: "300 монет",  tag: "premium" },
  { label: "Меч & Щит", price: "500 монет",  tag: "anim" },
];

export default function LandingPage({ navigate, onLoginClick, onRegisterClick }: LandingPageProps) {
  const [skinIdx, setSkinIdx] = useState(0);
  const [showWin, setShowWin] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowWin(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSkinIdx(p => (p + 1) % skins.length), 3000);
    return () => clearInterval(t);
  }, []);

  const skin = skins[skinIdx];

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-5 h-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded flex items-center justify-center bg-surface-2 border border-border">
              <span className="sym-x text-sm font-black leading-none">×</span>
            </div>
            <span className="font-black text-sm tracking-tight">ХО<span className="cream">·</span>Battle</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onLoginClick} className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">
              Войти
            </button>
            <button onClick={onRegisterClick} className="btn-cream text-xs px-4 py-1.5">
              Начать бесплатно
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-36 pb-28 px-5">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 border border-border rounded-full px-3 py-1 text-xs text-muted-foreground font-semibold mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              1 247 игроков онлайн
            </div>
            <h1 className="font-black text-5xl lg:text-[64px] leading-[0.93] tracking-tight mb-7">
              Крестики&#8209;нолики<br />
              <span className="cream">нового</span><br />
              поколения
            </h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed mb-10 max-w-sm font-medium">
              Соревновательный режим, рейтинг Elo, уникальные скины и три уровня ИИ. Классика — переосмыслена.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={onRegisterClick} className="btn-cream px-7 py-3 text-sm">
                Играть бесплатно
              </button>
              <button onClick={() => navigate("about")} className="btn-ghost px-7 py-3 text-sm">
                Узнать больше
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-5 font-medium">
              +50 монет при регистрации · Без карты
            </p>
          </div>

          {/* Demo board */}
          <div className="flex flex-col items-center gap-6 animate-fade-in delay-200">
            <div className="relative">
              <div className="grid grid-cols-3 gap-3 bg-card border border-border rounded-xl p-4 shadow-2xl">
                {demoBoard.map((cell, i) => (
                  <div
                    key={i}
                    className={`w-[84px] h-[84px] flex items-center justify-center rounded-lg border text-[38px] font-black transition-all duration-500
                      ${WIN_CELLS.includes(i) && showWin
                        ? "border-cream/30 bg-cream-subtle"
                        : "border-border bg-secondary"
                      }
                    `}
                  >
                    {cell === "×" && <span style={{ color: skin.colorX }}>{skin.sym}</span>}
                    {cell === "○" && <span style={{ color: skin.colorO }}>{skin.symO}</span>}
                  </div>
                ))}
              </div>
              {showWin && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap cream animate-fade-in">
                  Победа по диагонали
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-3">
              {skins.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSkinIdx(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === skinIdx ? "w-6 bg-cream" : "w-1.5 bg-border hover:bg-muted-foreground"}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground font-medium -mt-2">Скин: {skin.name}</p>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Features */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Почему мы?</p>
            <h2 className="font-black text-3xl tracking-tight">Настоящая соревновательная игра</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {features.map((f, i) => (
              <div key={i} className="card-premium p-5 animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="w-9 h-9 rounded bg-surface-2 border border-border flex items-center justify-center mb-4 cream">
                  <Icon name={f.icon} size={16} />
                </div>
                <h3 className="font-bold text-sm mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Skins */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Магазин</p>
            <h2 className="font-black text-3xl tracking-tight">Выдели себя</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {shopItems.map((item, i) => (
              <div key={i} className="card-premium px-4 py-3 flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="font-semibold text-sm">{item.label}</span>
                <span className="text-muted-foreground text-xs font-medium">{item.price}</span>
                {item.tag === "free" && <span className="badge-muted">FREE</span>}
                {item.tag === "hit"  && <span className="badge-cream">ХИТ</span>}
                {item.tag === "new"  && <span className="badge-cream">NEW</span>}
                {item.tag === "premium" && <span className="badge-muted">PRO</span>}
                {item.tag === "anim" && <span className="badge-cream">ANIM</span>}
              </div>
            ))}
          </div>
          <button onClick={() => navigate("store")} className="mt-5 text-xs font-semibold cream hover:underline underline-offset-4">
            Открыть магазин →
          </button>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* CTA */}
      <section className="py-24 px-5">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h2 className="font-black text-4xl tracking-tight mb-3 leading-tight">
              Начни прямо<br />сейчас
            </h2>
            <p className="text-muted-foreground text-sm font-medium">Бесплатно · 50 монет в подарок · Без карты</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={onRegisterClick} className="btn-cream px-8 py-3.5 text-sm">
              Создать аккаунт
            </button>
            <button onClick={onLoginClick} className="btn-ghost px-8 py-3.5 text-sm">
              Войти
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-black text-sm tracking-tight mb-1">ХО<span className="cream">·</span>Battle</div>
            <p className="text-xs text-muted-foreground">© 2026 · Крестики-нолики нового поколения</p>
          </div>
          <div className="flex items-center gap-5">
            {(["about", "pro", "leaderboard"] as Page[]).map(p => (
              <button key={p} onClick={() => navigate(p)} className="text-xs text-muted-foreground hover:text-foreground transition-colors font-semibold">
                {p === "about" ? "О игре" : p === "pro" ? "PRO" : "Рейтинг"}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
