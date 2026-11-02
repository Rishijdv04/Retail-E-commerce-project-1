import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

function signToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'swiftcart_default_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// @desc    Register a new customer account
// @route   POST /api/auth/signup
export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

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
        message: 'An account with this email already exists.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'customer',
      status: 'active',
      phone: '',
      addresses: [],
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password, adminOnly = false } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password.',
      });
    }

    if (user.isLocked()) {
      const waitSeconds = Math.ceil((user.lockUntil - Date.now()) / 1000);
      return res.status(423).json({
        success: false,
        message: `Too many attempts. Try again in ${waitSeconds}s.`,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password.',
      });
    }

    if (adminOnly && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required.',
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'This account is disabled. Contact support.',
      });
    }

    await user.resetLoginAttempts();
    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
export async function getCurrentUser(req, res, next) {
  try {
    res.json({
      success: true,
      user: req.user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Update customer profile (name, phone)
// @route   PUT /api/auth/profile
export async function updateProfile(req, res, next) {
  try {
    const { name, phone } = req.body;
    if (name !== undefined) req.user.name = name.trim();
    if (phone !== undefined) req.user.phone = phone.trim();

    await req.user.save();

    res.json({
      success: true,
      user: req.user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Change customer password
// @route   PUT /api/auth/password
export async function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both current password and new password are required.',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password successfully updated.',
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Save (add or update) an address
// @route   POST /api/auth/addresses
export async function saveAddress(req, res, next) {
  try {
    const addressData = req.body;
    const user = req.user;

    let addresses = user.addresses || [];
    const isFirst = addresses.length === 0;

    if (addressData.id || addressData._id) {
      const addrId = addressData.id || addressData._id;
      const index = addresses.findIndex((a) => a._id.toString() === addrId || a.id === addrId);
      if (index >= 0) {
        addresses[index] = { ...addresses[index].toObject(), ...addressData };
      } else {
        addresses.push(addressData);
      }
    } else {
      if (isFirst || addressData.isDefault) {
        addressData.isDefault = true;
      }
      addresses.push(addressData);
    }

    if (addressData.isDefault) {
      const activeId = addressData.id || addresses[addresses.length - 1]._id.toString();
      addresses.forEach((a) => {
        a.isDefault = (a._id.toString() === activeId || a.id === activeId);
      });
    }

    user.addresses = addresses;
    await user.save();

    res.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Delete a saved address
// @route   DELETE /api/auth/addresses/:id
export async function removeAddress(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;

    user.addresses = (user.addresses || []).filter((a) => a._id.toString() !== id && a.id !== id);

    if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Request password reset code
// @route   POST /api/auth/forgot-password
export async function requestReset(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Don't reveal user existence
      return res.json({ success: true, devCode: null });
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    user.resetPasswordCode = await bcrypt.hash(code, salt);
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await user.save();

    res.json({
      success: true,
      message: 'Reset code generated.',
      devCode: code, // returned for development preview / UI display
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Reset password using 6-digit code
// @route   POST /api/auth/reset-password
export async function resetPassword(req, res, next) {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, code, and new password are required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({
      email: normalizedEmail,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user || !user.resetPasswordCode) {
      return res.status(400).json({
        success: false,
        message: 'That code is invalid or has expired.',
      });
    }

    const isMatch = await bcrypt.compare(code, user.resetPasswordCode);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'That code is invalid or has expired.',
      });
    }

    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password has been reset successfully. Please sign in.',
    });
  } catch (err) {
    next(err);
  }
}
