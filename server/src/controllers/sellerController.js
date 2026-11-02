import SellerApplication from '../models/SellerApplication.js';

// @desc    Submit a seller onboarding application
// @route   POST /api/sellers/apply
export async function submitApplication(req, res, next) {
  try {
    const { brand, email, category, phone, description, notes } = req.body;

    if (!brand || !email || !category) {
      return res.status(400).json({
        success: false,
        message: 'Brand name, business email, and category are required.',
      });
    }

    const extraNotes = [
      phone ? `Phone: ${phone}` : null,
      description ? `About: ${description}` : null,
      notes || null,
    ].filter(Boolean).join(' | ');

    const application = await SellerApplication.create({
      brand: brand.trim(),
      email: email.trim().toLowerCase(),
      category: category.trim(),
      notes: extraNotes,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: `Thank you! Your seller application for "${brand}" has been submitted for review.`,
      application: application.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get all seller applications (admin)
// @route   GET /api/sellers/applications
export async function getApplications(req, res, next) {
  try {
    const applications = await SellerApplication.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications: applications.map((a) => a.toJSON()),
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Update application status (admin)
// @route   PATCH /api/sellers/applications/:id/status
export async function updateApplicationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await SellerApplication.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (status) application.status = status;
    if (notes !== undefined) application.notes = notes;

    await application.save();

    res.json({
      success: true,
      message: `Application marked as ${status}.`,
      application: application.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}
