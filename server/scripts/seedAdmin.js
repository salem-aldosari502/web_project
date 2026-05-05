const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user_info');
require('dotenv').config();

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI_LOCAL);
        console.log('Connected to MongoDB');

        const existing = await User.findOne({ email: 'admin' });
        if (existing) {
            console.log('⚠️ Admin already exists, skipping.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin', 10);
        await User.create({
            name: 'Admin',
            email: 'admin',
            password: hashedPassword,
            phone: '0000000000',
            gender: 'NOT SPECIFIED',
            birth: new Date('1000-01-01'),
            role: 'admin'
        });

        console.log('✅ Admin user created successfully');
        process.exit(0);

    } catch (err) {
        console.error('❌ Error creating admin:', err.message);
        process.exit(1);
    }
}

seedAdmin();