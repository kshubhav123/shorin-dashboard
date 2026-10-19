import mongoose from 'mongoose';

const savedSongSchema = new mongoose.Schema(
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
    artist: {
      type: String,
      default: 'Unknown Artist',
      trim: true,
    },
    album: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    streamUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    playlist: {
      type: String,
      default: 'Favorites',
      trim: true,
    },
    playlists: {
      type: [String],
      default: ['Favorites'],
    },
    savedAt: {
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

export const SavedSong = mongoose.model('SavedSong', savedSongSchema);
