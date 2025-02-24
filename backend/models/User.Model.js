import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  user_contacts: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      saved_name: {
        type: String,
      }
    }
  ],
  blocked_contacts: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
  },
  avatar: {
    public_id: {
      type: String,
    },
    secure_url: {
      type: String,
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


userSchema.methods = {
  jwtToken(){
      return jwt.sign(
          {id:this._id,email:this.email},
          process.env.SECRET,
          {expiresIn:'10d'}
      )
  },
  refreshToken(){
      return jwt.sign(
          {id:this._id,email:this.email},
          process.env.REFRESH_SECRET,
          {expiresIn:'30d'}
      )
  }
}

export default mongoose.model('User', userSchema);