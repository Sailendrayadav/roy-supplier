const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

router.get('/', productsController.getProducts);
router.post('/', productsController.addProduct);
router.patch('/:id/availability', productsController.updateProductAvailability);

module.exports = router;
