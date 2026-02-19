const { body } = require('express-validator');

const validateScan = [
  body('qrData')
    .notEmpty().withMessage('QR data is required')
    .isString().withMessage('QR data must be a string')
    .trim()
    .isLength({ min: 10, max: 100 }).withMessage('Invalid QR code format')
];

const validateScanHistory = [
  body('from')
    .optional()
    .isISO8601().withMessage('Invalid from date format'),
  body('to')
    .optional()
    .isISO8601().withMessage('Invalid to date format')
    .custom((to, { req }) => {
      if (req.body.from && to < req.body.from) {
        throw new Error('To date must be after from date');
      }
      return true;
    }),
  body('result')
    .optional()
    .isIn(['granted', 'denied', 'all']).withMessage('Invalid result filter')
];

module.exports = {
  validateScan,
  validateScanHistory
};