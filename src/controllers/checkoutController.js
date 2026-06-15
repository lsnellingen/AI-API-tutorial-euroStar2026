const checkoutService = require('../services/checkoutService');

function checkout(req, res) {
  try {
    const order = checkoutService.checkout(req.user.id, req.body);
    res.status(201).json(order);
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}

module.exports = {
  checkout,
};
