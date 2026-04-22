import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { motion } from "framer-motion";
import type { Match } from "@/lib/types";
import type { Ticket } from "@/lib/types";

interface Props {
  ticket: Ticket;
  match: Match;
  index?: number;
}

export function NftTicket({ ticket, match, index = 0 }: Props) {
  const [qr, setQr] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(ticket.id, {
      margin: 1,
      width: 240,
      color: { dark: "#0b1220", light: "#d9ffb3" },
    }).then(setQr);
  }, [ticket.id]);

  const used = ticket.status === "used";
  const date = new Date(match.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 90 }}
      className="group relative w-full max-w-sm"
      style={{ perspective: 1000 }}
    >
      <div
        className={`relative overflow-hidden rounded-3xl border border-border/60 shadow-[var(--shadow-elegant)] transition-transform duration-500 group-hover:scale-[1.01] ${used ? "opacity-70 grayscale" : ""}`}
        style={{ background: "var(--gradient-ticket)" }}
      >
        {/* glow band */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,oklch(0.85_0.22_135/35%),transparent_50%)]" />

        {/* Top */}
        <div className="relative p-5">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary">
              {match.competition}
            </div>
            <div className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${used ? "bg-destructive/20 text-destructive" : "bg-success/20 text-success"}`}>
              {used ? "Used" : "Valid"}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex-1 text-center">
              <div className="text-4xl">{match.homeBadge}</div>
              <div className="mt-1 truncate font-display text-sm font-bold">{match.homeTeam}</div>
            </div>
            <div className="font-mono text-xs font-bold text-muted-foreground">VS</div>
            <div className="flex-1 text-center">
              <div className="text-4xl">{match.awayBadge}</div>
              <div className="mt-1 truncate font-display text-sm font-bold">{match.awayTeam}</div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-left">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Date</div>
              <div className="font-display text-sm font-semibold">{date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div>
              <div className="text-[10px] text-muted-foreground">{date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Section</div>
              <div className="font-display text-sm font-semibold">{ticket.section}</div>
              <div className="text-[10px] text-muted-foreground">Seat {ticket.seat}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Serial</div>
              <div className="font-display text-sm font-semibold">#{String(ticket.serial).padStart(5, "0")}</div>
              <div className="text-[10px] text-muted-foreground">of ∞</div>
            </div>
          </div>
        </div>

        {/* Notch divider */}
        <div className="relative">
          <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
          <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
          <div className="mx-5 border-t border-dashed border-border" />
        </div>

        {/* QR */}
        <div className="relative flex items-center gap-4 p-5">
          <div className="grid h-28 w-28 shrink-0 place-items-center rounded-xl bg-primary/10 p-2 ring-1 ring-primary/30">
            {qr ? (
              <img src={qr} alt="QR" className="h-full w-full rounded-md" />
            ) : (
              <div className="h-full w-full animate-pulse rounded-md bg-muted" />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Token ID</div>
              <div className="truncate font-mono text-xs font-semibold text-primary">{ticket.id}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Tx Hash</div>
              <div className="truncate font-mono text-[10px] text-muted-foreground">{ticket.txHash}</div>
            </div>
            <div className="text-[10px] text-muted-foreground">{match.stadium} · {match.city}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}