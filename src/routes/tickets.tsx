import { createFileRoute, Link } from "@tanstack/react-router";
import { Ticket as TicketIcon } from "lucide-react";
import { useTickets, useUser } from "@/lib/store";
import { getMatch } from "@/lib/data";
import { NftTicket } from "@/components/app/NftTicket";

export const Route = createFileRoute("/tickets")({
  component: TicketsPage,
  head: () => ({ meta: [{ title: "My Tickets — KickToken" }] }),
});

function TicketsPage() {
  const user = useUser();
  const tickets = useTickets();
  const mine = user ? tickets.filter((t) => t.ownerEmail === user.email) : [];

  if (!user) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Sign in to view your tickets</h1>
        <Link to="/login" className="mt-4 inline-block rounded-full bg-[image:var(--gradient-pitch)] px-6 py-2.5 font-semibold text-primary-foreground">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">My Collection</h1>
          <p className="text-sm text-muted-foreground">{mine.length} ticket{mine.length === 1 ? "" : "s"} in your wallet</p>
        </div>
        <div className="hidden rounded-full border border-border/60 bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground sm:block">
          {user.wallet.slice(0, 8)}…{user.wallet.slice(-6)}
        </div>
      </div>

      {mine.length === 0 ? (
        <div className="grid place-items-center rounded-3xl border border-dashed border-border/60 bg-card/40 py-20 text-center">
          <TicketIcon className="h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-display text-xl font-bold">No tickets yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Browse upcoming matches and mint your first NFT ticket.</p>
          <Link to="/" className="mt-5 rounded-full bg-[image:var(--gradient-pitch)] px-6 py-2.5 font-semibold text-primary-foreground">Browse matches</Link>
        </div>
      ) : (
        <div className="grid justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((t, i) => {
            const m = getMatch(t.matchId);
            if (!m) return null;
            return <NftTicket key={t.id} ticket={t} match={m} index={i} />;
          })}
        </div>
      )}
    </div>
  );
}