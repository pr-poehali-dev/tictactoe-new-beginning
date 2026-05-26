import { useState } from "react";
import Icon from "@/components/ui/icon";

interface AuthModalProps {
  mode: "login" | "register";
  onClose: () => void;
  onSuccess: () => void;
  onSwitch: (mode: "login" | "register") => void;
}

export default function AuthModal({ mode, onClose, onSuccess, onSwitch }: AuthModalProps) {
  const [form, setForm] = useState({ login: "", email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md glass-card rounded-2xl p-8 animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <Icon name="X" size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-4 text-4xl">
            <span className="symbol-x">X</span>
            <span className="symbol-o">O</span>
          </div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-widest">
            {mode === "login" ? "Вход" : "Регистрация"}
          </h2>
          {mode === "register" && (
            <p className="text-muted-foreground text-sm mt-2">
              🎁 +50 монет за регистрацию
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "register" && (
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Логин</label>
              <input
                type="text"
                placeholder="ваш_ник"
                value={form.login}
                onChange={e => setForm({ ...form, login: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
          )}
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
            <input
              type="email"
              placeholder="you@mail.ru"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-primary text-primary-foreground font-display font-semibold uppercase tracking-widest py-3 rounded-lg hover:opacity-90 transition-opacity animate-pulse-gold"
          >
            {mode === "login" ? "Войти" : "Создать аккаунт"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">или</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["Google", "Telegram", "ВКонтакте"].map((p) => (
              <button key={p} className="bg-secondary hover:bg-secondary/70 border border-border rounded-lg py-2.5 text-xs font-medium transition-colors">
                {p}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
          <button
            onClick={() => onSwitch(mode === "login" ? "register" : "login")}
            className="gold-text hover:underline font-medium"
          >
            {mode === "login" ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>
      </div>
    </div>
  );
}
