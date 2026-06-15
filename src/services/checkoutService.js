const productModel = require('../models/productModel');

const VALID_PAYMENT_METHODS = ['cash', 'credit_card'];
const CASH_DISCOUNT_RATE = 0.1;

function checkout(userId, { items, paymentMethod }) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('At least one item is required');
  }

  if (!paymentMethod || !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    throw new Error('Payment method must be "cash" or "credit_card"');
  }

  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = productModel.findById(item.productId);
    if (!product) {
      throw new Error(`Product with id ${item.productId} not found`);
    }

    const quantity = item.quantity;
    if (!quantity || quantity < 1) {
      throw new Error('Each item must have a quantity of at least 1');
    }

    if (product.stock < quantity) {
      throw new Error(`Insufficient stock for product "${product.name}"`);
    }

    const lineTotal = product.price * quantity;
    subtotal += lineTotal;

    orderItems.push({
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity,
      lineTotal,
    });
  }

  for (const item of items) {
    const success = productModel.reduceStock(item.productId, item.quantity);
    if (!success) {
      throw new Error('Failed to update product stock');
    }
  }

  const discount = paymentMethod === 'cash' ? subtotal * CASH_DISCOUNT_RATE : 0;
  const total = subtotal - discount;

  return {
    orderId: Date.now(),
    userId,
    items: orderItems,
    paymentMethod,
    subtotal: roundCurrency(subtotal),
    discount: roundCurrency(discount),
    discountRate: paymentMethod === 'cash' ? CASH_DISCOUNT_RATE : 0,
    total: roundCurrency(total),
  };
}

function roundCurrency(amount) {
  return Math.round(amount * 100) / 100;
}

module.exports = {
  checkout,
};
