import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });


// Helper: map your Stripe priceId to amount and token count
function getPackFromPriceId(priceId: string) {
  const ids = {
    [process.env.VITE_STRIPE_PRICE_ID_100]: { amount: 100, tokens: 100 },
    [process.env.VITE_STRIPE_PRICE_ID_500]: { amount: 500, tokens: 500 },
    [process.env.VITE_STRIPE_PRICE_ID_1000]: { amount: 1000, tokens: 1000 },
    [process.env.VITE_STRIPE_PRICE_ID_5000]: { amount: 5000, tokens: 5000 },
  };
  if (!ids[priceId]) throw new Error('Invalid priceId');
  return ids[priceId];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { priceId } = req.body;
  try {
    const pack = getPackFromPriceId(priceId);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: pack.amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { tokens: pack.tokens, priceId },
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret, priceId, tokens: pack.tokens });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
