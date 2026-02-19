 
import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  phoneNumber: z.string()
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
});

export const subscriptionSchema = z.object({
  duration: z.enum(['day', 'week', 'month', 'year', 'custom']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  paymentMethod: z.enum(['cash', 'card', 'transfer']).optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
});

export const createUserSchema = userSchema.extend({
  subscription: subscriptionSchema.optional(),
});

// Scan validation
export const scanSchema = z.object({
  qrData: z.string()
    .min(10, 'Invalid QR code')
    .max(100, 'Invalid QR code'),
  scannerLocation: z.string().optional(),
});

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Helper functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[0-9+\-\s()]+$/;
  return phoneRegex.test(phone);
};

export const validateQRCode = (code: string): boolean => {
  const qrRegex = /^USR-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/;
  return qrRegex.test(code);
};