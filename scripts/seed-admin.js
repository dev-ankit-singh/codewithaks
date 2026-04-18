'use strict';

/**
 * One-time admin seed script.
 * Run with: node scripts/seed-admin.js
 *
 * Creates the first admin user in MongoDB with a bcrypt-hashed password.
 * If an admin already exists, it will NOT create a duplicate.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');

// Load Admin model
const Admin = require(path.join(__dirname, '../models/Admin'));

const MONGO_URI = "mongodb+srv://ankitsinghse72_db_user:codewithaks123@cluster0.gjitan9.mongodb.net/dhanrubiankit";

// ── Credentials for the first admin ──────────────────────────────────────────
const SEED_USERNAME = 'ankit';
const SEED_PASSWORD = 'shreeganesh';  // Will be hashed with bcrypt rounds=12
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
    console.log('🔗 Connecting to MongoDB Atlas…');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected');

    const existing = await Admin.findOne({ username: SEED_USERNAME });
    if (existing) {
        console.log(`⚠️  Admin "${SEED_USERNAME}" already exists. Skipping.`);
        await mongoose.disconnect();
        return;
    }

    const count = await Admin.countDocuments();
    if (count > 0) {
        console.log('⚠️  An admin account already exists. Only one admin is allowed.');
        await mongoose.disconnect();
        return;
    }

    const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 12);

    await Admin.create({
        username: SEED_USERNAME,
        password: hashedPassword,
        role: 'admin'
    });

    console.log(`✅ Admin created successfully!`);
    console.log(`   Username : ${SEED_USERNAME}`);
    console.log(`   Password : [hashed — use "${SEED_PASSWORD}" to login]`);
    await mongoose.disconnect();
    console.log('🔌 Disconnected. Done!');
}

seed().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
