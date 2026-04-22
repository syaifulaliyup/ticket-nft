import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Ticket as TicketIcon, ShieldCheck } from "lucide-react";
import { setUser, useUser } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function Header() {
  const user = useUser();
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-pitch)] text-primary-foreground shadow-[var(--shadow-glow)]">
            <span className="text-lg">⚽</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold tracking-tight">KickToken</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">NFT Tickets</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <Link to="/tickets">
                <Button variant="ghost" size="sm" className="gap-2">
                  <TicketIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">My Tickets</span>
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Scan</span>
                </Button>
              </Link>
              <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 sm:flex">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {user.wallet.slice(0, 6)}…{user.wallet.slice(-4)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setUser(null);
                  nav({ to: "/" });
                }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm" className="bg-[image:var(--gradient-pitch)] font-semibold text-primary-foreground hover:opacity-90">
                Sign in
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}