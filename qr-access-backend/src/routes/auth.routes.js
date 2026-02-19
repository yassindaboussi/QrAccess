const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validator.middleware');
const { 
  validateLogin, 
  validateRegister,
  validateRefreshToken,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword
} = require('../validations/auth.validation');

// Public routes
router.post('/login', validate(validateLogin), authController.login);
router.post('/refresh', validate(validateRefreshToken), authController.refreshToken);
router.post('/forgot-password', validate(validateForgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(validateResetPassword), authController.resetPassword);

// Protected routes - require authentication
router.use(protect);

router.post('/logout', authController.logout);
router.get('/profile', authController.getProfile);
router.post('/change-password', validate(validateChangePassword), authController.changePassword);

// Super admin only routes
router.post('/register', authorize('super_admin'), validate(validateRegister), authController.register);

module.exports = router;