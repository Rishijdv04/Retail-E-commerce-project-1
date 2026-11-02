import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  legacyId: {
    type: Number,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  vendor: {
    type: String,
    required: [true, 'Vendor / Brand name is required'],
    trim: true,
    index: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    index: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be greater than or equal to 0'],
  },
  old: {
    type: Number,
    min: 0,
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['Popular', 'New', 'Featured', 'Standard'],
    default: 'Popular',
  },
  emoji: {
    type: String,
    default: '🛍️',
  },
  image: {
    type: String,
    default: '',
  },
  glow: {
    type: String,
    default: '#E0E7FF',
  },
  tag: {
    type: String,
    default: '',
  },
  stock: {
    type: Number,
    default: 50,
    min: 0,
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      // Expose id as legacyId if available or MongoDB _id string
      ret.id = ret.legacyId || ret._id.toString();
      ret._id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

// Full-text search index for high-performance searching
productSchema.index({ name: 'text', vendor: 'text', category: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
