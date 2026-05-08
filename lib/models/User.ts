// lib/models/User.ts - Add verificationDate field
import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema({
  phoneNumber: { type: String, required: true, unique: true },
  businessName: { type: String, required: true },
  businessAddress: { type: String, required: true },
  businessCity: { type: String, required: true },
  businessCountry: { type: String, required: true },
  
  // Verification flags
  numberVerified: { type: Boolean, default: false },
  locationVerified: { type: Boolean, default: false },
  kycMatchVerified: { type: Boolean, default: false },
  simSwapDetected: { type: Boolean, default: false },
  
  // ADD THIS - Verification date when badge becomes active
  verificationDate: { type: Date },  // Add default: null
  
  // Location verification data
  locationData: {
    verifiedAt: { type: Date },
    lastLatitude: { type: Number },
    lastLongitude: { type: Number },
    matchRate: { type: Number }
  },
  
  // KYC Data from operator
  kycData: {
    fullName: { type: String },
    givenName: { type: String },
    familyName: { type: String },
    birthdate: { type: Date },
    address: { type: String },
    nationality: { type: String }
  },
  
  // User-provided data (for KYC match)
  userFullName: { type: String },
  userDateOfBirth: { type: Date },
  
  // Tenure info
  tenureValid: { type: Boolean, default: false },
  tenureYears: { type: Number, default: 0 },
  contractType: { type: String },
  
  // Badge info
  badgeActive: { type: Boolean, default: false },
  badgeId: { type: String, unique: true, sparse: true },
  qrCodeUrl: { type: String },
  shortLink: { type: String },
  
  // Trust Score
  trustScore: { type: Number, default: 0 },
  trustGrade: { type: String, default: 'F' },
  trustBreakdown: {
    kycMatch: { type: Number, default: 0 },
    simSwap: { type: Number, default: 0 },
    numberVerification: { type: Number, default: 0 },
    tenure: { type: Number, default: 0 },
    location: { type: Number, default: 0 },
    kycDataCompleteness: { type: Number, default: 0 }  
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default models.User || mongoose.model('User', UserSchema);