import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Session {
  userId: Types.ObjectId;
  sessionId: string;
  userAgent?: string;
  ip?: string;
  refreshToken: string;
  expiresAt: Date;
  absoluteExpiry: Date;
  isRevoked?: boolean;
}

const SessionModel = new Schema<Session>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },sessionId: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
    },
    ip: {
      type: String,
    },
    refreshToken: {
      type: String, 
      required: true,
    },
    expiresAt: {
      type: Date, 
      required: true,
    },
    absoluteExpiry: {
      type: Date, 
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,

    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Optional indexes
SessionModel.index({ userId: 1 });
SessionModel.index({ expiresAt: 1 });

export default mongoose.models?.Session ||
  mongoose.model<Session>("Session", SessionModel);
