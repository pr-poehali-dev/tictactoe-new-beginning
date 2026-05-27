import { useState } from "react";
import Icon from "@/components/ui/icon";

interface StorePageProps {
  coins: number;
  setCoins: (c: number) => void;
}

type Tab = "skins" | "boards" | "avatars" | "topup";

const skins = [
  { id: 1, name: "Деревянный", sym: "✕", symO: "○", cX: "#c8a96e", cO: "#8fa8b8", free: true,  price: 0,   tag: "free",  owned: true  },
  { id: 2, name: "Карандаш",   sym: "✗", symO: "◯", cX: "#d4cfc0", cO: "#a0b4c0", free: true,  price: 0,   tag: "free",  owned: false },
  { id: 3, name: "Неоновый",   sym: "×", symO: "○", cX: "#d4a96a", cO: "#7ab3e0", free: false, price: 120, tag: "hit",   owned: false },
  { id: 4, name: "Стимпанк",   sym: "⚙", symO: "⬡", cX: "#c8955a", cO: "#8fa8b8", free: false, price: 200, tag: "",      owned: false },
  { id: 5, name: "Кристалл",   sym: "◈", symO: "◇", cX: "#9eb8cc", cO: "#d4c49a", free: false, price: 180, tag: "new",   owned: false },
  { id: 6, name: "Огонь",      sym: "✦", symO: "✧", cX: "#cc8855", cO: "#7a9dbf", free: false, price: 250, tag: "",      owned: false },
  { id: 7, name: "Тень",       sym: "▲", symO: "▽", cX: "#a090c0", cO: "#90a8c0", free: false, price: 300, tag: "prem",  owned: false },
  { id: 8, name: "Меч & Щит", sym: "⚔", symO: "🛡", cX: "#e0ddd5", cO: "#8fa8b8", free: false, price: 500, tag: "anim",  owned: false },
];

const boards = [
  { id: 1, name: "Классика",  desc: "Минималистичное поле",     price: 0,   owned: true,  color: "#c8a96e" },
  { id: 2, name: "Мрамор",    desc: "Тёмный полированный камень",price: 150, owned: false, color: "#94a3b8" },
  { id: 3, name: "Галактика", desc: "Звёздное космическое поле", price: 280, owned: false, color: "#818cf8" },
  { id: 4, name: "Лес",       desc: "Зелёная природа",          price: 200, owned: false, color: "#4ade80" },
];

const topup = [
  { coins: 100,  price: "59 ₽",    bonus: "",              popular: false },
  { coins: 500,  price: "249 ₽",   bonus: "+50 в подарок", popular: true  },
  { coins: 1500, price: "699 ₽",   bonus: "+300 в подарок",popular: false },
];

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "skins",  label: "Скины",    icon: "Sparkles" },
  { id: "boards", label: "Поля",     icon: "Grid3X3"  },
  { id: "avatars",label: "Аватары",  icon: "UserCircle" },
  { id: "topup",  label: "Пополнить",icon: "Coins"    },
];

export default function StorePage({ coins, setCoins }: StorePageProps) {
  const [tab, setTab] = useState<Tab>("skins");
  const [selected, setSelected] = useState(1);
  const [ownedSkins, setOwnedSkins] = useState([1]);
  const [ownedBoards, setOwnedBoards] = useState([1]);
  const [notif, setNotif] = useState("");

  const toast = (msg: string) => { setNotif(msg); setTimeout(() => setNotif(""), 2200); };

  const buySkin = (skin: typeof skins[0]) => {
    if (ownedSkins.includes(skin.id)) return toast("Уже куплено");
    if (skin.free) { setOwnedSkins(p => [...p, skin.id]); return toast("Получен!"); }
    if (coins < skin.price) return toast("Недостаточно монет");
    setCoins(coins - skin.price);
    setOwnedSkins(p => [...p, skin.id]);
    toast(`«${skin.name}» куплен`);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-5">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Магазин</p>
            <h1 className="font-black text-4xl tracking-tight">Кастомизация</h1>
          </div>
          <div className="flex items-center gap-3 bg-surface-2 border border-border rounded-xl px-5 py-3">
            <span className="cream font-bold text-xl">⬡</span>
            <div>
              <div className="font-black text-2xl leading-none">{coins}</div>
              <div className="text-xs text-muted-foreground font-medium">монет</div>
            </div>
            <button onClick={() => setTab("topup")} className="ml-3 btn-cream text-xs px-3 py-1.5">
              + Купить
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border pb-0 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold tracking-wide transition-all border-b-2 -mb-px
                ${tab === t.id
                  ? "border-cream cream"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <Icon name={t.icon} size={13} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Toast */}
        {notif && (
          <div className="fixed top-16 right-4 z-50 bg-card border border-border px-4 py-2.5 rounded-lg animate-slide-in-right text-xs font-bold cream">
            ✓ {notif}
          </div>
        )}

        {/* Skins */}
        {tab === "skins" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {skins.map((skin, i) => {
              const owned = ownedSkins.includes(skin.id);
              const active = selected === skin.id;
              return (
                <div
                  key={skin.id}
                  className={`card-premium p-5 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 animate-fade-in
                    ${active && owned ? "border-cream/40 bg-cream-subtle" : ""}
                  `}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => owned && setSelected(skin.id)}
                >
                  <div className="self-stretch flex justify-between items-start">
                    <div className="w-5" />
                    {skin.tag === "hit"  && <span className="badge-cream">ХИТ</span>}
                                    {skin.tag === "new"  && <span className="badge-cream">НОВИНКА</span>}
                    {skin.tag === "free" && <span className="badge-muted">БЕСПЛАТНО</span>}
                    {skin.tag === "prem" && <span className="badge-muted">ПРЕМИУМ</span>}
                    {skin.tag === "anim" && <span className="badge-cream">АНИМАЦИЯ</span>}
                    {!skin.tag && <div />}
                  </div>
                  <div className="flex gap-3 text-4xl font-black">
                    <span style={{ color: skin.cX }}>{skin.sym}</span>
                    <span style={{ color: skin.cO }}>{skin.symO}</span>
                  </div>
                  <div className="font-bold text-sm text-center">{skin.name}</div>
                  {owned ? (
                    <button
                      onClick={e => { e.stopPropagation(); setSelected(skin.id); }}
                      className={`w-full py-2 rounded text-xs font-bold transition-all
                        ${active ? "bg-cream text-primary-foreground" : "bg-surface-2 text-muted-foreground hover:text-foreground"}
                      `}
                    >
                      {active ? "✓ Выбрано" : "Выбрать"}
                    </button>
                  ) : (
                    <button
                      onClick={e => { e.stopPropagation(); buySkin(skin); }}
                      className="w-full py-2 rounded text-xs font-bold border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-all flex items-center justify-center gap-1"
                    >
                      <span className="cream">⬡</span> {skin.price === 0 ? "Бесплатно" : skin.price}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Boards */}
        {tab === "boards" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {boards.map((b, i) => {
              const owned = ownedBoards.includes(b.id);
              return (
                <div key={b.id} className="card-premium p-5 flex flex-col gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="h-24 rounded-lg flex items-center justify-center" style={{ background: `${b.color}10`, border: `1px solid ${b.color}25` }}>
                    <div className="grid grid-cols-3 gap-1">
                      {Array(9).fill(null).map((_, j) => (
                        <div key={j} className="w-5 h-5 rounded-sm" style={{ background: `${b.color}20`, border: `1px solid ${b.color}35` }} />
                      ))}
                    </div>
                  </div>
                  <div className="font-bold text-sm">{b.name}</div>
                  <div className="text-muted-foreground text-xs font-medium">{b.desc}</div>
                  {owned ? (
                    <button className="btn-cream py-2 text-xs">✓ Активно</button>
                  ) : (
                    <button
                      onClick={() => {
                        if (coins < b.price) return toast("Недостаточно монет");
                        setCoins(coins - b.price); setOwnedBoards(p => [...p, b.id]); toast(`«${b.name}» куплено`);
                      }}
                      className="btn-ghost py-2 text-xs flex items-center justify-center gap-1"
                    >
                      <span className="cream">⬡</span> {b.price}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Avatars */}
        {tab === "avatars" && (
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {["⚡","🔥","❄️","⚔️","🏆","🎯","🌙","💎","🦅","🐉","👑","🎮","🛡️","⭐","🎲","🌊"].map((emoji, i) => (
              <button key={i} className="card-premium p-4 flex flex-col items-center gap-1.5 hover:border-muted-foreground/30 animate-fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
                <div className="text-3xl">{emoji}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">{i < 3 ? "FREE" : `⬡${(i + 1) * 30}`}</div>
              </button>
            ))}
          </div>
        )}

        {/* Topup */}
        {tab === "topup" && (
          <div className="max-w-md mx-auto">
            <p className="text-sm text-muted-foreground font-medium text-center mb-8">
              Монеты — для скинов, стикеров и аватаров в магазине
            </p>
            <div className="flex flex-col gap-3">
              {topup.map((pack, i) => (
                <div
                  key={i}
                  className={`card-premium p-5 flex items-center gap-4 animate-fade-in ${pack.popular ? "border-cream/25 bg-cream-subtle" : ""}`}
                  style={{ animationDelay: `${i * 0.09}s` }}
                >
                  {pack.popular && (
                    <div className="absolute -top-2.5 left-5 badge-cream">Популярный</div>
                  )}
                  <span className="cream font-black text-3xl">⬡</span>
                  <div className="flex-1">
                    <div className="font-black text-xl tracking-tight">{pack.coins} монет</div>
                    {pack.bonus && <div className="text-xs font-semibold text-green-400">{pack.bonus}</div>}
                  </div>
                  <button className="btn-cream px-5 py-2.5 text-sm shrink-0">{pack.price}</button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-6 font-medium">
              ЮKassa · Stripe · СБП
            </p>
          </div>
        )}
      </div>
    </div>
  );
}