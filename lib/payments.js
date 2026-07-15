// lib/payments.js
// TEST-MODE payment helper for the doctor marketplace.
// No real money moves. When real keys are available, implement the same
// `createOrder` / `confirmPayment` interface against Razorpay/Stripe and gate
// on process.env.PAYMENT_MODE === 'LIVE'. The rest of the app only calls these
// two functions, so swapping in a live gateway needs no other changes.

const crypto = require('crypto');

function isLive() {
  return (process.env.PAYMENT_MODE || 'TEST') === 'LIVE' && !!process.env.PAYMENT_KEY;
}

// Create a payment "order". In TEST mode returns a fake order id immediately.
function createOrder({ amount, currency = 'INR', type, doctorId, patientName, meta = {} }) {
  const id = 'ord_' + crypto.randomBytes(8).toString('hex');
  return {
    gateway: isLive() ? 'LIVE' : 'TEST',
    orderId: id,
    amount,
    currency,
    type,           // 'booking' | 'listing'
    doctorId,
    patientName,
    meta,
    simulated: !isLive()
  };
}

// Confirm a payment. In TEST mode: if `success !== false` we treat it as paid.
// (A real gateway would verify a signature/server response here.)
function confirmPayment({ orderId, success = true, paymentId }) {
  const pid = paymentId || 'pay_' + crypto.randomBytes(8).toString('hex');
  return {
    gateway: isLive() ? 'LIVE' : 'TEST',
    paymentId: pid,
    orderId,
    status: success ? 'paid' : 'failed',
    simulated: !isLive()
  };
}

module.exports = { createOrder, confirmPayment, isLive };
