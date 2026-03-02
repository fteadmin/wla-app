import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const sig = req.headers['stripe-signature'] as string;
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const userId = paymentIntent.metadata?.user_id;
    const tokens = parseInt(paymentIntent.metadata?.tokens || '0', 10);
    if (userId && tokens > 0) {
      // Record purchase for audit trail (token balance is credited by the frontend after confirmCardPayment)
      const tokenId = 'TKN-' + paymentIntent.id.replace('pi_', '').substring(0, 8).toUpperCase();
      await supabase.from('token_purchases').insert({
        user_id: userId,
        amount: tokens,
        stripe_payment_id: paymentIntent.id,
        token_id: tokenId,
        status: 'completed',
      });
    }
  }
  res.status(200).json({ received: true });
}
