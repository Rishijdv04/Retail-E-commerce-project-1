import Order from '../models/Order.js';
import Product from '../models/Product.js';

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SC-${timestamp}-${random}`;
}

// @desc    Create a new order (Checkout)
// @route   POST /api/orders
export async function createOrder(req, res, next) {
  try {
    const { items, shippingAddress, paymentMethod = 'cod', customer } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Please add items before checking out.',
      });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const pid = item.productId || item.id;
      let product = null;

      if (!isNaN(pid)) {
        product = await Product.findOne({ legacyId: Number(pid) });
      }
      if (!product && String(pid).match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(pid);
      }

      const qty = Math.max(1, Number(item.quantity || item.qty || 1));
      const price = product ? product.price : Number(item.price);
      const name = product ? product.name : (item.name || 'Product');
      const vendor = product ? product.vendor : (item.vendor || 'SwiftCart');
      const image = product ? product.image : (item.image || '');
      const emoji = product ? product.emoji : (item.emoji || '🛍️');

      subtotal += price * qty;

      validatedItems.push({
        productId: product ? product._id : pid,
        name,
        price,
        quantity: qty,
        vendor,
        image,
        emoji,
      });

      // Adjust stock if product exists
      if (product && product.stock >= qty) {
        product.stock -= qty;
        await product.save();
      }
    }

    const shippingFee = (subtotal === 0 || subtotal >= 999) ? 0 : 79;
    const totalAmount = subtotal + shippingFee;

    const user = req.user;
    const customerInfo = {
      name: user ? user.name : (customer?.name || shippingAddress?.fullName || 'Guest Customer'),
      email: user ? user.email : (customer?.email || ''),
      phone: user ? user.phone : (customer?.phone || shippingAddress?.phone || ''),
    };

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: user ? user._id : null,
      customer: customerInfo,
      items: validatedItems,
      shippingAddress: shippingAddress || {},
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'placed',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: order.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
export async function getMyOrders(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders: orders.map((o) => o.toJSON()),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get single order by ID or orderNumber
// @route   GET /api/orders/:id
export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    let order = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    } else {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Customer can only view their own orders unless admin
    if (req.user && req.user.role !== 'admin' && String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({
      success: true,
      order: order.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get all orders (admin)
// @route   GET /api/orders
export async function getAllOrders(req, res, next) {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      success: true,
      count: orders.length,
      total,
      orders: orders.map((o) => o.toJSON()),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Update order status (admin)
// @route   PATCH /api/orders/:id/status
export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.json({
      success: true,
      message: 'Order updated.',
      order: order.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}
