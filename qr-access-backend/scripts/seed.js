require('dotenv').config();
const mongoose = require('mongoose');
const colors = require('colors/safe');
const connectDB = require('../src/config/database');
const Admin = require('../src/models/Admin.model');
const User = require('../src/models/User.model');
const QRUtils = require('../src/utils/qr.utils');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});

    // Get admin
    const admin = await Admin.findOne({ role: 'super_admin' });
    
    if (!admin) {
      console.log(colors.red('❌ Please create an admin first using: npm run create:admin'));
      process.exit(1);
    }

    // Create sample users with realistic subscription data
    const sampleUsers = [];
    const notesOptions = ['VIP', 'visitor', 'staff', 'member', 'guest'];
    const durationOptions = ['day', 'week', 'month', 'year', 'custom'];
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown', 
                  'Emily Davis', 'Chris Lee', 'Lisa Anderson', 'David Miller', 'Amy Taylor'];
    
    for (let i = 1; i <= 10; i++) {
      const uniqueCode = QRUtils.generateUniqueCode();
      const now = new Date();
      
      // Create realistic subscription scenarios
      const subscriptionScenarios = [
        // Active subscriptions (40%)
        { hasSubscription: true, type: 'week', daysOffset: 0 },
        { hasSubscription: true, type: 'month', daysOffset: 0 },
        { hasSubscription: true, type: 'day', daysOffset: 0 },
        { hasSubscription: true, type: 'year', daysOffset: 0 },
        
        // Future subscriptions (20%)
        { hasSubscription: true, type: 'week', daysOffset: 3 },
        { hasSubscription: true, type: 'month', daysOffset: 7 },
        
        // Expired subscriptions (30%)
        { hasSubscription: true, type: 'week', daysOffset: -10 },
        { hasSubscription: true, type: 'month', daysOffset: -30 },
        { hasSubscription: true, type: 'day', daysOffset: -2 },
        
        // No subscription (10%)
        { hasSubscription: false, type: null, daysOffset: 0 }
      ];
      
      const scenario = subscriptionScenarios[Math.floor(Math.random() * subscriptionScenarios.length)];
      const subscriptionNotes = notesOptions[Math.floor(Math.random() * notesOptions.length)];
      
      let subscriptionStart = null;
      let subscriptionEnd = null;
      
      if (scenario.hasSubscription) {
        subscriptionStart = new Date(now);
        subscriptionEnd = new Date(now);
        
        if (scenario.daysOffset === 0) {
          // Active subscription
          switch (scenario.type) {
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
            case 'custom':
              subscriptionEnd.setDate(subscriptionEnd.getDate() + Math.floor(Math.random() * 30) + 1);
              break;
          }
        } else if (scenario.daysOffset > 0) {
          // Future subscription
          subscriptionStart.setDate(subscriptionStart.getDate() + scenario.daysOffset);
          subscriptionEnd.setDate(subscriptionStart.getDate() + scenario.daysOffset);
          
          switch (scenario.type) {
            case 'week':
              subscriptionEnd.setDate(subscriptionEnd.getDate() + 7);
              break;
            case 'month':
              subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
              break;
            case 'year':
              subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
              break;
            case 'custom':
              subscriptionEnd.setDate(subscriptionEnd.getDate() + Math.floor(Math.random() * 30) + 1);
              break;
          }
        } else {
          // Expired subscription
          subscriptionStart.setDate(subscriptionStart.getDate() + scenario.daysOffset);
          subscriptionEnd.setDate(subscriptionStart.getDate() + scenario.daysOffset);
          
          switch (scenario.type) {
            case 'week':
              subscriptionEnd.setDate(subscriptionEnd.getDate() + 7);
              break;
            case 'month':
              subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
              break;
            case 'year':
              subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
              break;
            case 'custom':
              subscriptionEnd.setDate(subscriptionEnd.getDate() + Math.floor(Math.random() * 30) + 1);
              break;
          }
        }
      }

      const user = await User.create({
        fullName: names[i - 1],
        email: `user${i}@example.com`,
        phoneNumber: `+2126000000${i}`,
        uniqueCode,
        subscriptionType: scenario.hasSubscription ? scenario.type : null,
        subscriptionStart,
        subscriptionEnd,
        subscriptionNotes: scenario.hasSubscription ? subscriptionNotes : '',
        createdBy: admin._id
      });
      
      sampleUsers.push(user);
    }

    console.log(colors.green.bold('✅ Database seeded successfully!'));
    console.log(colors.cyan(`📊 Created ${sampleUsers.length} sample users`));
    console.log(colors.yellow('📝 Sample users include various subscription scenarios:'));
    console.log(colors.blue('   • Active subscriptions (4 users)'));
    console.log(colors.blue('   • Future subscriptions (2 users)'));
    console.log(colors.blue('   • Expired subscriptions (3 users)'));
    console.log(colors.blue('   • No subscription (1 user)'));
    console.log(colors.magenta('🎯 Ready to test all scan scenarios!'));

  } catch (error) {
    console.error(colors.red('❌ Seeding error:'), error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedDatabase();