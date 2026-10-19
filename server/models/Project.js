import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Personal / Practice', 'Freelance'],
    },
    technologies: {
      type: [String],
      default: [],
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
    screenshot: {
      type: String,
      required: true,
    },
    lpUrl: {
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

export const Project = mongoose.model('Project', projectSchema);
