export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeBadge: string;
  awayBadge: string;
  competition: string;
  date: string; // ISO
  stadium: string;
  city: string;
  price: number;
  totalSeats: number;
  soldSeats: number;
  heroColor: string;
}

export interface Ticket {
  id: string; // tokenId
  matchId: string;
  ownerEmail: string;
  seat: string;
  section: string;
  serial: number;
  mintedAt: string;
  status: "valid" | "used";
  txHash: string; // simulated
}

export interface User {
  email: string;
  name: string;
  wallet: string; // simulated 0x...
  role: "fan" | "admin";
}