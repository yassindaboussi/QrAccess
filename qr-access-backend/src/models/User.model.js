const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  uniqueCode: {
    type: String,
    required: [true, 'Unique code is required'],
    unique: true,
    index: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phoneNumber: {
    type: String,
    required: false,
    trim: true
  },
  subscriptionType: {
    type: String,
    enum: ['day', 'week', 'month', 'year', 'custom'],
    default: null
  },
  subscriptionStart: {
    type: Date,
    default: null
  },
  subscriptionEnd: {
    type: Date,
    default: null
  },
  subscriptionNotes: {
    type: String,
    maxlength: [200, 'Notes cannot exceed 200 characters'],
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

userSchema.index({ fullName: 'text', email: 'text', uniqueCode: 'text' });
userSchema.index({ createdAt: -1 });
userSchema.index({ subscriptionEnd: 1 });

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.__v;
  return user;
};

userSchema.methods.hasActiveSubscription = function() {
  if (!this.subscriptionEnd) {
    return false;
  }
  
  const now = new Date();
  const endDate = new Date(this.subscriptionEnd);
  const startDate = this.subscriptionStart ? new Date(this.subscriptionStart) : new Date(0);
  
  // Check if current time is within subscription period
  return startDate <= now && endDate >= now;
};

userSchema.methods.getSubscriptionStatus = function() {
  if (!this.subscriptionEnd) {
    return 'none';
  }
  
  const now = new Date();
  const endDate = new Date(this.subscriptionEnd);
  const startDate = this.subscriptionStart ? new Date(this.subscriptionStart) : new Date(0);
  
  if (now < startDate) {
    return 'future'; // Subscription hasn't started yet
  } else if (now > endDate) {
    return 'expired'; // Subscription has ended
  } else {
    return 'active'; // Subscription is currently active
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;