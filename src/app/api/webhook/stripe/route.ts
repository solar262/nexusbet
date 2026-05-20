import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-04-10' as any,
});

const prisma = new PrismaClient();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } else {
      // For local testing without a webhook secret
      event = JSON.parse(payload);
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Retrieve the User ID from the metadata we set during checkout
    const userId = session.metadata?.userId;
    const amountPaid = session.amount_total ? session.amount_total / 100 : 0; // Convert cents to dollars

    if (userId && amountPaid > 0) {
      // Securely credit the user's database balance
      // We use Prisma upsert to create the balance row if it doesn't exist, or increment it if it does
      try {
        await prisma.balance.upsert({
          where: {
            userId_currency: {
              userId: userId,
              currency: 'USDC' // We standardize the fiat deposit into USDC equivalence
            }
          },
          update: {
            amount: {
              increment: amountPaid
            }
          },
          create: {
            userId: userId,
            currency: 'USDC',
            amount: amountPaid
          }
        });
        
        console.log(`Successfully credited ${amountPaid} USDC to User ${userId}`);
      } catch (dbError) {
        console.error('Database Error during Webhook:', dbError);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
