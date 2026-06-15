const express = require('express');
const authRoutes = require('./authRoutes');
const checkoutRoutes = require('./checkoutRoutes');
const healthRoutes = require('./healthRoutes');
const swaggerRoutes = require('./swaggerRoutes');

const router = express.Router();

router.use(authRoutes);
router.use(checkoutRoutes);
router.use(healthRoutes);
router.use(swaggerRoutes);

module.exports = router;
