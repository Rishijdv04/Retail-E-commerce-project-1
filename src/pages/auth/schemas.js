import { z } from 'zod';

export const passwordRule = z.string()
  .min(8, 'Use at least 8 characters')
  .regex(/[A-Z]/, 'Add an uppercase letter')
  .regex(/[a-z]/, 'Add a lowercase letter')
  .regex(/\d/, 'Add a number');
export const email = z.email('Enter a valid email address');
const match = (d) => d.password === d.confirm;
const matchErr = { message: 'Passwords do not match', path: ['confirm'] };

export const loginSchema = z.object({ email, password: z.string().min(1, 'Enter your password') });
export const signupSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name'), email, password: passwordRule, confirm: z.string(),
}).refine(match, matchErr);
export const resetSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'), password: passwordRule, confirm: z.string(),
}).refine(match, matchErr);
export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name'),
  phone: z.string().trim().regex(/^(\+91)?[6-9]\d{9}$|^$/, 'Enter a 10-digit mobile number'),
});
export const passwordChangeSchema = z.object({
  current: z.string().min(1, 'Enter your current password'), password: passwordRule, confirm: z.string(),
}).refine(match, matchErr);
export const addressSchema = z.object({
  label: z.string().trim().min(1, 'Give this address a name'),
  fullName: z.string().trim().min(2, 'Enter the recipient name'),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a 10-digit mobile number'),
  line1: z.string().trim().min(5, 'Enter the street address'),
  city: z.string().trim().min(2, 'Enter the city'),
  state: z.string().trim().min(2, 'Enter the state'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a 6-digit PIN code'),
  isDefault: z.boolean().optional(),
});
export const newUserSchema = z.object({
  name: z.string().trim().min(2, 'Enter a name'), email, password: passwordRule,
  role: z.enum(['customer', 'vendor', 'admin']),
});
