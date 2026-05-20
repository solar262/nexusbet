import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-04-10' as any,
});

export async function POST(req: Request) {
  try {
    const { amount, userId } = await req.json();

    if (!amount || !userId) {
      return NextResponse.json({ error: 'Amount and UserId are required' }, { status: 400 });
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'USDC Platform Deposit',
              description: 'Fund your decentralized escrow balance instantly',
            },
            unit_amount: Math.round(amount * 100), // Stripe requires cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Redirect back to our dashboard
      success_url: `${req.headers.get('origin')}/?success=true`,
      cancel_url: `${req.headers.get('origin')}/?canceled=true`,
      
      // CRITICAL: We attach the database User ID to the metadata.
      // When Stripe sends the success webhook, we read this ID to update their balance!
      metadata: {
        userId: userId,
      },
    });
    
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
