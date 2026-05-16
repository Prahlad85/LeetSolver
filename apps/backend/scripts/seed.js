const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const User = require('../src/models/User');
const WorkerNode = require('../src/models/WorkerNode');
const Analytics = require('../src/models/Analytics'); // Optional, implicit creation

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/leetcode-saas');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  await connectDB();
  
  try {
    // 1. Create Admin User
    const adminExists = await User.findOne({ email: 'admin@leetsolver.ai' });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@leetsolver.ai',
        passwordHash: 'admin123', // In production, this would be hashed
        role: 'admin',
        automationEnabled: true,
        subscriptionPlan: 'Enterprise'
      });
      console.log('✅ Admin user created.');
    } else {
      console.log('⚡ Admin user already exists.');
    }

    // 2. Create Dummy Worker Nodes for Admin Dashboard
    await WorkerNode.deleteMany();
    await WorkerNode.insertMany([
      { workerId: 'worker-node-a1', hostname: 'vps-us-east-1', status: 'Healthy', jobsProcessed: 142 },
      { workerId: 'worker-node-b2', hostname: 'vps-us-east-2', status: 'Healthy', jobsProcessed: 89 },
      { workerId: 'worker-node-c3', hostname: 'vps-eu-west-1', status: 'Restarting', errorsCount: 3 }
    ]);
    console.log('✅ Worker nodes seeded.');

    console.log('🎉 Database creation & seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
