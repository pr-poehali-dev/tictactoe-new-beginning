import { useState } from "react";
import Icon from "@/components/ui/icon";

type Season = "all" | "season" | "weekly";

const players = [
  { rank: 1, name: "Magnus_X", elo: 2841, wins: 412, wr: 78, streak: 12, badge: "👑", country: "RU" },
  { rank: 2, name: "Shadow_Pro", elo: 2720, wins: 388, wr: 74, streak: 7, badge: "🥈", country: "UA" },
  { rank: 3, name: "DragonByte", elo: 2655, wins: 355, wr: 71, streak: 4, badge: "🥉", country: "BY" },
  { rank: 4, name: "CryptoKing", elo: 2588, wins: 329, wr: 69, streak: 0, badge: "⭐", country: "RU" },
  { rank: 5, name: "Alexxx_Pro", elo: 1482, wins: 89, wr: 63, streak: 3, badge: "🎯", country: "RU", isMe: true },
  { rank: 6, name: "Night_Owl", elo: 1441, wins: 201, wr: 61, streak: 1, badge: "🌙", country: "KZ" },
  { rank: 7, name: "Vanya_88", elo: 1398, wins: 176, wr: 58, streak: 0, badge: "", country: "RU" },
  { rank: 8, name: "XQueen", elo: 1371, wins: 163, wr: 57, streak: 2, badge: "", country: "RU" },
  { rank: 9, name: "GoldRush99", elo: 1344, wins: 149, wr: 55, streak: 0, badge: "", country: "MD" },
  { rank: 10, name: "PawnBreaker", elo: 1312, wins: 138, wr: 53, streak: 1, badge: "", country: "RU" },
];

const medals = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [season, setSeason] = useState<Season>("all");

  const top3 = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-3">Таблица лидеров</p>
          <h1 className="font-display text-5xl font-bold uppercase">Рейтинг</h1>
          <p className="text-muted-foreground mt-3 text-sm">Сезон 3 · Обновляется в реальном времени</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 justify-center mb-8">
          {([
            { id: "all", label: "За всё время" },
            { id: "season", label: "Сезон 3" },
            { id: "weekly", label: "Эта неделя" },
          ] as { id: Season; label: string }[]).map(f => (
            <button
              key={f.id}
              onClick={() => setSeason(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${season === f.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}
              `}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-3 mb-8 animate-fade-in delay-100">
          {[top3[1], top3[0], top3[2]].map((p, vi) => {
            const heights = ["h-28", "h-36", "h-24"];
            const originalRank = vi === 0 ? 1 : vi === 1 ? 0 : 2;
            return (
              <div key={p.rank} className="flex flex-col items-center gap-3 flex-1 max-w-[140px]">
                <div className="text-3xl">{medals[originalRank]}</div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-xl
                  ${originalRank === 0 ? "bg-gradient-to-br from-yellow-500/40 to-yellow-600/20 border border-yellow-500/40" : "bg-secondary border border-border"}
                `}>
                  {p.name[0]}
                </div>
                <div className="text-center">
                  <div className="font-semibold text-xs truncate max-w-[120px]">{p.name}</div>
                  <div className={`font-display font-bold text-sm ${originalRank === 0 ? "gold-text" : "text-muted-foreground"}`}>{p.elo}</div>
                </div>
                <div className={`w-full ${heights[vi]} rounded-t-xl flex items-start justify-center pt-3 font-display font-bold text-2xl
                  ${originalRank === 0 ? "bg-gradient-to-t from-primary/30 to-primary/10 border border-primary/30" : "bg-secondary border border-border"}
                `}>
                  {p.rank}
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden animate-fade-in delay-200">
          <div className="grid grid-cols-12 px-6 py-3 text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Игрок</div>
            <div className="col-span-2 text-center">Elo</div>
            <div className="col-span-2 text-center hidden sm:block">Победы</div>
            <div className="col-span-2 text-center hidden sm:block">WR%</div>
            <div className="col-span-3 sm:col-span-1 text-center">Серия</div>
          </div>
          <div className="divide-y divide-border">
            {rest.map((p, i) => (
              <div
                key={p.rank}
                className={`grid grid-cols-12 px-6 py-4 items-center transition-colors animate-fade-in
                  ${p.isMe ? "bg-primary/8 border-l-2 border-primary" : "hover:bg-secondary/30"}
                `}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="col-span-1 font-display font-bold text-muted-foreground">{p.rank}</div>
                <div className="col-span-4 flex items-center gap-2 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm flex-shrink-0
                    ${p.isMe ? "bg-primary/30 border border-primary/40" : "bg-secondary"}
                  `}>
                    {p.badge || p.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className={`font-semibold text-sm truncate ${p.isMe ? "gold-text" : ""}`}>{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.isMe ? "Вы" : p.country}</div>
                  </div>
                </div>
                <div className="col-span-2 text-center font-display font-bold text-sm">{p.elo}</div>
                <div className="col-span-2 text-center text-sm hidden sm:block">{p.wins}</div>
                <div className="col-span-2 text-center text-sm hidden sm:block">
                  <span className={p.wr >= 65 ? "gold-text font-semibold" : ""}>{p.wr}%</span>
                </div>
                <div className="col-span-3 sm:col-span-1 text-center">
                  {p.streak > 0 ? (
                    <span className="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full font-semibold">
                      🔥{p.streak}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My position highlight */}
        <div className="mt-4 glass-card rounded-xl p-4 flex items-center gap-4 border border-primary/20 animate-fade-in delay-300">
          <div className="text-2xl">📍</div>
          <div className="flex-1">
            <div className="font-semibold text-sm gold-text">Ваша позиция: #5 из 14 209 игроков</div>
            <div className="text-xs text-muted-foreground">Топ 8% · Нужно ещё 106 очков до #4</div>
          </div>
          <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
