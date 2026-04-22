import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { z } from "zod";
import { getMatch } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { mintTickets, ticketsForMatchByUser, useUser } from "@/lib/store";
import { toast } from "sonner";

const search = z.object({
  matchId: z.string(),
  qty: z.coerce.number().min(1).max(2).default(1),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: (s) => search.parse(s),
  component: Checkout,
  head: () => ({ meta: [{ title: "Checkout — KickToken" }] }),
});

type Stage = "idle" | "paying" | "minting" | "done";

function Checkout() {
  const { matchId, qty } = Route.useSearch();
  const match = getMatch(matchId);
  const user = useUser();
  const nav = useNavigate();
  const [stage, setStage] = useState<Stage>("idle");

  if (!match) {
    return <div className="py-20 text-center">Match not found. <Link to="/" className="text-primary underline">Go home</Link></div>;
  }
  if (!user) {
    return <div className="py-20 text-center">Please <Link to="/login" className="text-primary underline">sign in</Link>.</div>;
  }

  const owned = ticketsForMatchByUser(match.id, user.email).length;
  const allowed = Math.max(0, 2 - owned);
  const safeQty = Math.min(qty, allowed);
  const total = match.price * safeQty;

  async function pay() {
    if (allowed === 0) {
      toast.error("Limit reached: max 2 tickets per fan");
      return;
    }
    setStage("paying");
    await new Promise((r) => setTimeout(r, 900));
    setStage("minting");
    await new Promise((r) => setTimeout(r, 900));
    mintTickets(match!.id, user!.email, safeQty);
    setStage("done");
    toast.success(`${safeQty} NFT ticket${safeQty > 1 ? "s" : ""} minted!`);
    setTimeout(() => nav({ to: "/tickets" }), 1400);
  }

  if (stage === "done") {
    return (
      <div className="grid place-items-center py-20">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-center"
        >
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[image:var(--gradient-pitch)] shadow-[var(--shadow-glow)]">
            <Sparkles className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold">Ticket{safeQty > 1 ? "s" : ""} minted!</h1>
          <p className="mt-2 text-muted-foreground">Redirecting to your collection…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6">
      <h1 className="font-display text-3xl font-bold">Checkout</h1>
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
        <div className="flex items-center gap-4 border-b border-border/50 p-5">
          <div className="flex items-center gap-2 text-2xl">
            <span>{match.homeBadge}</span>
            <span className="font-mono text-xs text-muted-foreground">vs</span>
            <span>{match.awayBadge}</span>
          </div>
          <div className="flex-1">
            <div className="font-display font-bold">{match.homeTeam} vs {match.awayTeam}</div>
            <div className="text-xs text-muted-foreground">{match.stadium} · {new Date(match.date).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="space-y-3 p-5">
          <Row k="Quantity" v={`${safeQty} ticket${safeQty > 1 ? "s" : ""}`} />
          <Row k="Price" v={`$${match.price} each`} />
          <Row k="Network fee" v="$0.00" sub="Sponsored by KickToken" />
          <div className="border-t border-border/50 pt-3">
            <Row k="Total" v={`$${total}`} bold />
          </div>
        </div>
        <div className="space-y-3 border-t border-border/50 bg-background/40 p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Payment is simulated for this demo. No card is charged.
          </div>
          <div className="rounded-2xl border border-border/50 bg-card p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="text-sm font-semibold">Visa •••• 4242</div>
                <div className="text-xs text-muted-foreground">Demo card</div>
              </div>
              <div className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-success">Default</div>
            </div>
          </div>
          <Button
            disabled={stage !== "idle" || allowed === 0}
            onClick={pay}
            className="w-full bg-[image:var(--gradient-pitch)] py-6 font-semibold text-primary-foreground hover:opacity-90"
          >
            {stage === "idle" && `Pay $${total} & mint`}
            {stage === "paying" && (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing payment…</>)}
            {stage === "minting" && (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Minting NFT ticket…</>)}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, sub, bold }: { k: string; v: string; sub?: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className={`text-sm ${bold ? "font-semibold" : "text-muted-foreground"}`}>{k}</div>
        {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
      </div>
      <div className={bold ? "font-display text-xl font-bold" : "text-sm font-medium"}>{v}</div>
    </div>
  );
}