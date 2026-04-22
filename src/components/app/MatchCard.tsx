import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Users } from "lucide-react";
import type { Match } from "@/lib/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }) +
    " · " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function MatchCard({ match }: { match: Match }) {
  const remaining = match.totalSeats - match.soldSeats;
  const pct = Math.round((match.soldSeats / match.totalSeats) * 100);
  return (
    <Link
      to="/match/$matchId"
      params={{ matchId: match.id }}
      className="group relative block overflow-hidden rounded-3xl border border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
    >
      <div className={`relative h-32 bg-gradient-to-br ${match.heroColor}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.85_0.22_135/40%),transparent_50%)]" />
        <div className="absolute left-4 top-3 rounded-full border border-white/15 bg-black/30 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur">
          {match.competition}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl drop-shadow-lg">{match.homeBadge}</span>
            <span className="font-mono text-xs font-bold text-white/60">VS</span>
            <span className="text-3xl drop-shadow-lg">{match.awayBadge}</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="font-display text-lg font-bold leading-tight">
            {match.homeTeam} <span className="text-muted-foreground">vs</span> {match.awayTeam}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(match.date)}</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{match.stadium}</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-3.5 w-3.5" />{remaining.toLocaleString()} seats left</span>
            <span className="font-mono text-muted-foreground">{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-[image:var(--gradient-pitch)] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border/50 pt-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">From</div>
            <div className="font-display text-xl font-bold text-gradient">${match.price}</div>
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            View →
          </div>
        </div>
      </div>
    </Link>
  );
}