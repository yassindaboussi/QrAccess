const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validator.middleware');
const { 
  validateCreateUser, 
  validateUserId,
  validateUpdateUser,
  validateGetUsers 
} = require('../validations/user.validation');

// All routes require authentication
router.use(protect);

// User management routes - only super_admin can manage users
router.route('/')
  .get(
    authorize('super_admin'),
    validate(validateGetUsers),
    userController.getUsers
  )
  .post(
    authorize('super_admin'),
    validate(validateCreateUser),
    userController.createUser
  );

router.get('/expiring', 
  authorize('super_admin'),
  userController.getExpiringUsers
);

router.route('/:id')
  .get(
    authorize('super_admin'),
    validate(validateUserId),
    userController.getUserById
  )
  .put(
    authorize('super_admin'),
    validate([...validateUserId, ...validateUpdateUser]),
    userController.updateUser
  )
  .delete(
    authorize('super_admin'),
    validate(validateUserId),
    userController.deleteUser
  );

module.exports = router;