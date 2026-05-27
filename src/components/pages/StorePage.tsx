import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import FUNCTIONS from "@/lib/api";

const PAYMENT_URL = FUNCTIONS.payment;

interface StorePageProps {
  coins: number;
  setCoins: (c: number) => void;
}

type Tab = "skins" | "boards" | "avatars" | "topup";

const PACKAGES = [
  {
    id: "coins_100",
    coins: 100,
    totalCoins: 100,
    rub: 99,
    bonus: "",
    popular: false,
  },
  {
    id: "coins_500",
    coins: 500,
    totalCoins: 550,
    rub: 399,
    bonus: "+50 в подарок",
    popular: true,
  },
  {
    id: "coins_1500",
    coins: 1500,
    totalCoins: 1800,
    rub: 999,
    bonus: "+300 в подарок",
    popular: false,
  },
];

const skins = [
  { id: 1, name: "Деревянный", sym: "✕", symO: "○", cX: "#c8a96e", cO: "#8fa8b8", price: 0,   tag: "free" },
  { id: 2, name: "Карандаш",   sym: "✗", symO: "◯", cX: "#d4cfc0", cO: "#a0b4c0", price: 0,   tag: "free" },
  { id: 3, name: "Неоновый",   sym: "×", symO: "○", cX: "#d4a96a", cO: "#7ab3e0", price: 120, tag: "hit"  },
  { id: 4, name: "Стимпанк",   sym: "⚙", symO: "⬡", cX: "#c8955a", cO: "#8fa8b8", price: 200, tag: ""    },
  { id: 5, name: "Кристалл",   sym: "◈", symO: "◇", cX: "#9eb8cc", cO: "#d4c49a", price: 180, tag: "new" },
  { id: 6, name: "Огонь",      sym: "✦", symO: "✧", cX: "#cc8855", cO: "#7a9dbf", price: 250, tag: ""    },
  { id: 7, name: "Тень",       sym: "▲", symO: "▽", cX: "#a090c0", cO: "#90a8c0", price: 300, tag: "prem"},
  { id: 8, name: "Меч & Щит",  sym: "⚔", symO: "🛡", cX: "#e0ddd5", cO: "#8fa8b8", price: 500, tag: "anim"},
];

const boards = [
  { id: 1, name: "Классика",  desc: "Минималистичное поле",      price: 0,   color: "#c8a96e" },
  { id: 2, name: "Мрамор",    desc: "Тёмный полированный камень", price: 150, color: "#94a3b8" },
  { id: 3, name: "Галактика", desc: "Звёздное космическое поле",  price: 280, color: "#818cf8" },
  { id: 4, name: "Лес",       desc: "Зелёная природа",           price: 200, color: "#4ade80" },
];

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "skins",  label: "Скины",    icon: "Sparkles"   },
  { id: "boards", label: "Поля",     icon: "Grid3X3"    },
  { id: "avatars",label: "Аватары",  icon: "UserCircle" },
  { id: "topup",  label: "Пополнить",icon: "Coins"      },
];

export default function StorePage({ coins, setCoins }: StorePageProps) {
  const [tab, setTab]               = useState<Tab>("skins");
  const [selected, setSelected]     = useState(1);
  const [ownedSkins, setOwnedSkins] = useState([1, 2]);
  const [ownedBoards, setOwnedBoards] = useState([1]);
  const [notif, setNotif]           = useState("");
  const [notifType, setNotifType]   = useState<"ok" | "err">("ok");

  // Состояние оплаты
  const [paying, setPaying]               = useState<string | null>(null);
  const [pendingPaymentId, setPendingPaymentId] = useState<number | null>(null);
  const [checkingPayment, setCheckingPayment]   = useState(false);

  const toast = (msg: string, type: "ok" | "err" = "ok") => {
    setNotif(msg); setNotifType(type);
    setTimeout(() => setNotif(""), 3000);
  };

  const buySkin = (skin: typeof skins[0]) => {
    if (ownedSkins.includes(skin.id)) return toast("Уже в коллекции");
    if (skin.price === 0) { setOwnedSkins(p => [...p, skin.id]); return toast("Скин получен!"); }
    if (coins < skin.price) return toast("Недостаточно монет — пополни баланс", "err");
    setCoins(coins - skin.price);
    setOwnedSkins(p => [...p, skin.id]);
    toast(`«${skin.name}» куплен`);
  };

  const buyBoard = (board: typeof boards[0]) => {
    if (ownedBoards.includes(board.id)) return;
    if (coins < board.price) return toast("Недостаточно монет", "err");
    setCoins(coins - board.price);
    setOwnedBoards(p => [...p, board.id]);
    toast(`«${board.name}» куплено`);
  };

  const handleBuyCoins = async (pkg: typeof PACKAGES[0]) => {
    const token = localStorage.getItem("xo_token");
    if (!token) return toast("Войди в аккаунт, чтобы купить монеты", "err");

    setPaying(pkg.id);
    try {
      const res = await fetch(PAYMENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          action: "create",
          package_id: pkg.id,
          return_url: window.location.href,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");

      setPendingPaymentId(data.payment_id);
      // Открываем страницу оплаты ЮKassa в новой вкладке
      window.open(data.confirmation_url, "_blank");
      toast("Страница оплаты открыта в новой вкладке");
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Ошибка создания платежа", "err");
    } finally {
      setPaying(null);
    }
  };

  const checkPaymentStatus = async () => {
    if (!pendingPaymentId) return;
    const token = localStorage.getItem("xo_token");
    if (!token) return;

    setCheckingPayment(true);
    try {
      const res = await fetch(PAYMENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ action: "status", payment_id: pendingPaymentId }),
      });
      const data = await res.json();
      if (data.status === "paid") {
        setCoins(data.user_coins);
        setPendingPaymentId(null);
        toast(`Оплата прошла! Монеты зачислены`);
      } else {
        toast("Платёж ещё не подтверждён — подожди немного", "err");
      }
    } catch {
      toast("Ошибка проверки платежа", "err");
    } finally {
      setCheckingPayment(false);
    }
  };

  // Автопроверка статуса при возврате на вкладку
  useEffect(() => {
    if (!pendingPaymentId) return;
    const handler = () => { if (!document.hidden) checkPaymentStatus(); };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [pendingPaymentId]);

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

        {/* Баннер ожидающего платежа */}
        {pendingPaymentId && (
          <div className="mb-6 bg-cream-subtle border border-cream/25 rounded-xl p-4 flex items-center gap-4 animate-fade-in">
            <div className="text-2xl">⏳</div>
            <div className="flex-1">
              <div className="font-bold text-sm">Ожидаем подтверждение оплаты</div>
              <div className="text-xs text-muted-foreground font-medium">После оплаты нажми кнопку — монеты зачислятся мгновенно</div>
            </div>
            <button
              onClick={checkPaymentStatus}
              disabled={checkingPayment}
              className="btn-cream text-xs px-4 py-2 shrink-0 disabled:opacity-60"
            >
              {checkingPayment ? "Проверяю..." : "Проверить оплату"}
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold tracking-wide transition-all border-b-2 -mb-px
                ${tab === t.id ? "border-cream cream" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <Icon name={t.icon} size={13} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Toast */}
        {notif && (
          <div className={`fixed top-16 right-4 z-50 border px-4 py-2.5 rounded-lg animate-slide-in-right text-xs font-bold
            ${notifType === "ok"
              ? "bg-card border-border cream"
              : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}>
            {notifType === "ok" ? "✓ " : "✕ "}{notif}
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
                    ${active && owned ? "border-cream/40 bg-cream-subtle" : ""}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => owned && setSelected(skin.id)}
                >
                  <div className="self-stretch flex justify-end items-start">
                    {skin.tag === "hit"  && <span className="badge-cream">ХИТ</span>}
                    {skin.tag === "new"  && <span className="badge-cream">НОВИНКА</span>}
                    {skin.tag === "free" && <span className="badge-muted">БЕСПЛАТНО</span>}
                    {skin.tag === "prem" && <span className="badge-muted">ПРЕМИУМ</span>}
                    {skin.tag === "anim" && <span className="badge-cream">АНИМАЦИЯ</span>}
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
                        ${active ? "bg-cream text-primary-foreground" : "bg-surface-2 text-muted-foreground hover:text-foreground"}`}
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
                      onClick={() => buyBoard(b)}
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

        {/* Topup — реальная оплата */}
        {tab === "topup" && (
          <div className="max-w-md mx-auto">
            <p className="text-sm text-muted-foreground font-medium text-center mb-8">
              Монеты нужны для скинов, ставок и турниров
            </p>
            <div className="flex flex-col gap-3">
              {PACKAGES.map((pkg, i) => (
                <div
                  key={pkg.id}
                  className={`relative card-premium p-5 flex items-center gap-4 animate-fade-in
                    ${pkg.popular ? "border-cream/30 bg-cream-subtle" : ""}`}
                  style={{ animationDelay: `${i * 0.09}s` }}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2.5 left-5 badge-cream">Популярный</div>
                  )}
                  <span className="cream font-black text-3xl leading-none">⬡</span>
                  <div className="flex-1">
                    <div className="font-black text-xl tracking-tight">
                      {pkg.totalCoins} монет
                    </div>
                    {pkg.bonus && (
                      <div className="text-xs font-semibold text-green-400">{pkg.bonus}</div>
                    )}
                  </div>
                  <button
                    onClick={() => handleBuyCoins(pkg)}
                    disabled={paying === pkg.id}
                    className="btn-cream px-5 py-2.5 text-sm shrink-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {paying === pkg.id && (
                      <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    )}
                    {pkg.rub} ₽
                  </button>
                </div>
              ))}
            </div>

            {/* Способы оплаты */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Icon name="CreditCard" size={14} />
                <span className="text-xs font-medium">Банковская карта · СБП · ЮMoney</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Icon name="Shield" size={12} />
                <span className="text-xs font-medium">Безопасная оплата через ЮKassa</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}