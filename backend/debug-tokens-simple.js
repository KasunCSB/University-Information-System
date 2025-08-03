// Simple debug script to check tokens
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: String,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  isEmailVerified: Boolean
});

const User = mongoose.model('User', userSchema);

async function checkTokens() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/university_system');
    console.log('Connected to MongoDB');
    
    // Find all users
    const allUsers = await User.find({}).select('email emailVerificationToken emailVerificationExpires isEmailVerified');
    console.log(`Total users: ${allUsers.length}`);
    
    // Check specific token
    const targetToken = '154143cafb9093f7c7f67f79dbeb6c4d792063b8256a42bb55ca66453d5137b3';
    const userWithToken = await User.findOne({ emailVerificationToken: targetToken });
    
    if (userWithToken) {
      console.log('\n=== Found user with target token ===');
      console.log(`Email: ${userWithToken.email}`);
      console.log(`Token: ${userWithToken.emailVerificationToken}`);
      console.log(`Expires: ${userWithToken.emailVerificationExpires}`);
      console.log(`Is verified: ${userWithToken.isEmailVerified}`);
      console.log(`Current time: ${new Date()}`);
      
      if (userWithToken.emailVerificationExpires) {
        const timeDiff = userWithToken.emailVerificationExpires.getTime() - Date.now();
        console.log(`Time difference (ms): ${timeDiff}`);
        console.log(`Time difference (hours): ${timeDiff / (1000 * 60 * 60)}`);
        console.log(`Is expired: ${timeDiff <= 0}`);
      }
    } else {
      console.log('\n=== Token not found ===');
      console.log(`Looking for token: ${targetToken}`);
    }
    
    // Find users with verification tokens
    const usersWithTokens = await User.find({
      emailVerificationToken: { $exists: true, $ne: null }
    });
    
    console.log(`\n=== Users with verification tokens: ${usersWithTokens.length} ===`);
    usersWithTokens.forEach((user, index) => {
      console.log(`\n${index + 1}. Email: ${user.email}`);
      console.log(`   Token: ${user.emailVerificationToken}`);
      console.log(`   Expires: ${user.emailVerificationExpires}`);
      console.log(`   Is verified: ${user.isEmailVerified}`);
    });
    
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTokens();
