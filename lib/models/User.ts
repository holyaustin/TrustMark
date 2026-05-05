import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema({
  phoneNumber: { type: String, required: true, unique: true },
  businessName: { type: String, required: true },
  businessAddress: { type: String, required: true },
  verifiedNumber: { type: Boolean, default: false },
  verifiedLocation: { type: Boolean, default: false },
  verificationDate: { type: Date },
  lastSimSwapCheck: { type: Date },
  simSwapDetected: { type: Boolean, default: false },
  badgeActive: { type: Boolean, default: false },
  badgeId: { type: String, unique: true, sparse: true },
  qrCodeUrl: { type: String },
  shortLink: { type: String },
  trustScore: { type: Number, default: 70 },
  badgeViews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default models.User || mongoose.model('User', UserSchema);