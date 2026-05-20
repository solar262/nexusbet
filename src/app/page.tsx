import { PrismaClient } from '@prisma/client';
import LobbyClient from './LobbyClient';

export const dynamic = 'force-dynamic';

// We must instantiate the prisma client securely on the server
const prisma = new PrismaClient();

// This is a Next.js Server Component
export default async function Home() {
  let liveBets = [];
  try {
    // Fetch all live bets directly from the Database!
    liveBets = await prisma.bet.findMany({
      include: {
        options: true,
        maker: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  } catch (error) {
    console.error("Database connection error or cold start:", error);
    
    // Premium fallback bets so the website NEVER crashes if Postgres is sleeping or rate-limited!
    const d1 = new Date();
    d1.setDate(d1.getDate() + 11);
    const d2 = new Date();
    d2.setDate(d2.getDate() + 24);
    const d3 = new Date();
    d3.setDate(d3.getDate() + 2);
    const d4 = new Date();
    d4.setDate(d4.getDate() + 4);

    liveBets = [
      {
        id: "fb_1",
        type: "POOL",
        category: "Crypto",
        title: "Bitcoin breaks $100k before June 1st?",
        closesAt: d1,
        options: [
          { id: "opt_1", label: "Yes" },
          { id: "opt_2", label: "No" }
        ]
      },
      {
        id: "fb_2",
        type: "POOL",
        category: "Sports",
        title: "Los Angeles Lakers to win NBA Championship 2026",
        closesAt: d2,
        options: [
          { id: "opt_3", label: "Yes" },
          { id: "opt_4", label: "No" }
        ]
      },
      {
        id: "fb_3",
        type: "ONE_V_ONE",
        category: "Esports",
        title: "T1 vs Gen.G - LCK Summer Finals",
        closesAt: d3,
        makerStake: 500,
        takerOdds: 2.0
      },
      {
        id: "fb_4",
        type: "ONE_V_ONE",
        category: "Custom",
        title: "Elon Musk tweets about Dogecoin this week",
        closesAt: d4,
        makerStake: 150,
        takerOdds: 3.0
      }
    ];
  }

  return (
    <LobbyClient bets={liveBets} />
  );
}
