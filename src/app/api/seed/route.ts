import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Clearing database...');
    await prisma.wager.deleteMany();
    await prisma.betOption.deleteMany();
    await prisma.bet.deleteMany();
    await prisma.user.deleteMany();

    console.log('Seeding database...');

    // Create a User (Maker)
    const user1 = await prisma.user.create({
      data: {
        wallet: '0x4F99A52...a1B2',
        name: 'CryptoWhale',
      },
    });

    const user2 = await prisma.user.create({
      data: {
        wallet: '0x99A3C43...F4c',
        name: 'ElonFan',
      },
    });

    // Create Pool Bet 1
    const d1 = new Date();
    d1.setDate(d1.getDate() + 11);
    
    await prisma.bet.create({
      data: {
        type: 'POOL',
        category: 'Crypto',
        title: 'Bitcoin breaks $100k before June 1st?',
        closesAt: d1,
        options: {
          create: [
            { label: 'Yes' },
            { label: 'No' },
          ],
        },
      },
    });

    // Create Pool Bet 2
    const d2 = new Date();
    d2.setDate(d2.getDate() + 24);

    await prisma.bet.create({
      data: {
        type: 'POOL',
        category: 'Sports',
        title: 'Los Angeles Lakers to win NBA Championship 2026',
        closesAt: d2,
        options: {
          create: [
            { label: 'Yes' },
            { label: 'No' },
          ],
        },
      },
    });

    // Create 1v1 Bet 1
    const d3 = new Date();
    d3.setDate(d3.getDate() + 2);

    await prisma.bet.create({
      data: {
        type: 'ONE_V_ONE',
        category: 'Esports',
        title: 'T1 vs Gen.G - LCK Summer Finals',
        closesAt: d3,
        makerId: user1.id,
        makerStake: 500,
        takerOdds: 2.0,
      },
    });

    // Create 1v1 Bet 2
    const d4 = new Date();
    d4.setDate(d4.getDate() + 4);

    await prisma.bet.create({
      data: {
        type: 'ONE_V_ONE',
        category: 'Custom',
        title: 'Elon Musk tweets about Dogecoin this week',
        closesAt: d4,
        makerId: user2.id,
        makerStake: 150,
        takerOdds: 3.0,
      },
    });

    console.log('Seeding complete!');
    return NextResponse.json({ success: true, message: 'Seeding complete!' });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
