const { body, param, query } = require('express-validator');

const validateCreateUser = [
  body('fullName')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .trim()
    .escape(),
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phoneNumber')
    .optional()
    .matches(/^[0-9+\-\s()]+$/).withMessage('Please provide a valid phone number'),
  body('subscription')
    .optional()
    .isObject().withMessage('Subscription must be an object'),
  body('subscription.duration')
    .if(body('subscription').exists())
    .notEmpty().withMessage('Duration is required for subscription')
    .isIn(['day', 'week', 'month', 'year', 'custom']).withMessage('Invalid duration'),
  body('subscription.startDate')
    .optional()
    .isISO8601().withMessage('Invalid start date format'),
  body('subscription.endDate')
    .optional()
    .isISO8601().withMessage('Invalid end date format')
];

const validateUserId = [
  param('id')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid user ID format')
];

const validateUpdateUser = [
  param('id')
    .isMongoId().withMessage('Invalid user ID format'),
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .trim()
    .escape(),
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phoneNumber')
    .optional()
    .matches(/^[0-9+\-\s()]+$/).withMessage('Please provide a valid phone number')
];

const validateGetUsers = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .isString().withMessage('Search must be a string')
    .trim()
    .escape(),
  query('status')
    .optional()
    .isIn(['active', 'expired', 'all']).withMessage('Invalid status filter'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'fullName', 'email']).withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
];

module.exports = {
  validateCreateUser,
  validateUserId,
  validateUpdateUser,
  validateGetUsers
};