const QRCode = require('qrcode');
const crypto = require('crypto');

class QRUtils {
  // Generate unique code for user
  static generateUniqueCode() {
    // Format: USR-XXXXXX-YYYY
    const prefix = 'USR';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    const checksum = crypto.randomBytes(2).toString('hex').toUpperCase();
    
    return `${prefix}-${timestamp}-${random}-${checksum}`;
  }

  // Generate QR code as data URL
  static async generateQRCode(uniqueCode, options = {}) {
    const defaultOptions = {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    };

    const qrOptions = { ...defaultOptions, ...options };

    try {
      // Generate QR code as data URL
      const qrDataURL = await QRCode.toDataURL(uniqueCode, qrOptions);
      
      // Generate as buffer for file saving
      const qrBuffer = await QRCode.toBuffer(uniqueCode, qrOptions);

      return {
        dataURL: qrDataURL,
        buffer: qrBuffer,
        value: uniqueCode
      };
    } catch (error) {
      throw new Error(`QR Code generation failed: ${error.message}`);
    }
  }

  // Generate QR code with logo (optional)
  static async generateQRCodeWithLogo(uniqueCode, logoPath, options = {}) {
    // This would require additional libraries like 'jimp' or 'sharp'
    // For now, return standard QR
    return this.generateQRCode(uniqueCode, options);
  }

  // Validate QR code format
  static validateQRCodeFormat(code) {
    const pattern = /^USR-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/;
    return pattern.test(code);
  }

  // Extract user info from code (if needed)
  static parseQRCode(code) {
    if (!this.validateQRCodeFormat(code)) {
      throw new Error('Invalid QR code format');
    }
    
    const parts = code.split('-');
    return {
      prefix: parts[0],
      timestamp: parts[1],
      random: parts[2],
      checksum: parts[3]
    };
  }
}

module.exports = QRUtils;