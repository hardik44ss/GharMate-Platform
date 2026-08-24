/**
 * Seed script — creates 5 contractor users for the GharMate platform.
 *
 * Safe & idempotent:
 *   - Uses the *existing* User model (no model/route/controller/frontend changes).
 *   - Passwords are hashed by the User model's own `pre('save')` hook via
 *     bcrypt (same mechanism the /auth/register route uses) — never stored
 *     in plaintext.
 *   - Idempotency is keyed on unique emails: if a user with the same email
 *     already exists, the seed skips it (no duplicates on re-run).
 *   - Requires the MongoDB connection string. Defaults to local Mongo, but
 *     reads MONGODB_URI/.env so it also works against Atlas.
 *
 * Usage:
 *   node seed-contractors.js
 *   (or from the backend/ directory: node seed-contractors.js)
 */
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gharmate';

/**
 * The 5 contractors to seed. Each has realistic Indian contractor data with a
 * distinct specialization. `password` is applied directly to the User model —
 * the pre-save hook hashes it before it hits the database.
 */
const CONTRACTORS = [
  {
    fullName: 'Rajesh Kumar',
    email: 'rajesh.civil@aaravbuild.com',
    password: 'Civil@2024',
    businessName: 'Aarav Civil Works',
    businessDescription:
      'End-to-end civil construction, RCC structure work, and new home construction with site supervision for residential projects.',
    phone: '+91 98110 12345',
    city: 'Gurugram',
    state: 'Haryana',
    experienceYears: 16,
    skills: ['RCC', 'Masonry', 'Site Supervision', 'Concreting'],
    serviceCategories: ['Civil Construction', 'New Home Construction', 'Structural Work'],
  },
  {
    fullName: 'Amit Verma',
    email: 'amit.electrical@voltwire.in',
    password: 'Electrical@2024',
    businessName: 'VoltWire Electricals',
    businessDescription:
      'Licensed electrical contractor handling wiring, switchgear installation, maintenance, and building electrification.',
    phone: '+91 98220 22334',
    city: 'Delhi NCR',
    state: 'Delhi',
    experienceYears: 11,
    skills: ['Wiring', 'Switchgear', 'Panel Installation', 'Troubleshooting'],
    serviceCategories: ['Electrical Work', 'Home Renovation', 'Maintenance'],
  },
  {
    fullName: 'Suresh Nair',
    email: 'suresh.plumbing@flowtech.in',
    password: 'Plumbing@2024',
    businessName: 'FlowTech Plumbing Solutions',
    businessDescription:
      'Residential and commercial plumbing, bathroom fitting, drainage, and water supply line installation.',
    phone: '+91 98330 33445',
    city: 'Mumbai',
    state: 'Maharashtra',
    experienceYears: 13,
    skills: ['Water Supply', 'Drainage', 'Bathroom Fitting', 'Pipeline'],
    serviceCategories: ['Plumbing', 'Bathroom Renovation', 'Home Renovation'],
  },
  {
    fullName: 'Priya Sharma',
    email: 'priya.interiors@styledesign.in',
    password: 'Interior@2024',
    businessName: 'StyleNest Interiors',
    businessDescription:
      'Interior design and renovation specialist for modular kitchens, false ceilings, and premium residential interiors.',
    phone: '+91 98440 44556',
    city: 'Bengaluru',
    state: 'Karnataka',
    experienceYears: 9,
    skills: ['Modular Kitchen', 'False Ceiling', 'Lighting', 'Space Planning'],
    serviceCategories: ['Interior Design', 'Modular Kitchen', 'Flooring', 'False Ceiling'],
  },
  {
    fullName: 'Vikram Singh',
    email: 'vikram.general@primebuild.in',
    password: 'General@2024',
    businessName: 'PrimeBuild Contractors',
    businessDescription:
      'General contracting for residential and commercial projects, coordinating electrical, plumbing, carpentry, and finishing teams.',
    phone: '+91 98765 55667',
    city: 'Jaipur',
    state: 'Rajasthan',
    experienceYears: 18,
    skills: ['Project Management', 'Carpentry', 'Finishing', 'Team Coordination'],
    serviceCategories: ['General Construction', 'Home Renovation', 'Waterproofing', 'Painting'],
  },
];

/**
 * Seeds the contractors. For each entry:
 *   - Skips if a user with that email already exists (idempotent).
 *   - Otherwise creates a new ROLE_CONTRACTOR user; the model's pre-save
 *     hook hashes the password.
 * Returns { created, skipped } counts.
 */
async function seed() {
  let created = 0;
  let skipped = 0;

  for (const data of CONTRACTORS) {
    const existing = await User.findOne({ email: data.email.toLowerCase().trim() });
    if (existing) {
      console.log(`SKIP ${data.email} — user already exists (id=${existing._id})`);
      skipped += 1;
      continue;
    }

    const user = new User({ ...data, role: 'ROLE_CONTRACTOR' });
    await user.save();
    console.log(`CREATE ${data.email} — ${data.businessName} (id=${user._id})`);
    created += 1;
  }

  console.log(`\nSeed complete: ${created} created, ${skipped} skipped.`);
  return { created, skipped };
}

async function main() {
  console.log(`Connecting to MongoDB: ${MONGODB_URI}`);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected. Seeding contractors...\n');

  try {
    await seed();
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});