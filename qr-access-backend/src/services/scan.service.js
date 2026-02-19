const ScanLog = require('../models/ScanLog.model');
const User = require('../models/User.model');
const logger = require('../utils/logger.utils');
const QRUtils = require('../utils/qr.utils');

class ScanService {
  async processScan(qrData, scannerId) {
    const startTime = Date.now();
    
    try {
      // Validate QR code format
      if (!QRUtils.validateQRCodeFormat(qrData)) {
        await this.logScan({
          uniqueCode: qrData,
          scannerId,
          result: 'denied',
          reason: 'invalid_code'
        });
        
        return {
          status: 'denied',
          reason: 'invalid_code',
          message: 'Invalid QR code format'
        };
      }

      // Find user
      const user = await User.findOne({ uniqueCode: qrData });
      
      if (!user) {
        await this.logScan({
          uniqueCode: qrData,
          scannerId,
          result: 'denied',
          reason: 'not_found'
        });
        
        return {
          status: 'denied',
          reason: 'not_found',
          message: 'User not found'
        };
      }

      // Check subscription status using user's own data
      const subscriptionStatus = user.getSubscriptionStatus();
      
      let isGranted = false;
      let reason = '';
      let message = '';
      
      switch (subscriptionStatus) {
        case 'active':
          isGranted = true;
          reason = 'active';
          message = 'Access Granted';
          break;
        case 'future':
          isGranted = false;
          reason = 'not_started';
          message = 'Access Denied';
          break;
        case 'expired':
          isGranted = false;
          reason = 'expired';
          message = 'Access Denied';
          break;
        case 'none':
          isGranted = false;
          reason = 'no_subscription';
          message = 'Access Denied';
          break;
        default:
          isGranted = false;
          reason = 'no_subscription';
          message = 'Access Denied';
      }

      // Log the scan
      await this.logScan({
        userId: user._id,
        uniqueCode: qrData,
        scannerId,
        result: isGranted ? 'granted' : 'denied',
        reason
      });

      // Return response
      if (isGranted) {
        return {
          status: 'granted',
          message: 'Access Granted',
          reason: 'active',
          user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            uniqueCode: user.uniqueCode,
            subscriptionType: user.subscriptionType,
            subscriptionStart: user.subscriptionStart,
            subscriptionEnd: user.subscriptionEnd,
            subscriptionNotes: user.subscriptionNotes,
            createdAt: user.createdAt
          }
        };
      } else {
        return {
          status: 'denied',
          message: message,
          reason: reason,
          user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            uniqueCode: user.uniqueCode,
            subscriptionType: user.subscriptionType,
            subscriptionStart: user.subscriptionStart,
            subscriptionEnd: user.subscriptionEnd,
            subscriptionNotes: user.subscriptionNotes,
            createdAt: user.createdAt
          }
        };
      }
    } catch (error) {
      logger.error('Scan processing failed', { 
        error: error.message,
        qrData,
        scannerId
      });
      
      await this.logScan({
        uniqueCode: qrData,
        scannerId,
        result: 'denied',
        reason: 'error'
      });

      return {
        status: 'denied',
        reason: 'error',
        message: 'Scan processing failed'
      };
    }
  }

  async logScan(scanData) {
    try {
      const scanLog = await ScanLog.create(scanData);
      
      // Log to file as well
      await logger.logScan({
        scanId: scanLog._id,
        ...scanData
      });

      return scanLog;
    } catch (error) {
      logger.error('Failed to log scan', { error: error.message, scanData });
      // Don't throw - logging should not break the main flow
    }
  }

  async getScanHistory(filters = {}) {
    const {
      from,
      to,
      userId,
      scannerId,
      result,
      page = 1,
      limit = 50
    } = filters;

    const query = {};
    const skip = (page - 1) * limit;

    if (from || to) {
      query.scannedAt = {};
      if (from) query.scannedAt.$gte = new Date(from);
      if (to) query.scannedAt.$lte = new Date(to);
    }

    if (userId) query.userId = userId;
    if (scannerId) query.scannerId = scannerId;
    if (result && result !== 'all') query.result = result;

    const scans = await ScanLog.find(query)
      .sort({ scannedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'fullName email uniqueCode')
      .populate('scannerId', 'username');

    const total = await ScanLog.countDocuments(query);

    return {
      scans,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    };
  }

  async getDailyStats(date = new Date()) {
    return ScanLog.getDailyStats(date);
  }

  async getHourlyStats(date = new Date()) {
    return ScanLog.getHourlyStats(date);
  }
}

module.exports = new ScanService();