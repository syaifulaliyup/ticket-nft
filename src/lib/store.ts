import { useEffect, useState, useSyncExternalStore } from "react";
import type { Ticket, User } from "./types";

const USER_KEY = "kt_user";
const TICKETS_KEY = "kt_tickets";

type Listener = () => void;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: Listener) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  emit();
}

export function getUser(): User | null {
  return read<User | null>(USER_KEY, null);
}
export function setUser(u: User | null) {
  if (u) write(USER_KEY, u);
  else {
    localStorage.removeItem(USER_KEY);
    emit();
  }
}
export function getTickets(): Ticket[] {
  return read<Ticket[]>(TICKETS_KEY, []);
}
export function saveTickets(t: Ticket[]) {
  write(TICKETS_KEY, t);
}

export function useUser(): User | null {
  const snap = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(USER_KEY) ?? "",
    () => "",
  );
  if (!snap) return null;
  try {
    return JSON.parse(snap) as User;
  } catch {
    return null;
  }
}

export function useTickets() {
  const [v, setV] = useState<Ticket[]>(() => getTickets());
  useEffect(() => subscribe(() => setV(getTickets())), []);
  return v;
}

function randomHex(len: number) {
  const chars = "0123456789abcdef";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * 16)];
  return s;
}

export function createWalletAddress() {
  return "0x" + randomHex(40);
}

export function mintTickets(
  matchId: string,
  ownerEmail: string,
  qty: number,
): Ticket[] {
  const existing = getTickets();
  const sectionLetters = ["A", "B", "C", "D", "N", "S", "E", "W"];
  const newTickets: Ticket[] = [];
  for (let i = 0; i < qty; i++) {
    const serial = existing.length + newTickets.length + 1;
    newTickets.push({
      id: "0x" + randomHex(24),
      matchId,
      ownerEmail,
      section: sectionLetters[Math.floor(Math.random() * sectionLetters.length)],
      seat: `${Math.floor(Math.random() * 40) + 1}-${Math.floor(Math.random() * 30) + 1}`,
      serial,
      mintedAt: new Date().toISOString(),
      status: "valid",
      txHash: "0x" + randomHex(64),
    });
  }
  saveTickets([...existing, ...newTickets]);
  return newTickets;
}

export function ticketsForMatchByUser(matchId: string, email: string) {
  return getTickets().filter(
    (t) => t.matchId === matchId && t.ownerEmail === email,
  );
}

export function markTicketUsed(id: string): Ticket | null {
  const all = getTickets();
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  if (all[idx].status === "used") return all[idx];
  all[idx] = { ...all[idx], status: "used" };
  saveTickets(all);
  return all[idx];
}

export function findTicket(id: string) {
  return getTickets().find((t) => t.id === id) || null;
}