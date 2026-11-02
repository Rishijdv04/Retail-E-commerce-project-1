import Product from '../models/Product.js';

// @desc    Get all products with filtering, search & sorting
// @route   GET /api/products
export async function getProducts(req, res, next) {
  try {
    const { category, filter, query, sort, limit = 100, page = 1 } = req.query;

    const filterObj = {};

    // Category filter
    if (category && category !== 'All') {
      filterObj.category = category;
    }

    // Status / filter (Popular, New)
    if (filter && filter !== 'All') {
      filterObj.status = filter;
    }

    // Search query
    if (query && query.trim()) {
      const q = query.trim();
      filterObj.$or = [
        { name: { $regex: q, $options: 'i' } },
        { vendor: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ];
    }

    // Sorting
    let sortObj = { createdAt: -1 };
    if (sort === 'low') {
      sortObj = { price: 1 };
    } else if (sort === 'high') {
      sortObj = { price: -1 };
    } else if (sort === 'rating') {
      sortObj = { rating: -1 };
    } else if (sort === 'featured') {
      sortObj = { legacyId: 1, rating: -1 };
    }

    const total = await Product.countDocuments(filterObj);
    const products = await Product.find(filterObj)
      .sort(sortObj)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      success: true,
      count: products.length,
      total,
      products: products.map((p) => p.toJSON()),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get single product by ID (or legacyId)
// @route   GET /api/products/:id
export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    let product = null;

    if (!isNaN(id)) {
      product = await Product.findOne({ legacyId: Number(id) });
    }

    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.json({
      success: true,
      product: product.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Create product (admin / vendor)
// @route   POST /api/products
export async function createProduct(req, res, next) {
  try {
    const { name, vendor, category, price, old, status, emoji, image, glow, tag, stock, description } = req.body;

    if (!name || !vendor || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, vendor, category, and price are required.',
      });
    }

    const lastProduct = await Product.findOne().sort({ legacyId: -1 });
    const legacyId = (lastProduct?.legacyId || 0) + 1;

    const product = await Product.create({
      legacyId,
      name,
      vendor,
      category,
      price: Number(price),
      old: old ? Number(old) : undefined,
      status: status || 'Popular',
      emoji: emoji || '🛍️',
      image: image || '',
      glow: glow || '#E0E7FF',
      tag: tag || '',
      stock: stock !== undefined ? Number(stock) : 50,
      description: description || '',
    });

    res.status(201).json({
      success: true,
      product: product.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Update product
// @route   PUT /api/products/:id
export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    let product = null;

    if (!isNaN(id)) {
      product = await Product.findOneAndUpdate({ legacyId: Number(id) }, req.body, { new: true, runValidators: true });
    } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({
      success: true,
      product: product.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Delete product
// @route   DELETE /api/products/:id
export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    let result = null;

    if (!isNaN(id)) {
      result = await Product.findOneAndDelete({ legacyId: Number(id) });
    } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
      result = await Product.findByIdAndDelete(id);
    }

    if (!result) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
}
