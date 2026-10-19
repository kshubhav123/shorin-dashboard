import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema(
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
    description: {
      type: String,
      default: '',
      trim: true,
    },
    color: {
      type: String,
      default: '#DF886F',
    },
    icon: {
      type: String,
      default: 'music',
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

export const Playlist = mongoose.model('Playlist', playlistSchema);
