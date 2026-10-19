import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    updatedAt: {
      type: Number,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
