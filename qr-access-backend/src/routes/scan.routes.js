const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scan.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validator.middleware');
const { validateScan, validateScanHistory } = require('../validations/scan.validation');

// All routes require authentication
router.use(protect);

// Scan endpoint - all authenticated users can scan
router.post('/',
  validate(validateScan),
  scanController.verifyQR
);

// Scan history - all authenticated users can view
router.get('/history',
  validate(validateScanHistory),
  scanController.getScanHistory
);

module.exports = router;