const express = require('express');
const router = express.Router();
const quotesController = require('../controllers/quotesController');

router.post('/', quotesController.createQuote);
router.get('/', quotesController.getQuotes);
router.patch('/:id/status', quotesController.updateQuoteStatus);

module.exports = router;
