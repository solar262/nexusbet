import { PrismaClient } from '@prisma/client';
import LobbyClient from './LobbyClient';

export const dynamic = 'force-dynamic';

type LobbyBet = {
  id: string;
  type: string;
  category: string;
  title: string;
  closesAt: string;
  makerStake?: number | null;
  takerOdds?: number | null;
  options?: { id: string; label: string }[];
};

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

function serializeBet(bet: any): LobbyBet {
  return {
    id: bet.id,
    type: bet.type,
    category: bet.category,
    title: bet.title,
    closesAt: bet.closesAt instanceof Date ? bet.closesAt.toISOString() : String(bet.closesAt),
    makerStake: bet.makerStake ?? null,
    takerOdds: bet.takerOdds ?? null,
    options:
      bet.options?.map((option: any) => ({
        id: option.id,
        label: option.label,
      })) ?? [],
  };
}

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

const fallbackBets: LobbyBet[] = [
  {
    id: 'fb_1',
    type: 'POOL',
    category: 'Crypto',
    title: 'Bitcoin breaks $100k before June 1st?',
    closesAt: daysFromNow(11),
    options: [
      { id: 'opt_1', label: 'Yes' },
      { id: 'opt_2', label: 'No' },
    ],
  },
  {
    id: 'fb_2',
    type: 'POOL',
    category: 'Sports',
    title: 'Los Angeles Lakers to win NBA Championship 2026',
    closesAt: daysFromNow(24),
    options: [
      { id: 'opt_3', label: 'Yes' },
      { id: 'opt_4', label: 'No' },
    ],
  },
  {
    id: 'fb_3',
    type: 'ONE_V_ONE',
    category: 'Esports',
    title: 'T1 vs Gen.G - LCK Summer Finals',
    closesAt: daysFromNow(2),
    makerStake: 500,
    takerOdds: 2.0,
  },
  {
    id: 'fb_4',
    type: 'ONE_V_ONE',
    category: 'Custom',
    title: 'Elon Musk tweets about Dogecoin this week',
    closesAt: daysFromNow(4),
    makerStake: 150,
    takerOdds: 3.0,
  },
];

export default async function Home() {
  let liveBets: LobbyBet[] = fallbackBets;

  try {
    const bets = await prisma.bet.findMany({
      include: {
        options: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (bets.length > 0) {
      liveBets = bets.map(serializeBet);
    }
  } catch (error) {
    console.error('Database connection error or cold start:', error);
  }

  return <LobbyClient bets={liveBets} />;
}
