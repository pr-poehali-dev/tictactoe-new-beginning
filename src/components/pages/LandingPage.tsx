import { useState, useEffect } from "react";
import { type Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface LandingPageProps {
  navigate: (page: Page) => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const skins = [
  { name: "Неоновый", symbol: "X", color: "#f0b429", bg: "from-yellow-900/30 to-transparent", desc: "Светится в темноте" },
  { name: "Стимпанк", symbol: "⚙", color: "#cd7f32", bg: "from-orange-900/30 to-transparent", desc: "Механические шестерни" },
  { name: "Кристалл", symbol: "◈", color: "#67e8f9", bg: "from-cyan-900/30 to-transparent", desc: "Ледяной излом" },
  { name: "Огонь", symbol: "✦", color: "#f97316", bg: "from-orange-900/30 to-transparent", desc: "Анимированное пламя" },
  { name: "Тень", symbol: "▲", color: "#a78bfa", bg: "from-violet-900/30 to-transparent", desc: "Мистический знак" },
];

const features = [
  { icon: "Bot", title: "3 уровня ИИ", desc: "От новичка до непобедимого эксперта с алгоритмом Минимакс" },
  { icon: "Swords", title: "PvP в реальном времени", desc: "Подбор соперника по рейтингу Elo с таймером 15 секунд" },
  { icon: "Shield", title: "Защита от читов", desc: "Все расчёты на сервере — нечестная игра исключена" },
  { icon: "TrendingUp", title: "Рейтинговая система", desc: "Elo-рейтинг, сезонные награды, таблица лидеров" },
];

const gameBoard = ["X", "", "O", "", "X", "", "O", "", "X"];

export default function LandingPage({ navigate, onLoginClick, onRegisterClick }: LandingPageProps) {
  const [activeSkin, setActiveSkin] = useState(0);
  const [highlighted, setHighlighted] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setHighlighted([0, 4, 8]), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSkin(prev => (prev + 1) % skins.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-grid relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="font-display text-2xl font-bold tracking-wider flex items-center gap-2">
          <span className="symbol-x text-3xl">X</span>
          <span className="text-foreground/70">О</span>
          <span className="gold-text ml-1">Battle</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onLoginClick} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
            Войти
          </button>
          <button onClick={onRegisterClick} className="bg-primary text-primary-foreground font-semibold text-sm px-5 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Регистрация
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-secondary border border-border rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            1 247 игроков онлайн
          </div>
          <h1 className="font-display text-5xl lg:text-7xl font-bold uppercase leading-none mb-6">
            Крестики-Нолики<br />
            <span className="gold-text">нового</span><br />
            поколения
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-md">
            Сражайся с реальными игроками, прокачивай рейтинг, коллекционируй уникальные скины. Классика — переосмыслена.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onRegisterClick}
              className="bg-primary text-primary-foreground font-display font-bold uppercase tracking-widest px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity animate-pulse-gold"
            >
              Играть бесплатно
            </button>
            <button
              onClick={() => navigate("about")}
              className="border border-border text-foreground font-semibold px-8 py-4 rounded-xl text-base hover:bg-secondary transition-colors"
            >
              Узнать больше
            </button>
          </div>
          <p className="text-muted-foreground text-xs mt-4">🎁 +50 монет при регистрации</p>
        </div>

        {/* Game board preview */}
        <div className="flex flex-col items-center gap-6 animate-fade-in delay-200">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent blur-2xl scale-110" />
            <div className="relative grid grid-cols-3 gap-2 bg-card border border-border p-4 rounded-2xl shadow-2xl">
              {gameBoard.map((cell, i) => (
                <div
                  key={i}
                  className={`w-20 h-20 flex items-center justify-center rounded-xl transition-all duration-500 font-display text-4xl font-bold border
                    ${highlighted.includes(i)
                      ? "bg-primary/15 border-primary/40 scale-105"
                      : "bg-secondary/60 border-border"
                    }
                  `}
                >
                  <span className={cell === "X" ? "symbol-x" : "symbol-o"}>
                    {cell}
                  </span>
                </div>
              ))}
            </div>
            {highlighted.length > 0 && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                🏆 Победа!
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm">Скин: Дерево (бесплатно)</p>
        </div>
      </section>

      {/* Skins slider */}
      <section className="relative z-10 border-y border-border py-16 bg-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-3">Магазин скинов</p>
            <h2 className="font-display text-4xl font-bold uppercase">Выдели себя из толпы</h2>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            {skins.map((skin, i) => (
              <button
                key={i}
                onClick={() => setActiveSkin(i)}
                className={`relative p-6 rounded-2xl border transition-all duration-300 w-40 text-center
                  ${activeSkin === i
                    ? "border-primary bg-gradient-to-b " + skin.bg + " scale-105"
                    : "border-border bg-card hover:border-primary/40"
                  }
                `}
              >
                <div className="text-5xl mb-3 font-display font-bold" style={{ color: skin.color }}>
                  {skin.symbol}
                </div>
                <div className="text-sm font-semibold mb-1">{skin.name}</div>
                <div className="text-xs text-muted-foreground">{skin.desc}</div>
                {activeSkin === i && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Icon name="Check" size={11} />
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("store")}
              className="text-sm gold-text hover:underline font-medium"
            >
              Смотреть все скины в магазине →
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-3">Почему мы?</p>
          <h2 className="font-display text-4xl font-bold uppercase">Настоящая битва</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 gold-text">
                <Icon name={f.icon} size={22} />
              </div>
              <h3 className="font-display font-bold text-lg uppercase mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 p-10 text-center">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative z-10">
            <h2 className="font-display text-4xl font-bold uppercase mb-4">Начни прямо сейчас</h2>
            <p className="text-muted-foreground mb-8">Регистрация бесплатна. 50 монет в подарок для магазина скинов.</p>
            <button
              onClick={onRegisterClick}
              className="bg-primary text-primary-foreground font-display font-bold uppercase tracking-widest px-10 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity"
            >
              Создать аккаунт
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-muted-foreground text-xs">
        <div className="font-display font-bold text-sm gold-text mb-2">ХО-Battle</div>
        <p>© 2026 · Крестики-нолики нового поколения</p>
        <div className="flex justify-center gap-6 mt-4">
          {(["about", "pro", "leaderboard"] as Page[]).map(p => (
            <button key={p} onClick={() => navigate(p)} className="hover:text-foreground transition-colors capitalize">
              {p === "about" ? "О игре" : p === "pro" ? "PRO" : "Рейтинг"}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
