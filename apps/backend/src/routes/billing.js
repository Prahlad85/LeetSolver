const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { authMiddleware } = require('../middlewares/authMiddleware');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

/**
 * @swagger
 * /api/billing/create-checkout-session:
 *   post:
 *     summary: Create a Stripe Checkout Session for subscription upgrade
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan:
 *                 type: string
 *                 enum: [Pro, Enterprise]
 *     responses:
 *       200:
 *         description: Returns Stripe Checkout URL
 */
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    let priceId = '';

    if (plan === 'Pro') priceId = process.env.STRIPE_PRICE_PRO || 'price_pro_mock';
    else if (plan === 'Enterprise') priceId = process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_mock';
    else return res.status(400).json({ error: 'Invalid plan selected' });

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_mock') {
      return res.json({ url: 'https://checkout.stripe.com/pay/mock_session_url' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/settings?canceled=true`,
      client_reference_id: req.user.id,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
