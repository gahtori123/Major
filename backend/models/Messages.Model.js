import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attachments: {
        type: String
    },
    timestamp: {
        created_at: {
            type: Date,
            default: Date.now
        },
        modified_at: {
            type: Date
        }
    },
    status: {
        type: String,
        enum: ['delivered', 'seen'],
        default: 'delivered'
    }
});

export default mongoose.model('Message', MessageSchema);
