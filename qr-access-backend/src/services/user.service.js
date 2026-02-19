const mongoose = require('mongoose');
const User = require('../models/User.model');
const ScanLog = require('../models/ScanLog.model');
const QRUtils = require('../utils/qr.utils');
const emailService = require('../utils/email.utils');
const logger = require('../utils/logger.utils');

class UserService {
  async createUser(userData, adminId) {
    try {
      // Generate unique code
      const uniqueCode = QRUtils.generateUniqueCode();

      // Calculate subscription dates if provided
      let subscriptionStart = null;
      let subscriptionEnd = null;
      
      if (userData.subscription) {
        subscriptionStart = userData.subscription.startDate ? new Date(userData.subscription.startDate) : new Date();
        
        if (userData.subscription.endDate) {
          subscriptionEnd = new Date(userData.subscription.endDate);
        } else if (userData.subscription.duration && userData.subscription.duration !== 'custom') {
          subscriptionEnd = new Date(subscriptionStart);
          switch (userData.subscription.duration) {
            case 'day':
              subscriptionEnd.setDate(subscriptionEnd.getDate() + 1);
              break;
            case 'week':
              subscriptionEnd.setDate(subscriptionEnd.getDate() + 7);
              break;
            case 'month':
              subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
              break;
            case 'year':
              subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
              break;
          }
        }
      }

      // Create user
      const user = await User.create({
        fullName: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        subscriptionType: userData.subscription?.duration || null,
        subscriptionStart,
        subscriptionEnd,
        subscriptionNotes: userData.subscription?.notes || '',
        uniqueCode,
        createdBy: adminId
      });

      // Generate QR code
      const qrCode = await QRUtils.generateQRCode(uniqueCode);

      // Send email if provided
      if (userData.email) {
        try {
          await emailService.sendQRCodeEmail(
            userData.email,
            userData.fullName,
            qrCode.dataURL,
            {
              startDate: subscriptionStart,
              endDate: subscriptionEnd,
              duration: userData.subscription?.duration || 'none'
            }
          );
        } catch (emailError) {
          logger.warn('Failed to send QR code email', { 
            userId: user._id, 
            error: emailError.message 
          });
        }
      }

      logger.info('User created successfully', { 
        userId: user._id, 
        createdBy: adminId 
      });

      return {
        user: user.toJSON(),
        qrCode
      };
    } catch (error) {
      logger.error('User creation failed', { error: error.message, data: userData });
      throw error;
    }
  }

  async getUsers(filters = {}, pagination = {}) {
    const { 
      search, 
      status = 'all',
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = filters;
    
    const { 
      page = 1, 
      limit = 20 
    } = pagination;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Build query
    let query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { uniqueCode: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status && status !== 'all') {
      if (status === 'active') {
        query.subscriptionEnd = { $gt: new Date() };
      } else if (status === 'expired') {
        query.subscriptionEnd = { $lte: new Date() };
      }
    }

    // Execute query
    const users = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    return {
      users: users.map(user => ({
        ...user.toJSON(),
        hasActiveSubscription: user.hasActiveSubscription(),
        subscriptionStatus: user.getSubscriptionStatus()
      })),
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    };
  }

  async getUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      ...user.toJSON(),
      hasActiveSubscription: user.hasActiveSubscription(),
      subscriptionStatus: user.getSubscriptionStatus()
    };
  }

  async updateUser(userId, updateData) {
    try {
      // Handle subscription data properly
      const updateFields = { ...updateData };
      
      // Process subscription data if present
      if (updateData.subscription) {
        const { subscription } = updateData;
        
        // Map subscription fields to user model fields
        updateFields.subscriptionType = subscription.duration || null;
        updateFields.subscriptionStart = subscription.startDate ? new Date(subscription.startDate) : null;
        updateFields.subscriptionEnd = subscription.endDate ? new Date(subscription.endDate) : null;
        updateFields.subscriptionNotes = subscription.notes || '';
        
        // Remove the subscription object from updateFields
        delete updateFields.subscription;
      }
      
      const user = await User.findByIdAndUpdate(
        userId,
        updateFields,
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      logger.info('User updated', { userId, updateFields });

      return user;
    } catch (error) {
      logger.error('User update failed', { userId, error: error.message, updateData });
      throw error;
    }
  }

  async deleteUser(userId, deletedBy) {
    try {
      // 1. First, check if user exists
      const user = await User.collection.findOne({ _id: new mongoose.Types.ObjectId(userId) });
      
      if (!user) {
        throw new Error('User not found');
      }

      // 2. Delete all scan logs for this user
      const scanDeleteResult = await ScanLog.deleteMany({ userId });

      // 3. Hard delete the user
      const userDeleteResult = await User.collection.deleteOne({ _id: new mongoose.Types.ObjectId(userId) });

      logger.info('User deleted with cascade', { 
        userId, 
        deletedBy,
        scanLogsDeleted: scanDeleteResult.deletedCount,
        userDeleted: userDeleteResult.deletedCount
      });

      return { 
        message: 'User and scan logs deleted permanently',
        deletedData: {
          scanLogs: scanDeleteResult.deletedCount,
          user: userDeleteResult.deletedCount
        }
      };
    } catch (error) {
      logger.error('User deletion failed', { 
        userId, 
        deletedBy, 
        error: error.message 
      });
      throw error;
    }
  }

  async getUserByQRCode(qrData) {
    if (!QRUtils.validateQRCodeFormat(qrData)) {
      throw new Error('Invalid QR code format');
    }

    const user = await User.findOne({ uniqueCode: qrData });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

module.exports = new UserService();