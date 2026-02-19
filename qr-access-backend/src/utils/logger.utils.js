const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, metadata = {}) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...metadata
    }) + '\n';
  }

  async info(message, metadata = {}) {
    const logMessage = this.formatMessage('INFO', message, metadata);
    console.log(message, metadata);
    await this.writeToFile('info.log', logMessage);
  }

  async error(message, metadata = {}) {
    const logMessage = this.formatMessage('ERROR', message, metadata);
    console.error(message, metadata);
    await this.writeToFile('error.log', logMessage);
  }

  async warn(message, metadata = {}) {
    const logMessage = this.formatMessage('WARN', message, metadata);
    console.warn(message, metadata);
    await this.writeToFile('warn.log', logMessage);
  }

  async debug(message, metadata = {}) {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = this.formatMessage('DEBUG', message, metadata);
      console.debug(message, metadata);
      await this.writeToFile('debug.log', logMessage);
    }
  }

  async writeToFile(filename, data) {
    const filepath = path.join(this.logDir, filename);
    return new Promise((resolve, reject) => {
      fs.appendFile(filepath, data, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Scan specific logging
  async logScan(scanData) {
    const logMessage = this.formatMessage('SCAN', 'Access scan performed', scanData);
    await this.writeToFile('scans.log', logMessage);
  }
}

module.exports = new Logger();