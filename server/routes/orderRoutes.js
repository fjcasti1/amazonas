import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';
import Stripe from 'stripe';

const orderRouter = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @route     POST api/orders
// @desc      Create an order
// @access    Private
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
      const newOrder = new Order({
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        user: req.user._id,
      });

      const createdOrder = await newOrder.save();

      res.status(201).json({ order: createdOrder });
    }
  }),
);

// @route     GET api/orders/mine
// @desc      Get my orders
// @access    Private
orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    if (orders) {
      res.send(orders);
    } else {
      res.status(404).send({ message: 'Orders Not Found' });
    }
  }),
);

// @route     GET api/orders
// @desc      Get all orders
// @access    Private
orderRouter.get(
  '/',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const seller = req.query.seller;
    const sellerFilter = seller
      ? {
          orderItems: { $elemMatch: { seller } },
        }
      : {};

    const orders = await Order.find({ ...sellerFilter }).populate('user', 'name');

    if (orders) {
      res.send(orders);
    } else {
      res.status(404).send({ message: 'Orders Not Found' });
    }
  }),
);

// @route     GET api/orders/:id
// @desc      Get order by Id
// @access    Private
orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  }),
);

// @route     PUT api/orders/:id/pay
// @desc      Pay order by Id
// @access    Private
orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { transactionId, status, update_time, email_address } = req.body; // From paymentResult

    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: transactionId,
        status,
        update_time,
        email_address,
      };
      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  }),
);

// @route     DELETE api/orders/:id
// @desc      Delete an order by Id
// @access    Private Admin
orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.remove();
      res.send({ message: 'Order removed' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  }),
);

// @route     PUT api/orders/:id/deliver
// @desc      Deliver order by Id
// @access    Private Admin
orderRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.send({ message: 'Order Delivered', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  }),
);

// @route     POST api/orders/create-payment-intent
// @desc      Create payment intent for stripe
// @access    Private
orderRouter.post(
  '/create-payment-intent',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { amount } = req.body;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  }),
);

export default orderRouter;
