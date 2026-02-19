require('dotenv').config();
require('colors');

const app = require('./src/config/app');
const connectDB = require('./src/config/database');
const logger = require('./src/utils/logger.utils');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...'.red.bold);
  console.error(err.name, err.message);
  logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
  process.exit(1);
});

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
  console.log(`📡 API available at http://localhost:${PORT}/api/v1`.cyan);
  console.log(`🩺 Health check at http://localhost:${PORT}/health`.cyan);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...'.red.bold);
  console.error(err.name, err.message);
  logger.error('Unhandled Rejection', { error: err.message, stack: err.stack });
  
  // Gracefully close server
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...'.yellow);
  logger.info('SIGTERM received, shutting down');
  
  server.close(() => {
    console.log('💤 Process terminated!'.red);
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});