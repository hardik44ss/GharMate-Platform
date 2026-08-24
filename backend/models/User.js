const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User model — single source of truth for all platform users.
 * Roles: ROLE_CLIENT, ROLE_CONTRACTOR, ROLE_ADMIN
 * KYC status: NOT_SUBMITTED, PENDING, APPROVED, REJECTED
 *
 * Matches the frontend AuthUser interface:
 *   id, email, fullName, role, avatarUrl?, kycStatus?
 */
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    role: {
      type: String,
      enum: ['ROLE_CLIENT', 'ROLE_CONTRACTOR', 'ROLE_ADMIN'],
      default: 'ROLE_CLIENT',
    },
    kycStatus: {
      type: String,
      enum: ['NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED'],
      default: 'NOT_SUBMITTED',
    },
    kycDocuments: {
      type: [
        {
          type: {
            type: String,
            enum: ['government_id', 'license', 'certificate', 'other'],
            default: 'other',
          },
          url: { type: String, default: '' },
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    kycSubmittedAt: {
      type: Date,
      default: null,
    },
    kycVerifiedAt: {
      type: Date,
      default: null,
    },
    kycRejectionReason: {
      type: String,
      default: '',
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // ── Contractor-profile fields (only relevant for ROLE_CONTRACTOR) ──
    businessName: {
      type: String,
      trim: true,
      maxlength: [100, 'Business name cannot exceed 100 characters'],
      default: '',
    },
    businessDescription: {
      type: String,
      trim: true,
      maxlength: [1000, 'Business description cannot exceed 1000 characters'],
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone cannot exceed 20 characters'],
      default: '',
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, 'City cannot exceed 100 characters'],
      default: '',
    },
    state: {
      type: String,
      trim: true,
      maxlength: [100, 'State cannot exceed 100 characters'],
      default: '',
    },
    experienceYears: {
      type: Number,
      min: [0, 'Experience years cannot be negative'],
      max: [100, 'Experience years cannot exceed 100'],
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    serviceCategories: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

/**
 * Pre-save hook: hash password before persisting.
 * Only runs when the password field is modified (new user or password change).
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS, 10) || 12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method: compare a plaintext password against the stored hash.
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Instance method: return a safe user object (no password, _id mapped to id).
 */
UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject ? this.toObject() : { ...this };
  if (obj._id) {
    obj.id = obj._id;
    delete obj._id;
  }
  delete obj.__v;
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);