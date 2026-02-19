const mongoose = require('mongoose');

const scanLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true
  },
  uniqueCode: {
    type: String,
    required: true,
    index: true
  },
  scannerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
    index: true
  },
  result: {
    type: String,
    enum: ['granted', 'denied'],
    required: true,
    index: true
  },
  reason: {
    type: String,
    enum: ['active', 'expired', 'not_started', 'no_subscription', 'invalid_code', 'not_found', 'system_error'],
    required: true
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'expired', 'none']
  },
  scannedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for analytics
scanLogSchema.index({ scannedAt: -1, result: 1 });
scanLogSchema.index({ scannedAt: -1, scannerId: 1 });
scanLogSchema.index({ scannedAt: -1, userId: 1 });

// Aggregate daily scans
scanLogSchema.statics.getDailyStats = async function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const stats = await this.aggregate([
    {
      $match: {
        scannedAt: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $match: {
        user: { $ne: [] } // Only include scans where user exists
      }
    },
    {
      $group: {
        _id: '$result',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    granted: 0,
    denied: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

// Aggregate hourly stats
scanLogSchema.statics.getHourlyStats = async function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.aggregate([
    {
      $match: {
        scannedAt: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $match: {
        user: { $ne: [] } // Only include scans where user exists
      }
    },
    {
      $group: {
        _id: {
          hour: { $hour: '$scannedAt' },
          result: '$result'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.hour',
        stats: {
          $push: {
            result: '$_id.result',
            count: '$count'
          }
        }
      }
    },
    { $sort: { '_id': 1 } }
  ]);
};

const ScanLog = mongoose.model('ScanLog', scanLogSchema);

module.exports = ScanLog;