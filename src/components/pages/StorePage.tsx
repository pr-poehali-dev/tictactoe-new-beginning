import { useState } from "react";
import Icon from "@/components/ui/icon";

interface StorePageProps {
  coins: number;
  setCoins: (c: number) => void;
}

type Tab = "skins" | "boards" | "avatars" | "topup";

const skins = [
  { id: 1, name: "Деревянный", symbol: "✕", symbolO: "○", color: "#c8a96e", free: true, owned: true, price: 0, tag: "" },
  { id: 2, name: "Карандаш", symbol: "✗", symbolO: "◯", color: "#e8e4d4", free: true, owned: false, price: 0, tag: "БЕСПЛАТНО" },
  { id: 3, name: "Неоновый", symbol: "X", symbolO: "O", color: "#f0b429", free: false, owned: false, price: 120, tag: "ХИТ" },
  { id: 4, name: "Стимпанк", symbol: "⚙", symbolO: "⬡", color: "#cd7f32", free: false, owned: false, price: 200, tag: "" },
  { id: 5, name: "Кристалл", symbol: "◈", symbolO: "◇", color: "#67e8f9", free: false, owned: false, price: 180, tag: "НОВИНКА" },
  { id: 6, name: "Огонь", symbol: "✦", symbolO: "✧", color: "#f97316", free: false, owned: false, price: 250, tag: "" },
  { id: 7, name: "Тень", symbol: "▲", symbolO: "▽", color: "#a78bfa", free: false, owned: false, price: 300, tag: "ПРЕМИУМ" },
  { id: 8, name: "Меч & Щит", symbol: "⚔", symbolO: "🛡", color: "#e2e8f0", free: false, owned: false, price: 500, tag: "АНИМЕ" },
];

const boards = [
  { id: 1, name: "Классика", desc: "Минималистичное деревянное поле", price: 0, owned: true, color: "#c8a96e" },
  { id: 2, name: "Мрамор", desc: "Тёмный полированный мрамор", price: 150, owned: false, color: "#94a3b8" },
  { id: 3, name: "Галактика", desc: "Космическое звёздное поле", price: 280, owned: false, color: "#818cf8" },
  { id: 4, name: "Лес", desc: "Зелёная трава и природа", price: 200, owned: false, color: "#4ade80" },
];

const topupPacks = [
  { coins: 100, price: "59 ₽", bonus: "", popular: false },
  { coins: 500, price: "249 ₽", bonus: "+50 в подарок", popular: true },
  { coins: 1500, price: "699 ₽", bonus: "+300 в подарок", popular: false },
];

export default function StorePage({ coins, setCoins }: StorePageProps) {
  const [tab, setTab] = useState<Tab>("skins");
  const [selected, setSelected] = useState(1);
  const [ownedSkins, setOwnedSkins] = useState([1]);
  const [ownedBoards, setOwnedBoards] = useState([1]);
  const [notification, setNotification] = useState("");

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 2500);
  };

  const buySkin = (skin: typeof skins[0]) => {
    if (skin.owned || ownedSkins.includes(skin.id)) return showNotif("Уже куплено!");
    if (skin.free) { setOwnedSkins([...ownedSkins, skin.id]); return showNotif("Получен!"); }
    if (coins < skin.price) return showNotif("Недостаточно монет!");
    setCoins(coins - skin.price);
    setOwnedSkins([...ownedSkins, skin.id]);
    showNotif(`«${skin.name}» куплен!`);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "skins", label: "Скины", icon: "Sparkles" },
    { id: "boards", label: "Поля", icon: "Grid3X3" },
    { id: "avatars", label: "Аватары", icon: "UserCircle" },
    { id: "topup", label: "Пополнить", icon: "Coins" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-1">Магазин</p>
            <h1 className="font-display text-4xl font-bold uppercase">Кастомизация</h1>
          </div>
          <div className="flex items-center gap-3 bg-secondary border border-border rounded-xl px-5 py-3">
            <span className="gold-text text-xl">⬡</span>
            <div>
              <div className="font-display font-bold text-2xl">{coins}</div>
              <div className="text-xs text-muted-foreground">монет</div>
            </div>
            <button onClick={() => setTab("topup")} className="ml-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
              + Купить
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border pb-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-semibold transition-all
                ${tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}
              `}
            >
              <Icon name={t.icon} size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Notification */}
        {notification && (
          <div className="fixed top-20 right-4 z-50 glass-card border border-primary/30 px-5 py-3 rounded-xl animate-slide-in-right gold-text font-semibold text-sm">
            ✓ {notification}
          </div>
        )}

        {/* Skins Tab */}
        {tab === "skins" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {skins.map((skin, i) => {
              const isOwned = ownedSkins.includes(skin.id);
              const isActive = selected === skin.id;
              return (
                <div
                  key={skin.id}
                  className={`glass-card rounded-2xl p-5 flex flex-col items-center gap-3 border transition-all duration-200 cursor-pointer animate-fade-in
                    ${isActive ? "border-primary bg-primary/8 scale-[1.02]" : "border-border hover:border-primary/30"}
                  `}
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => isOwned && setSelected(skin.id)}
                >
                  {skin.tag && (
                    <div className={`self-end text-xs font-bold px-2 py-0.5 rounded-full -mt-1
                      ${skin.tag === "ХИТ" ? "bg-primary/20 gold-text" : skin.tag === "НОВИНКА" ? "bg-cyan-900/40 text-cyan-400" : skin.tag === "БЕСПЛАТНО" ? "bg-green-900/40 text-green-400" : "bg-violet-900/40 text-violet-300"}
                    `}>
                      {skin.tag}
                    </div>
                  )}
                  {!skin.tag && <div className="h-5" />}
                  <div className="flex gap-3 text-4xl font-display font-bold" style={{ color: skin.color }}>
                    <span>{skin.symbol}</span>
                    <span>{skin.symbolO}</span>
                  </div>
                  <div className="font-semibold text-sm text-center">{skin.name}</div>
                  {isOwned ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(skin.id); }}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition-all
                        ${isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}
                      `}
                    >
                      {isActive ? "✓ Выбрано" : "Выбрать"}
                    </button>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); buySkin(skin); }}
                      className="w-full py-2 rounded-lg text-xs font-bold bg-primary/10 gold-text hover:bg-primary/20 border border-primary/30 transition-all flex items-center justify-center gap-1"
                    >
                      <span>⬡</span> {skin.price === 0 ? "Бесплатно" : skin.price}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Boards Tab */}
        {tab === "boards" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {boards.map((b, i) => {
              const isOwned = ownedBoards.includes(b.id);
              return (
                <div key={b.id} className="glass-card rounded-2xl p-5 flex flex-col gap-3 border border-border hover:border-primary/30 transition-all animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="h-24 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${b.color}20, ${b.color}08)`, border: `1px solid ${b.color}30` }}>
                    <div className="grid grid-cols-3 gap-1">
                      {Array(9).fill(null).map((_, j) => (
                        <div key={j} className="w-5 h-5 rounded-sm" style={{ background: `${b.color}25`, border: `1px solid ${b.color}40` }} />
                      ))}
                    </div>
                  </div>
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.desc}</div>
                  {isOwned ? (
                    <button className="bg-primary text-primary-foreground py-2 rounded-lg text-xs font-bold">✓ Активно</button>
                  ) : (
                    <button
                      onClick={() => {
                        if (coins < b.price) return showNotif("Недостаточно монет!");
                        setCoins(coins - b.price); setOwnedBoards([...ownedBoards, b.id]); showNotif(`«${b.name}» куплено!`);
                      }}
                      className="w-full py-2 rounded-lg text-xs font-bold bg-primary/10 gold-text hover:bg-primary/20 border border-primary/30 transition-all flex items-center justify-center gap-1"
                    >
                      <span>⬡</span> {b.price}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Avatars Tab */}
        {tab === "avatars" && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {["⚡","🔥","❄️","⚔️","🏆","🎯","🌙","💎","🦅","🐉","👑","🎮","🛡️","⭐","🎲"].map((emoji, i) => (
              <button key={i} className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 border border-border hover:border-primary/40 transition-all animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="text-4xl">{emoji}</div>
                <div className="text-xs text-muted-foreground">{i < 3 ? "Бесплатно" : `⬡ ${(i + 1) * 30}`}</div>
              </button>
            ))}
          </div>
        )}

        {/* Top-up Tab */}
        {tab === "topup" && (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <p className="text-muted-foreground">Монеты используются для покупки скинов и стикеров в игре</p>
            </div>
            <div className="flex flex-col gap-4">
              {topupPacks.map((pack, i) => (
                <div key={i} className={`relative glass-card rounded-2xl p-6 flex items-center gap-5 border transition-all animate-fade-in
                  ${pack.popular ? "border-primary/40 bg-primary/5" : "border-border"}
                `} style={{ animationDelay: `${i * 0.1}s` }}>
                  {pack.popular && (
                    <div className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      Популярный
                    </div>
                  )}
                  <div className="text-4xl">⬡</div>
                  <div className="flex-1">
                    <div className="font-display font-bold text-2xl">{pack.coins} монет</div>
                    {pack.bonus && <div className="text-green-400 text-sm font-semibold">{pack.bonus}</div>}
                  </div>
                  <button className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap">
                    {pack.price}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-6">
              Оплата через ЮKassa · Stripe · СБП
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
