const Admin = require('../models/Admin.model');
const { generateTokens, verifyRefreshToken } = require('../utils/jwt.utils');
const logger = require('../utils/logger.utils');
const crypto = require('crypto');

class AuthService {
  async login(email, password, ipAddress) {
    try {
      // Find admin by email
      const admin = await Admin.findByEmail(email);

      if (!admin) {
        throw new Error('Invalid credentials');
      }

      // Check if account is active
      if (!admin.isActive) {
        throw new Error('Account is disabled');
      }

      // Verify password
      const isPasswordValid = await admin.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate tokens
      const tokens = generateTokens(admin._id);

      // Save refresh token
      admin.refreshToken = tokens.refreshToken;
      await admin.save();

      logger.info('User logged in successfully', { 
        adminId: admin._id, 
        email: admin.email,
        ip: ipAddress 
      });

      return {
        admin: admin.toJSON(),
        tokens
      };
    } catch (error) {
      logger.error('Login failed', { email, error: error.message, ip: ipAddress });
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Find admin with this refresh token
      const admin = await Admin.findOne({ 
        _id: decoded.id,
        refreshToken,
        isActive: true 
      });

      if (!admin) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = generateTokens(admin._id);

      // Update refresh token
      admin.refreshToken = tokens.refreshToken;
      await admin.save();

      logger.info('Token refreshed', { adminId: admin._id });

      return {
        admin: admin.toJSON(),
        tokens
      };
    } catch (error) {
      logger.error('Token refresh failed', { error: error.message });
      throw error;
    }
  }

  async logout(adminId) {
    try {
      const admin = await Admin.findById(adminId);
      if (admin) {
        admin.refreshToken = undefined;
        await admin.save();
      }
      logger.info('User logged out', { adminId });
    } catch (error) {
      logger.error('Logout failed', { error: error.message, adminId });
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const admin = await Admin.findById(userId).select('+password');

      if (!admin) {
        throw new Error('User not found');
      }

      // Verify current password
      const isPasswordValid = await admin.comparePassword(currentPassword);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      admin.password = newPassword;
      await admin.save();

      logger.info('Password changed', { userId });

      return true;
    } catch (error) {
      logger.error('Password change failed', { error: error.message, userId });
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      const admin = await Admin.findOne({ email });

      if (!admin) {
        // Don't reveal if user exists or not
        return;
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour

      admin.resetPasswordToken = resetToken;
      admin.resetPasswordExpiry = resetTokenExpiry;
      await admin.save();

      // In a real app, send email here
      logger.info('Password reset email sent', { email, resetToken });

      return resetToken;
    } catch (error) {
      logger.error('Forgot password failed', { error: error.message, email });
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const admin = await Admin.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: { $gt: Date.now() }
      });

      if (!admin) {
        throw new Error('Invalid or expired reset token');
      }

      // Update password
      admin.password = newPassword;
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpiry = undefined;
      await admin.save();

      logger.info('Password reset successful', { adminId: admin._id });
    } catch (error) {
      logger.error('Reset password failed', { error: error.message });
      throw error;
    }
  }
}

module.exports = new AuthService();