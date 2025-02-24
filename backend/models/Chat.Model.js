import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    is_group_chat: {
        type: Boolean,
        default: false
    },
    members: [
        {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            is_admin: {
                type: Boolean,
                default: false
            }
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],
    lastMessage: {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        timestamp: Date
    },
    group_name: {
        type: String,
    },
    group_image:{
        type: String
    }
});

export default mongoose.model('Chat', ChatSchema);
