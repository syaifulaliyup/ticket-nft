import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ScanLine, ShieldCheck, XCircle } from "lucide-react";
import { findTicket, markTicketUsed, getTickets, useUser } from "@/lib/store";
import { getMatch } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Ticket } from "@/lib/types";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Stadium Scan — KickToken" }] }),
});

type ScanResult =
  | { type: "ok"; ticket: Ticket }
  | { type: "used"; ticket: Ticket }
  | { type: "missing" };

function AdminPage() {
  const user = useUser();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanCount, setScanCount] = useState(0);

  if (!user) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Admin sign-in required</h1>
        <Link to="/login" className="mt-4 inline-block text-primary underline">Sign in</Link>
      </div>
    );
  }

  function scan(id: string) {
    const trimmed = id.trim();
    if (!trimmed) return;
    const t = findTicket(trimmed);
    if (!t) {
      setResult({ type: "missing" });
    } else if (t.status === "used") {
      setResult({ type: "used", ticket: t });
    } else {
      const updated = markTicketUsed(t.id)!;
      setResult({ type: "ok", ticket: updated });
    }
    setScanCount((n) => n + 1);
    setCode("");
  }

  function pickRandomValid() {
    const valid = getTickets().find((t) => t.status === "valid");
    if (valid) setCode(valid.id);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-4">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <ShieldCheck className="h-3.5 w-3.5" /> Stadium gate
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold">Scan ticket</h1>
        <p className="text-sm text-muted-foreground">Paste a token ID from a ticket QR to validate entry.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
        <div className="relative h-48 overflow-hidden border-b border-border/60 bg-background/40">
          <div className="absolute inset-0 grid place-items-center">
            <ScanLine className="h-20 w-20 text-primary/30" />
          </div>
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 200 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-8 h-0.5 bg-[image:var(--gradient-pitch)] shadow-[0_0_20px_var(--primary)]"
          />
          <div className="absolute left-4 top-4 h-5 w-5 border-l-2 border-t-2 border-primary" />
          <div className="absolute right-4 top-4 h-5 w-5 border-r-2 border-t-2 border-primary" />
          <div className="absolute bottom-4 left-4 h-5 w-5 border-b-2 border-l-2 border-primary" />
          <div className="absolute bottom-4 right-4 h-5 w-5 border-b-2 border-r-2 border-primary" />
        </div>
        <div className="space-y-3 p-5">
          <Input
            placeholder="0x… (paste token ID)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && scan(code)}
            className="font-mono"
          />
          <div className="flex gap-2">
            <Button onClick={() => scan(code)} className="flex-1 bg-[image:var(--gradient-pitch)] font-semibold text-primary-foreground hover:opacity-90">
              Validate
            </Button>
            <Button onClick={pickRandomValid} variant="outline">Demo: random valid</Button>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Scans this session: {scanCount}</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={JSON.stringify(result)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <ResultCard result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultCard({ result }: { result: ScanResult }) {
  if (result.type === "missing") {
    return (
      <div className="rounded-3xl border border-destructive/40 bg-destructive/10 p-5">
        <div className="flex items-center gap-3">
          <XCircle className="h-7 w-7 text-destructive" />
          <div>
            <div className="font-display text-lg font-bold">Ticket not found</div>
            <div className="text-sm text-muted-foreground">This token doesn't exist on KickToken.</div>
          </div>
        </div>
      </div>
    );
  }
  const m = getMatch(result.ticket.matchId);
  const isOk = result.type === "ok";
  return (
    <div className={`rounded-3xl border p-5 ${isOk ? "border-success/40 bg-success/10" : "border-warning/40 bg-warning/10"}`}>
      <div className="flex items-center gap-3">
        {isOk ? <CheckCircle2 className="h-7 w-7 text-success" /> : <XCircle className="h-7 w-7 text-warning" />}
        <div>
          <div className="font-display text-lg font-bold">
            {isOk ? "Entry granted" : "Already used"}
          </div>
          <div className="text-sm text-muted-foreground">
            {isOk ? "Marked as used. Welcome in!" : "This ticket has been scanned before."}
          </div>
        </div>
      </div>
      {m && (
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-border/50 bg-background/40 p-4 text-sm">
          <Field k="Match" v={`${m.homeTeam} vs ${m.awayTeam}`} />
          <Field k="Stadium" v={m.stadium} />
          <Field k="Section" v={result.ticket.section} />
          <Field k="Seat" v={result.ticket.seat} />
          <Field k="Serial" v={`#${String(result.ticket.serial).padStart(5, "0")}`} />
          <Field k="Owner" v={result.ticket.ownerEmail} />
        </div>
      )}
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="truncate font-medium">{v}</div>
    </div>
  );
}