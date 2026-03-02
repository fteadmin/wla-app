import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { tokens, price, userId } = req.body;
  if (!tokens || !price || !userId) {
    return res.status(400).json({ error: 'Missing tokens, price, or userId' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100), // dollars → cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { tokens: String(tokens), user_id: userId || '' },
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
