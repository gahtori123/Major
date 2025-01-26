import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    is_group_chat: {
        type: Boolean,
        required: true
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
    ]
});

export default mongoose.model('Chat', ChatSchema);
