import { PrismaClient } from '@prisma/client';
import LobbyClient from './LobbyClient';

export const dynamic = 'force-dynamic';

// We must instantiate the prisma client securely on the server
const prisma = new PrismaClient();

// This is a Next.js Server Component
export default async function Home() {
  // Fetch all live bets directly from the Database!
  const liveBets = await prisma.bet.findMany({
    include: {
      options: true,
      maker: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return (
    <LobbyClient bets={liveBets} />
  );
}
