import { useState } from "react";
import Icon from "@/components/ui/icon";

type Filter = "all" | "season" | "weekly";

const players = [
  { rank: 1,  name: "Magnus_X",    elo: 2841, wins: 412, wr: 78, streak: 12, country: "RU", isMe: false },
  { rank: 2,  name: "Shadow_Pro",  elo: 2720, wins: 388, wr: 74, streak: 7,  country: "UA", isMe: false },
  { rank: 3,  name: "DragonByte",  elo: 2655, wins: 355, wr: 71, streak: 4,  country: "BY", isMe: false },
  { rank: 4,  name: "CryptoKing",  elo: 2588, wins: 329, wr: 69, streak: 0,  country: "RU", isMe: false },
  { rank: 5,  name: "Alexxx_Pro",  elo: 1482, wins: 89,  wr: 63, streak: 3,  country: "RU", isMe: true  },
  { rank: 6,  name: "Night_Owl",   elo: 1441, wins: 201, wr: 61, streak: 1,  country: "KZ", isMe: false },
  { rank: 7,  name: "Vanya_88",    elo: 1398, wins: 176, wr: 58, streak: 0,  country: "RU", isMe: false },
  { rank: 8,  name: "XQueen",      elo: 1371, wins: 163, wr: 57, streak: 2,  country: "RU", isMe: false },
  { rank: 9,  name: "GoldRush99",  elo: 1344, wins: 149, wr: 55, streak: 0,  country: "MD", isMe: false },
  { rank: 10, name: "PawnBreaker", elo: 1312, wins: 138, wr: 53, streak: 1,  country: "RU", isMe: false },
];

const medals = ["🥇", "🥈", "🥉"];
const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd
const podiumHeights = ["h-24", "h-32", "h-20"];

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const top3 = players.slice(0, 3);
  const rest  = players.slice(3);

  return (
    <div className="min-h-screen pt-20 pb-16 px-5">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Таблица лидеров</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="font-black text-4xl tracking-tight">Рейтинг</h1>
            <p className="text-xs text-muted-foreground font-medium">Сезон 3 · обновляется онлайн</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-1 mb-10">
          {([
            { id: "all",    label: "Всё время" },
            { id: "season", label: "Сезон 3"   },
            { id: "weekly", label: "Неделя"    },
          ] as { id: Filter; label: string }[]).map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded text-xs font-bold tracking-wide transition-all
                ${filter === f.id ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:text-foreground"}
              `}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-3 mb-10 animate-fade-in delay-100">
          {podiumOrder.map((pi, vi) => {
            const p = top3[pi];
            return (
              <div key={p.rank} className="flex flex-col items-center gap-2 flex-1 max-w-[130px]">
                <div className="text-2xl">{medals[pi]}</div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border
                  ${pi === 0
                    ? "border-cream/30 bg-cream-subtle text-foreground"
                    : "border-border bg-surface-2 text-muted-foreground"
                  }
                `}>
                  {p.name[0]}
                </div>
                <div className="text-center">
                  <div className="font-bold text-xs truncate max-w-[110px]">{p.name}</div>
                  <div className={`font-black text-sm ${pi === 0 ? "cream" : "text-muted-foreground"}`}>{p.elo}</div>
                </div>
                <div className={`w-full ${podiumHeights[vi]} rounded-t-lg flex items-start justify-center pt-2 font-black text-xl
                  ${pi === 0 ? "bg-cream-subtle border border-cream/20 cream" : "bg-surface-2 border border-border text-muted-foreground"}
                `}>
                  {p.rank}
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="card-premium overflow-hidden animate-fade-in delay-200">
          <div className="grid grid-cols-12 px-5 py-3 border-b border-border">
            <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">#</div>
            <div className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Игрок</div>
            <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Elo</div>
            <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center hidden sm:block">Победы</div>
            <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center hidden sm:block">WR%</div>
            <div className="col-span-3 sm:col-span-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">🔥</div>
          </div>
          <div className="divide-y divide-border">
            {rest.map((p, i) => (
              <div
                key={p.rank}
                className={`grid grid-cols-12 px-5 py-4 items-center transition-colors animate-fade-in
                  ${p.isMe ? "bg-cream-subtle border-l-2 border-cream" : "hover:bg-surface-2"}
                `}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="col-span-1 font-black text-sm text-muted-foreground">{p.rank}</div>
                <div className="col-span-4 flex items-center gap-2 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0
                    ${p.isMe ? "bg-cream-subtle border border-cream/30 cream" : "bg-surface-2 border border-border text-muted-foreground"}
                  `}>
                    {p.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className={`font-bold text-sm truncate ${p.isMe ? "cream" : ""}`}>{p.name}</div>
                    <div className="text-[10px] text-muted-foreground font-medium">{p.isMe ? "Вы" : p.country}</div>
                  </div>
                </div>
                <div className="col-span-2 text-center font-black text-sm">{p.elo}</div>
                <div className="col-span-2 text-center text-sm font-medium hidden sm:block text-muted-foreground">{p.wins}</div>
                <div className="col-span-2 text-center text-sm font-bold hidden sm:block">
                  <span className={p.wr >= 65 ? "cream" : "text-muted-foreground"}>{p.wr}%</span>
                </div>
                <div className="col-span-3 sm:col-span-1 text-center">
                  {p.streak > 0
                    ? <span className="text-xs font-bold text-orange-400">{p.streak}</span>
                    : <span className="text-muted-foreground text-xs">—</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My position */}
        <div className="mt-3 card-premium p-4 flex items-center gap-3 animate-fade-in delay-300">
          <Icon name="MapPin" size={14} className="cream shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm cream">Ваша позиция: #5 из 14 209</div>
            <div className="text-xs text-muted-foreground font-medium">Топ 8% · +106 очков до #4</div>
          </div>
          <Icon name="ChevronRight" size={14} className="text-muted-foreground shrink-0" />
        </div>
      </div>
    </div>
  );
}
