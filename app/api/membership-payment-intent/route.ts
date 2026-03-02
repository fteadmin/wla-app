import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Validate Stripe secret key exists
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email } = body;

    console.log('Membership payment intent request:', { userId, email });

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing userId or email' },
        { status: 400 }
      );
    }

    // Validate Stripe key before creating payment intent
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe secret key not configured');
      return NextResponse.json(
        { error: 'Payment system is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Create a PaymentIntent for $20 membership
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000, // $20.00 in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        user_id: userId,
        email: email,
        type: 'membership_payment',
        tier: 'basic',
      },
      description: 'WLA Basic Membership - $20',
    });

    console.log('Payment intent created successfully:', paymentIntent.id);

    if (!paymentIntent.client_secret) {
      throw new Error('Failed to generate payment session');
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Membership payment intent creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    // Check if it's a Stripe error
    if (error && typeof error === 'object' && 'type' in error) {
      const stripeError = error as Stripe.StripeError;
      console.error('Stripe error type:', stripeError.type);
      console.error('Stripe error code:', stripeError.code);
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
