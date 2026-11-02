import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import SellerApplication from '../models/SellerApplication.js';

// @desc    Get all users (admin)
// @route   GET /api/admin/users
export async function getAllUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users: users.map((u) => u.toJSON()),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Admin create new user
// @route   POST /api/admin/users
export async function createUser(req, res, next) {
  try {
    const { name, email, password, role = 'customer' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      status: 'active',
      phone: '',
      addresses: [],
    });

    res.status(201).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Update user role (admin)
// @route   PATCH /api/admin/users/:id/role
export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (String(req.user._id) === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role.',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}.`,
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Update user status (active/disabled)
// @route   PATCH /api/admin/users/:id/status
export async function updateUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (String(req.user._id) === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot disable your own account.',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.status = status;
    await user.save();

    res.json({
      success: true,
      message: `User account is now ${status}.`,
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Delete user account (admin)
// @route   DELETE /api/admin/users/:id
export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    if (String(req.user._id) === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account.',
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get system dashboard stats
// @route   GET /api/admin/stats
export async function getDashboardStats(req, res, next) {
  try {
    const [
      totalUsers,
      customerCount,
      vendorCount,
      adminCount,
      totalOrders,
      totalProducts,
      pendingApplications,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'vendor' }),
      User.countDocuments({ role: 'admin' }),
      Order.countDocuments(),
      Product.countDocuments(),
      SellerApplication.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        customerCount,
        vendorCount,
        adminCount,
        totalOrders,
        totalProducts,
        pendingApplications,
        totalRevenue,
      },
    });
  } catch (err) {
    next(err);
  }
}
