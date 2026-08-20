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
      enum: ['NOT_SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED'],
      default: 'NOT_SUBMITTED',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
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