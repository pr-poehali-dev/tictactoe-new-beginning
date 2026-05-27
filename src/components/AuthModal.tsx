import { useState } from "react";
import Icon from "@/components/ui/icon";

interface AuthModalProps {
  mode: "login" | "register";
  onClose: () => void;
  onSuccess: (dailyBonus?: number) => void;
  onSwitch: (mode: "login" | "register") => void;
  onRegister: (login: string, email: string, password: string) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<{ daily_bonus?: number }>;
}

export default function AuthModal({ mode, onClose, onSuccess, onSwitch, onRegister, onLogin }: AuthModalProps) {
  const [form, setForm] = useState({ login: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        await onRegister(form.login, form.email, form.password);
        onSuccess();
      } else {
        const data = await onLogin(form.email, form.password);
        onSuccess(data.daily_bonus);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm bg-card border border-border rounded-xl p-7 animate-scale-in">

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="X" size={16} />
        </button>

        {/* Header */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-4">
            <span className="sym-x font-black text-xl">×</span>
            <span className="sym-o font-black text-xl">○</span>
          </div>
          <h2 className="font-black text-xl tracking-tight mb-1">
            {mode === "login" ? "Добро пожаловать" : "Создать аккаунт"}
          </h2>
          {mode === "register" && (
            <p className="text-muted-foreground text-xs">
              +50 монет в подарок при регистрации
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "register" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Логин</label>
              <input
                type="text"
                placeholder="ваш_ник"
                value={form.login}
                onChange={e => setForm({ ...form, login: e.target.value })}
                className="w-full bg-secondary border border-border rounded-md px-3.5 py-2.5 text-sm font-medium outline-none focus:border-muted-foreground transition-colors placeholder:text-muted-foreground/40"
              />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Email</label>
            <input
              type="email"
              placeholder="you@mail.ru"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-secondary border border-border rounded-md px-3.5 py-2.5 text-sm font-medium outline-none focus:border-muted-foreground transition-colors placeholder:text-muted-foreground/40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-secondary border border-border rounded-md px-3.5 py-2.5 text-sm font-medium outline-none focus:border-muted-foreground transition-colors placeholder:text-muted-foreground/40"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              <Icon name="AlertCircle" size={14} style={{ color: "#f04d6a", flexShrink: 0 }} />
              <span className="text-xs font-medium" style={{ color: "#f04d6a" }}>{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-cream w-full py-2.5 text-sm mt-1 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">или войти через</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* OAuth */}
        <div className="grid grid-cols-3 gap-2">
          {["Google", "Telegram", "ВКонтакте"].map((p) => (
            <button
              key={p}
              className="bg-secondary hover:bg-surface-3 border border-border rounded-md py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Switch */}
        <p className="text-center text-xs text-muted-foreground mt-5">
          {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
          <button
            onClick={() => { setError(""); onSwitch(mode === "login" ? "register" : "login"); }}
            className="cream hover:underline font-semibold"
          >
            {mode === "login" ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>
      </div>
    </div>
  );
}
