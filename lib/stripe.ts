import Stripe from 'stripe';
export function checkoutMode() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return 'demo';
  return /^(sk|rk)_test_/.test(key) ? 'stripe' : 'unavailable';
}
export function getStripe() {
  if (checkoutMode() !== 'stripe') throw new Error('Stripe test mode is not configured.');
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}
