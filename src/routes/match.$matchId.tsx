import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Calendar, MapPin, Users, ShieldCheck, Ticket as TicketIcon, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { getMatch } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useUser, ticketsForMatchByUser } from "@/lib/store";

export const Route = createFileRoute("/match/$matchId")({
  component: MatchDetail,
  loader: ({ params }) => {
    const match = getMatch(params.matchId);
    if (!match) throw notFound();
    return { match };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.match.homeTeam} vs ${loaderData.match.awayTeam} — KickToken` },
          { name: "description", content: `${loaderData.match.competition} at ${loaderData.match.stadium}` },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <h1 className="font-display text-2xl font-bold">Match not found</h1>
      <Link to="/" className="mt-4 inline-block text-primary underline">Back to matches</Link>
    </div>
  ),
});

function MatchDetail() {
  const { match } = Route.useLoaderData();
  const user = useUser();
  const nav = useNavigate();
  const owned = user ? ticketsForMatchByUser(match.id, user.email).length : 0;
  const remaining = Math.max(0, 2 - owned);
  const [qty, setQty] = useState(1);
  const date = new Date(match.date);

  function buy() {
    if (!user) {
      nav({ to: "/login" });
      return;
    }
    nav({ to: "/checkout", search: { matchId: match.id, qty } });
  }

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All matches
      </Link>
      <div className={`relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br ${match.heroColor} p-8 sm:p-12`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.85_0.22_135/30%),transparent_50%)]" />
        <div className="relative">
          <div className="inline-flex rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
            {match.competition}
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 sm:gap-12">
            <div className="text-center">
              <div className="text-6xl drop-shadow-2xl sm:text-7xl">{match.homeBadge}</div>
              <div className="mt-2 font-display text-lg font-bold sm:text-2xl">{match.homeTeam}</div>
            </div>
            <div className="font-mono text-2xl font-bold text-white/50 sm:text-3xl">VS</div>
            <div className="text-center">
              <div className="text-6xl drop-shadow-2xl sm:text-7xl">{match.awayBadge}</div>
              <div className="mt-2 font-display text-lg font-bold sm:text-2xl">{match.awayTeam}</div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{date.toLocaleString(undefined, { weekday: "long", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{match.stadium}, {match.city}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <div className="space-y-4 rounded-3xl border border-border/60 bg-card p-6">
          <h2 className="font-display text-xl font-bold">About this match</h2>
          <p className="text-sm text-muted-foreground">
            A clash you don't want to miss. Mint a tamper-proof NFT ticket and own a digital memorabilia of the night.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Capacity" value={match.totalSeats.toLocaleString()} />
            <Stat label="Sold" value={match.soldSeats.toLocaleString()} />
            <Stat label="Available" value={(match.totalSeats - match.soldSeats).toLocaleString()} />
            <Stat label="Per fan" value="Max 2" />
          </div>
          <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <div className="font-semibold">Anti-scalping enforced</div>
                <div className="mt-0.5 text-muted-foreground">Limit of 2 tickets per fan. Tickets cannot be transferred to prevent resale.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-border/60 bg-card p-6">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Price per ticket</div>
            <div className="font-display text-4xl font-bold text-gradient">${match.price}</div>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Quantity</label>
            <div className="flex items-center gap-2">
              {[1, 2].map((n) => (
                <button
                  key={n}
                  disabled={n > remaining}
                  onClick={() => setQty(n)}
                  className={`flex-1 rounded-xl border px-4 py-3 font-display text-lg font-bold transition ${qty === n ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:border-primary/40"} disabled:cursor-not-allowed disabled:opacity-30`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> You own {owned} / 2 for this match
            </div>
          </div>
          <div className="border-t border-border/50 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-display text-2xl font-bold">${match.price * qty}</span>
            </div>
          </div>
          <Button
            disabled={remaining === 0}
            onClick={buy}
            className="w-full bg-[image:var(--gradient-pitch)] py-6 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90"
          >
            <TicketIcon className="mr-2 h-4 w-4" />
            {remaining === 0 ? "Limit reached" : "Mint ticket"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-background/50 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-bold">{value}</div>
    </div>
  );
}