import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  user_name: {
    type: String,
    required: true
  },
  user_contacts: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      saved_name: {
        type: String,
        required: true
      }
    }
  ],
  about: {
    about: String,
    timestamp: {
      created_at: Date,
      modified_at: Date
    }
  },
  phone_no: {
    type: String,
    required: true
  },
  avatar: {
    public_id: {
      type: String,
      required: true
    },
    secure_url: {
      type: String,
      required: true
    }
  },
  status: {
    online: {
      type: Boolean,
      default: false
    },
    last_seen: {
      type: Date
    }
  },
  blocked_contacts: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  timestamp: {
    created_at: {
      type: Date,
      default: Date.now
    },
    modified_at: {
      type: Date,
      default: Date.now
    }
  }
});

export default mongoose.model('User', UserSchema);
