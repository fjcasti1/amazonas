import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../utils.js';
import Stripe from 'stripe';

const paymentRouter = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @route     POST api/orders/create-payment-intent
// @desc      Create payment intent for stripe
// @access    Private
paymentRouter.post(
  '/create-payment-intent',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { amount, shippingAddress } = req.body;
    const { firstName, lastName, address, city, postalCode, country } = shippingAddress;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      shipping: {
        name: firstName + ' ' + lastName,
        address: {
          line1: address,
          city: city,
          postal_code: postalCode,
          // state:,
          country: country,
        },
      },
      // // Verify your integration in this guide by including this parameter
      // metadata: { integration_check: 'accept_a_payment' },
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  }),
);

// @route     POST api/orders/get-payment-method
// @desc      Get payment method from stripe
// @access    Private
paymentRouter.post(
  '/get-card-preview',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { payment_method_id } = req.body;
    const { card } = await stripe.paymentMethods.retrieve(payment_method_id);
    res.send({
      brand: card.brand,
      last4: card.last4,
    });
  }),
);

export default paymentRouter;
