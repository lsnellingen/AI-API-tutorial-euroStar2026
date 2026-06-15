const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerController = require('../controllers/swaggerController');

const router = express.Router();
const swaggerDocument = swaggerController.loadSwaggerDocument();

router.get('/swagger.json', swaggerController.getSwaggerSpec);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
