import mongoose, { Schema, models } from 'mongoose';

const BadgeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  badgeId: { type: String, required: true, unique: true },
  qrCodeUrl: { type: String },
  shortLink: { type: String },
  isActive: { type: Boolean, default: true },
  suspendedAt: { type: Date },
  suspensionReason: { type: String },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

export default models.Badge || mongoose.model('Badge', BadgeSchema);