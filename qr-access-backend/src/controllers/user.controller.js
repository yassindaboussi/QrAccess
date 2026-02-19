const userService = require('../services/user.service');
const logger = require('../utils/logger.utils');

class UserController {
  async createUser(req, res, next) {
    try {
      const userData = req.body;
      const adminId = req.user._id;

      const result = await userService.createUser(userData, adminId);

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const filters = {
        search: req.query.search,
        status: req.query.status,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
      };

      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20
      };

      const result = await userService.getUsers(filters, pagination);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updatedBy: req.user._id
      };

      const user = await userService.updateUser(id, updateData);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      const result = await userService.deleteUser(id, req.user._id);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async getExpiringUsers(req, res, next) {
    try {
      const days = parseInt(req.query.days) || 7;

      const expiringUsers = await userService.getExpiringUsers(days);

      res.status(200).json({
        success: true,
        data: expiringUsers
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();