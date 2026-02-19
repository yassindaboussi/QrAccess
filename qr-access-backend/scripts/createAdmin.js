require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const colors = require('colors/safe');
const Admin = require('../src/models/Admin.model');
const connectDB = require('../src/config/database');

const createInitialAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ role: 'super_admin' });
    
    if (existingAdmin) {
      console.log(colors.yellow('⚠️ Super admin already exists'));
      console.log(colors.cyan('📧 Email: ' + existingAdmin.email));
      console.log(colors.cyan('👤 Username: ' + existingAdmin.username));
      process.exit(0);
    }

    // Create super admin with better credentials
    const adminData = {
      username: 'superadmin',
      email: 'admin@qrsystem.com',
      password: 'Admin@123456', // Plain text - will be hashed by model middleware
      role: 'super_admin',
      isActive: true
    };

    const admin = await Admin.create(adminData);
    
    console.log(colors.green.bold('✅ Super admin created successfully!'));
    console.log(colors.cyan('📧 Email: ' + adminData.email));
    console.log(colors.cyan('🔑 Password: ' + adminData.password));
    console.log(colors.cyan('👤 Username: ' + adminData.username));
    console.log(colors.yellow.bold('⚠️ IMPORTANT: Please change this password after first login!'));
    console.log(colors.blue('🌐 Login URL: http://localhost:3000/login'));

  } catch (error) {
    console.error(colors.red('❌ Error creating admin:'), error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

createInitialAdmin();