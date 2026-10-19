import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ['YouTube', 'Instagram', 'Facebook'],
      default: 'YouTube',
    },
    category: {
      type: String,
      required: true,
      enum: ['Learning', 'Movies'],
      default: 'Learning',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
      trim: true,
    },
    createdAt: {
      type: Number,
      default: () => Date.now(),
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Video = mongoose.model('Video', videoSchema);
