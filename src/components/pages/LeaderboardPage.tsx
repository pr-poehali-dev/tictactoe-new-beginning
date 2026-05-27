import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import FUNCTIONS from "@/lib/api";

type Period = "all" | "week";

interface Player {
  position: number;
  id: number;
  login: string;
  avatar_emoji: string;
  elo: number;
  rank: string;
  is_pro: boolean;
  wins: number;
  total_games: number;
  win_rate: number;
}

const podiumOrder = [1, 0, 2];
const podiumMedals = ["🥇", "🥈", "🥉"];
const podiumHeights = ["h-24", "h-32", "h-20"];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("all");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("xo_token");
    if (token) {
      fetch(FUNCTIONS.auth, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ action: "me" }),
      })
        .then(r => r.json())
        .then(d => { if (d.user) setMyId(d.user.id); })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(FUNCTIONS.game, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "leaderboard", period, limit: 50 }),
    })
      .then(r => r.json())
      .then(d => setPlayers(d.players || []))
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  }, [period]);

  const top3 = players.slice(0, 3);
  const rest  = players.slice(3);
  const myPosition = myId ? players.findIndex(p => p.id === myId) : -1;
  const myPlayer   = myPosition >= 0 ? players[myPosition] : null;

  return (
    <div className="min-h-screen pt-20 pb-16 px-5">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Таблица лидеров</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="font-black text-4xl tracking-tight">Рейтинг</h1>
            <p className="text-xs text-muted-foreground font-medium">
              {players.length > 0 ? `${players.length} игроков · обновляется онлайн` : ""}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-1 mb-10">
          {([
            { id: "all",  label: "Всё время" },
            { id: "week", label: "Эта неделя" },
          ] as { id: Period; label: string }[]).map(f => (
            <button
              key={f.id}
              onClick={() => setPeriod(f.id)}
              className={`px-4 py-2 rounded text-xs font-bold tracking-wide transition-all
                ${period === f.id ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground animate-fade-in">
            <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Загружаем рейтинг...</span>
          </div>
        )}

        {/* Empty */}
        {!loading && players.length === 0 && (
          <div className="text-center py-24 text-muted-foreground animate-fade-in">
            <div className="text-4xl mb-3">🏆</div>
            <div className="font-bold text-sm">Рейтинг пока пуст</div>
            <div className="text-xs mt-1">Сыграй первую игру и займи #1!</div>
          </div>
        )}

        {/* Podium */}
        {!loading && top3.length === 3 && (
          <div className="flex items-end justify-center gap-3 mb-10 animate-fade-in">
            {podiumOrder.map((pi, vi) => {
              const p = top3[pi];
              const isMe = p.id === myId;
              return (
                <div key={p.id} className="flex flex-col items-center gap-2 flex-1 max-w-[130px]">
                  <div className="text-2xl">{podiumMedals[pi]}</div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border
                    ${pi === 0 ? "border-cream/30 bg-cream-subtle" : "border-border bg-surface-2"}`}>
                    {p.avatar_emoji}
                  </div>
                  <div className="text-center">
                    <div className={`font-bold text-xs truncate max-w-[110px] ${isMe ? "cream" : ""}`}>{p.login}</div>
                    <div className={`font-black text-sm ${pi === 0 ? "cream" : "text-muted-foreground"}`}>{p.elo}</div>
                    {p.is_pro && <span className="badge-cream text-[9px]">PRO</span>}
                  </div>
                  <div className={`w-full ${podiumHeights[vi]} rounded-t-lg flex items-start justify-center pt-2 font-black text-xl
                    ${pi === 0 ? "bg-cream-subtle border border-cream/20 cream" : "bg-surface-2 border border-border text-muted-foreground"}`}>
                    {pi + 1}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table */}
        {!loading && rest.length > 0 && (
          <div className="card-premium overflow-hidden animate-fade-in">
            <div className="grid grid-cols-12 px-5 py-3 border-b border-border">
              <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">#</div>
              <div className="col-span-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Игрок</div>
              <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Elo</div>
              <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center hidden sm:block">Победы</div>
              <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center hidden sm:block">% побед</div>
            </div>
            <div className="divide-y divide-border">
              {rest.map((p, i) => {
                const isMe = p.id === myId;
                return (
                  <div
                    key={p.id}
                    className={`grid grid-cols-12 px-5 py-4 items-center transition-colors animate-fade-in
                      ${isMe ? "bg-cream-subtle border-l-2 border-cream" : "hover:bg-surface-2"}`}
                    style={{ animationDelay: `${i * 0.03}s` }}
                  >
                    <div className="col-span-1 font-black text-sm text-muted-foreground">{p.position}</div>
                    <div className="col-span-5 flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0 border
                        ${isMe ? "border-cream/30 bg-cream-subtle" : "border-border bg-surface-2"}`}>
                        {p.avatar_emoji}
                      </div>
                      <div className="min-w-0">
                        <div className={`font-bold text-sm truncate flex items-center gap-1 ${isMe ? "cream" : ""}`}>
                          {p.login}
                          {p.is_pro && <span className="badge-cream text-[8px] py-0">PRO</span>}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-medium">{p.rank}{isMe ? " · Вы" : ""}</div>
                      </div>
                    </div>
                    <div className="col-span-2 text-center font-black text-sm">{p.elo}</div>
                    <div className="col-span-2 text-center text-sm font-medium hidden sm:block text-muted-foreground">{p.wins}</div>
                    <div className="col-span-2 text-center text-sm font-bold hidden sm:block">
                      <span className={p.win_rate >= 65 ? "cream" : "text-muted-foreground"}>{p.win_rate}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* My position */}
        {!loading && myPlayer && (
          <div className="mt-3 card-premium p-4 flex items-center gap-3 animate-fade-in">
            <Icon name="MapPin" size={14} className="cream shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm cream">Ваша позиция: #{myPlayer.position} из {players.length}</div>
              <div className="text-xs text-muted-foreground font-medium">
                Elo: {myPlayer.elo} · {myPlayer.wins} побед · {myPlayer.win_rate}% побед
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
