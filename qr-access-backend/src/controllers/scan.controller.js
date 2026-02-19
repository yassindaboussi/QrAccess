const scanService = require('../services/scan.service');
const logger = require('../utils/logger.utils');

class ScanController {
  async verifyQR(req, res, next) {
    try {
      const { qrData } = req.body;
      const scannerId = req.user._id;

      const result = await scanService.processScan(
        qrData,
        scannerId
      );

      // Return appropriate status code based on result
      if (result.status === 'granted') {
        res.status(200).json({
          success: true,
          data: result
        });
      } else {
        res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: result.message,
            details: result
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getScanHistory(req, res, next) {
    try {
      const filters = {
        from: req.query.from,
        to: req.query.to,
        userId: req.query.userId,
        scannerId: req.query.scannerId,
        result: req.query.result,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 50
      };

      const result = await scanService.getScanHistory(filters);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getDailyStats(req, res, next) {
    try {
      const date = req.query.date ? new Date(req.query.date) : new Date();

      const stats = await scanService.getDailyStats(date);

      res.status(200).json({
        success: true,
        data: {
          date: date.toISOString().split('T')[0],
          ...stats
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getHourlyStats(req, res, next) {
    try {
      const date = req.query.date ? new Date(req.query.date) : new Date();

      const stats = await scanService.getHourlyStats(date);

      res.status(200).json({
        success: true,
        data: {
          date: date.toISOString().split('T')[0],
          hourlyStats: stats
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ScanController();