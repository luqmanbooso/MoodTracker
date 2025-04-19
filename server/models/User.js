import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false // Not required for test users
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Use this syntax to avoid model redefinition errors
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;