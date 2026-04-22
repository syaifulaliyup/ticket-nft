import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Wallet } from "lucide-react";
import { setUser, createWalletAddress } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — KickToken" }] }),
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(asAdmin = false) {
    if (!email.includes("@") || name.trim().length < 2) {
      toast.error("Enter a valid name and email");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const wallet = createWalletAddress();
      setUser({ email: email.trim(), name: name.trim(), wallet, role: asAdmin ? "admin" : "fan" });
      toast.success("Wallet created", { description: wallet.slice(0, 10) + "…" });
      nav({ to: asAdmin ? "/admin" : "/" });
    }, 700);
  }

  function google() {
    setName("Alex Striker");
    setEmail("alex.striker@gmail.com");
    setTimeout(() => submit(false), 50);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-12">
      <div className="w-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[var(--shadow-elegant)]">
        <div className="relative bg-[image:var(--gradient-pitch)] p-6 text-primary-foreground">
          <div className="text-2xl">⚽</div>
          <h1 className="mt-2 font-display text-2xl font-bold">Welcome to KickToken</h1>
          <p className="text-sm opacity-80">Your custodial wallet is created automatically.</p>
        </div>
        <div className="space-y-4 p-6">
          <Button
            variant="outline"
            className="w-full justify-center gap-2 border-border/70"
            onClick={google}
            disabled={loading}
          >
            <svg className="h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.6 6.3 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.6 6.3 29.1 4.5 24 4.5 16.3 4.5 9.6 8.7 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5 0 9.5-1.7 13-4.6l-6-5.1c-1.9 1.3-4.3 2.2-7 2.2-5.3 0-9.7-3-11.3-7.4l-6.5 5C9.5 39.3 16.2 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.3l6 5.1C40.8 35.5 43.5 30.2 43.5 24c0-1.2-.1-2.3-.4-3.5z"/></svg>
            Continue with Google (demo)
          </Button>
          <div className="relative text-center">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
            <span className="relative bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">or</span>
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" placeholder="Alex Striker" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" className="pl-9" placeholder="you@club.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
          </div>
          <Button
            className="w-full bg-[image:var(--gradient-pitch)] font-semibold text-primary-foreground hover:opacity-90"
            onClick={() => submit(false)}
            disabled={loading}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {loading ? "Creating wallet…" : "Sign in & create wallet"}
          </Button>
          <button
            type="button"
            onClick={() => submit(true)}
            disabled={loading}
            className="block w-full text-center text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            Sign in as stadium admin (demo)
          </button>
        </div>
      </div>
    </div>
  );
}