import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  label: {
    type: String,
    required: true,
    trim: true,
  },
  detail: {
    type: String,
    default: '',
    trim: true,
  },
  emoji: {
    type: String,
    default: '✦',
  },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
