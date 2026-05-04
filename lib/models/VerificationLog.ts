import mongoose, { Schema, models } from 'mongoose';

const VerificationLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['number', 'location', 'sim_swap'], required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], required: true },
  responseData: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

export default models.VerificationLog || mongoose.model('VerificationLog', VerificationLogSchema);