import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
export async function getCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json({
      success: true,
      categories: categories.map((c) => c.toJSON()),
    });
  } catch (err) {
    next(err);
  }
}
