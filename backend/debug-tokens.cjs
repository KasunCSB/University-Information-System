const mongoose = require('mongoose');

// Simple User schema for quick check
const userSchema = new mongoose.Schema({
  email: String,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  isEmailVerified: Boolean
});

const User = mongoose.model('User', userSchema);

async function checkTokens() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/university_system');
    console.log('Connected to MongoDB');
    
    const users = await User.find({
      emailVerificationToken: { $exists: true, $ne: null },
      emailVerificationExpires: { $exists: true }
    }).select('email emailVerificationToken emailVerificationExpires isEmailVerified');
    
    console.log('Users with verification tokens:');
    users.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Token: ${user.emailVerificationToken}`);
      console.log(`Expires: ${user.emailVerificationExpires}`);
      console.log(`Current time: ${new Date()}`);
      console.log(`Time difference (ms): ${user.emailVerificationExpires.getTime() - Date.now()}`);
      console.log(`Time difference (hours): ${(user.emailVerificationExpires.getTime() - Date.now()) / (1000 * 60 * 60)}`);
      console.log(`Is expired: ${user.emailVerificationExpires.getTime() <= Date.now()}`);
      console.log(`Is verified: ${user.isEmailVerified}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTokens();
