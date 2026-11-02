import mongoose from 'mongoose';

const sellerApplicationSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'Brand / Store name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Business email is required'],
    trim: true,
    lowercase: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const SellerApplication = mongoose.model('SellerApplication', sellerApplicationSchema);
export default SellerApplication;
