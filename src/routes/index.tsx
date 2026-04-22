import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Zap } from "lucide-react";
import { MATCHES } from "@/lib/data";
import { MatchCard } from "@/components/app/MatchCard";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "KickToken — Upcoming Matches" },
      { name: "description", content: "Browse upcoming football matches and grab your NFT ticket." },
    ],
  }),
});

function Index() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card px-6 py-12 sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-glow)]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            On-chain ticketing for the beautiful game
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Real tickets. <span className="text-gradient">Zero fakes.</span><br />
            Owned by you.
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
            Every KickToken is a unique NFT — minted to your wallet, scanned at the gate, impossible to duplicate.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#matches" className="rounded-full bg-[image:var(--gradient-pitch)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-90">
              Browse matches
            </a>
            <a href="#how" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:bg-secondary">
              How it works
            </a>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 text-left">
            {[
              { icon: ShieldCheck, label: "Anti-counterfeit", v: "100%" },
              { icon: Zap, label: "Instant mint", v: "<2s" },
              { icon: Sparkles, label: "Per fan", v: "Max 2" },
            ].map(({ icon: Icon, label, v }) => (
              <div key={label} className="rounded-2xl border border-border/60 bg-background/40 p-3 backdrop-blur">
                <Icon className="h-4 w-4 text-primary" />
                <div className="mt-2 font-display text-lg font-bold">{v}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Matches */}
      <section id="matches" className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Upcoming matches</h2>
            <p className="text-sm text-muted-foreground">Mint your seat before kick-off.</p>
          </div>
          <div className="hidden text-xs text-muted-foreground sm:block">{MATCHES.length} fixtures</div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MATCHES.map((m) => <MatchCard key={m.id} match={m} />)}
        </div>
      </section>

      {/* How */}
      <section id="how" className="rounded-3xl border border-border/60 bg-card p-8">
        <h2 className="font-display text-2xl font-bold">How KickToken works</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            { n: "01", t: "Sign in", d: "Sign in with email — we auto-create a custodial wallet for you. No crypto knowledge needed." },
            { n: "02", t: "Mint your ticket", d: "Pick a match, choose up to 2 seats, and we mint a unique NFT ticket to your wallet." },
            { n: "03", t: "Scan at the gate", d: "Show the QR at the stadium. One scan, one entry. Tickets can't be resold or faked." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-border/50 bg-background/40 p-5">
              <div className="font-mono text-xs text-primary">{s.n}</div>
              <div className="mt-2 font-display text-lg font-bold">{s.t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
