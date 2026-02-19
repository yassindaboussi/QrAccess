require('dotenv').config();
const mongoose = require('mongoose');
const colors = require('colors/safe');
const connectDB = require('../src/config/database');

const clearDatabase = async () => {
  try {
    await connectDB();

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log(colors.yellow('⚠️ Database is already empty'));
      process.exit(0);
    }

    console.log(colors.blue('🔄 Clearing database...'));

    // Drop each collection
    for (const collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(colors.red(`❌ Dropped collection: ${collection.name}`));
    }

    console.log(colors.green.bold('✅ Database cleared successfully!'));
    
  } catch (error) {
    console.error(colors.red.bold('❌ Error clearing database:'), error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Handle Ctrl+C gracefully
process.on('SIGINT', async () => {
  console.log(colors.yellow('\n⚠️ Database clear operation cancelled'));
  await mongoose.connection.close();
  process.exit(0);
});

// Ask for confirmation if not in production
if (process.env.NODE_ENV !== 'production') {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(colors.yellow('⚠️  Are you sure you want to clear the entire database? (y/N): '), (answer) => {
    rl.close();
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      clearDatabase();
    } else {
      console.log(colors.green('✅ Database clear operation cancelled'));
      process.exit(0);
    }
  });
} else {
  // In production, require explicit confirmation
  console.log(colors.red.bold('⚠️  PRODUCTION ENVIRONMENT DETECTED'));
  console.log(colors.red('This will permanently delete all data!'));
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(colors.red.bold('Type "DELETE ALL DATA" to confirm: '), (answer) => {
    rl.close();
    if (answer === 'DELETE ALL DATA') {
      clearDatabase();
    } else {
      console.log(colors.green('✅ Database clear operation cancelled'));
      process.exit(0);
    }
  });
}
