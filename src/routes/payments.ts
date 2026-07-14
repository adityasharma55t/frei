import { Router } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { badRequest } from '../middleware/errorHandler';

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

// POST /payments/create-order
router.post('/create-order', async (req, res, next) => {
  const { amount, receipt } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
    return next(badRequest("'amount' must be a positive number, in paise"));
  }
  if (typeof receipt !== 'string' || !receipt) {
    return next(badRequest("'receipt' is required"));
  }

  try {
    const order = await razorpay.orders.create({ amount, currency: 'INR', receipt });
    res.json({ orderId: order.id, keyId: process.env.RAZORPAY_KEY_ID, amount: order.amount });
  } catch (err) {
    next(err);
  }
});

// POST /payments/verify
router.post('/verify', (req, res, next) => {
  const { razorpayOrderId: orderId, razorpayPaymentId: paymentId, razorpaySignature: signature } = req.body;

  if (!orderId || !paymentId || !signature) {
    return next(badRequest("'orderId', 'paymentId', and 'signature' are all required"));
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  res.json({ verified: expectedSignature === signature });
});

export default router;
