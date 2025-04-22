import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.Model.js';
import ChatModel from '../models/Chat.Model.js';
import Message from '../models/Messages.Model.js';
import mongoose from 'mongoose';
import memory from 'multer/storage/memory.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleSignUp = async (req, res) => {
    const { tokenId } = req.body;
    if (!tokenId) {
        return res.status(400).json({
            success: false,
            message: "tokenId is required"
        })
    }
    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        const { email, name, picture } = ticket.getPayload();

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                name,
                avatar: {
                    secure_url: picture,
                    public_id: null
                }
            })
        }

        const token = user.jwtToken();
        const refreshToken = user.refreshToken();

        const cookieOptions = {
            maxAge: 36000000,
            httpOnly: true,
        }

        res.cookie('token', token, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

        return res.status(200).json({
            success: true,
            data: user,
            message: "user logged in successfully"
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "something went wrong"
        })
    }
}

const createContactList = async (req, res) => {
    const { email, user_id, name } = req.body;
    const user = await User.findById(user_id);
    if (!email) {
        return res.status(400).json({
            success: false,
            message: "email is required"
        })
    }
    try {
        const userToAdd = await User.findOne({ email });
        if (!userToAdd) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const userToAddId = userToAdd._id;
        const saved_name = (name === undefined) ? userToAdd.name : name;
        const contactExist = user.user_contacts.find(contact =>
            contact.user_id.equals(userToAddId)
        );
        if (contactExist) {
            return res.status(409).json({
                success: false,
                message: "Contact already exists"
            })
        }

        user.user_contacts.push({
            user_id: userToAddId,
            saved_name
        })
        user.save();
        return res.status(200).json({
            success: true,
            data: user.user_contacts,
            message: "Contact added successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Something went wrong while adding contact"
        })
    }
}

const search = async (req, res) => {
    const { content, userId } = req.body;
    if (!content) {
        return res.status(400).json({
            success: false,
            message: "Content is required"
        });
    }

    const regex = new RegExp(content, 'i');

    try {
        const users = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            { $unwind: "$user_contacts" },
            {
                $lookup: {
                    from: "users",
                    localField: "user_contacts.user_id",
                    foreignField: "_id",
                    as: "user_details"
                }
            },
            { $unwind: "$user_details" },
            {
                $match: {
                    $or: [
                        { "user_contacts.saved_name": regex },
                        { "user_details.email": regex }
                    ]
                }
            },
            {
                $lookup: {
                    from: "chats",
                    let: { searcherId: "$_id", contactId: "$user_details._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $gt: [{ $size: "$members" }, 0] },
                                        { $in: ["$$searcherId", "$members.user_id"] },
                                        { $in: ["$$contactId", "$members.user_id"] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1 } }
                    ],
                    as: "chat_info"
                }
            },
            {
                $project: {
                    "user_contacts.user_id": "$user_details",
                    "user_contacts.saved_name": 1,
                    "chat_id": { $arrayElemAt: ["$chat_info._id", 0] }
                }
            }
        ]);

        const grp_data = await ChatModel.aggregate([
            {
                $match: {
                    members: {
                        $elemMatch: {
                            user_id: new mongoose.Types.ObjectId(userId)
                        }
                    },
                    group_name: regex
                }
            },
            {
                $project: {
                    chat_id: "$_id",
                    dp: "$group_image",
                    name: "$group_name",
                    lastMessage: 1
                }

            }
        ]
        );

        const result = await Promise.all(users.map(async (user) => {
            const message = await ChatModel.findById(user.chat_id).select("lastMessage");
            return {
                name: user.user_contacts.saved_name
                    ? user.user_contacts.saved_name
                    : user.user_contacts.user_id.name,
                dp: user.user_contacts.user_id.avatar?.secure_url,
                chat_id: user.chat_id,
                lastMessage: message.lastMessage,
                receive_id: user.user_contacts.user_id._id
            };
        }));

        const data = [...result, ...grp_data];
        return res.status(200).json({
            success: true,
            data: data,
            message: "Search successful"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Something went wrong while searching"
        });
    }
};




const editContactDetails = async (req, res) => {
    const { user_id, contact_id, saved_name } = req.body;
    const user = await User.findById(user_id);
    if (!contact_id || !saved_name) {
        return res.status(400).json({
            success: false,
            message: "contact_id and saved_name are required"
        })
    }
    try {
        const contact = user.user_contacts.find(contact => contact._id.equals(contact_id));
        if (!contact) {
            user.user_contacts.push({
                user_id: contact_id,
                saved_name
            })
        }
        else {
            contact.saved_name = saved_name;
        }
        user.save();
        return res.status(200).json({
            success: true,
            data: user.user_contacts,
            message: "Contact details updated successfully"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Something went wrong while updating contact details"
        })
    }
}
const createChat = async (req, res) => {
    const { initiator_id, user_id_array, isGroupChat = false, group_name, group_image } = req.body;

    if (!user_id_array || isGroupChat === undefined) {
        return res.status(400).json({
            success: false,
            message: "Pass user_id_array and isGroupChat field",
        });
    }

    if (!Array.isArray(user_id_array) || user_id_array.length < 2) {
        return res.status(400).json({
            success: false,
            message: "user_id_array must be an array with at least 2 user IDs",
        });
    }

    if (!isGroupChat) {
        if (user_id_array.length !== 2) {
            return res.status(400).json({
                success: false,
                message: "Private chat must involve exactly two users",
            });
        }
        try {
            const objectIds = user_id_array.map((id) =>
                new mongoose.Types.ObjectId(id)
            );
            const chatExist = await ChatModel.findOne({
                is_group_chat: false,
                members: {
                    $all: [
                        { $elemMatch: { user_id: objectIds[0] } },
                        { $elemMatch: { user_id: objectIds[1] } },
                    ],
                },
            });
            if (chatExist) {
                return res.status(200).json({
                    success: true,
                    message: "Private chat already exists",
                    data: chatExist,
                });
            }
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message || "Error checking for existing chat",
            });
        }
    }

    try {
        const members = user_id_array.map((id) => ({
            user_id: new mongoose.Types.ObjectId(id),
            is_admin: id === initiator_id,
        }));

        const chat = await ChatModel.create({
            is_group_chat: isGroupChat,
            members,
        });

        if (isGroupChat) {
            chat.group_name = group_name;
            chat.group_image = group_image;
        }
        chat.save();

        return res.status(201).json({
            success: true,
            message: "Chat created successfully",
            data: chat,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Something went wrong while creating chat",
        });
    }
};

const addMembersToGroup = async (req, res) => {
    const { chat_id, new_members } = req.body;

    if (!chat_id || !Array.isArray(new_members) || new_members.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Provide a valid chat_id and an array of new_members.",
        });
    }

    try {
        const groupChat = await ChatModel.findById(chat_id);

        if (!groupChat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found.",
            });
        }

        if (!groupChat.is_group_chat) {
            return res.status(400).json({
                success: false,
                message: "This is not a group chat. Cannot add members to a private chat.",
            });
        }

        const existingMemberIds = groupChat.members.map((member) =>
            member.user_id.toString()
        );

        // Filter out members that are already part of the group
        const uniqueNewMembers = new_members.filter(
            (id) => !existingMemberIds.includes(id)
        );

        if (uniqueNewMembers.length === 0) {
            return res.status(400).json({
                success: false,
                message: "All provided members are already in the group.",
            });
        }

        // Add new members to the group
        const newMemberObjects = uniqueNewMembers.map((id) => ({
            user_id: new mongoose.Types.ObjectId(id),
            is_admin: false,
        }));

        groupChat.members.push(...newMemberObjects);

        await groupChat.save();

        return res.status(200).json({
            success: true,
            message: "New members added to the group successfully.",
            data: groupChat,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error. Could not add members to the group.",
        });
    }
};


const sendMessage = async (req, res) => {
    console.log("REQ.BODY",req.body)
    const { sender_user_id, message, attachments, chat_id } = req.body;
    if (!chat_id || !sender_user_id || !message) {
        return res.status(400).json({
            success: false,
            message: "chat_id (params), sender_user_id, and message are required",
        });
    }

    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(chat_id) ||
            !mongoose.Types.ObjectId.isValid(sender_user_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        const newMessage = await Message.create({
            message,
            sender_user_id: new mongoose.Types.ObjectId(sender_user_id),
            attachments,
        });

        const chat = await ChatModel.findByIdAndUpdate(
            chat_id,
            {
                $push: { messages: newMessage._id },
                $set: {
                    lastMessage: {
                        senderId: sender_user_id,
                        message,
                        timestamp: new Date()
                    }
                }
            },
            { new: true, useFindAndModify: false }
        );

        if (!chat) {
            await Message.deleteOne({ _id: newMessage._id });
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }
        const data = await newMessage.populate('sender_user_id', 'name avatar');
        const messageData = data.toObject();
        messageData.chat_id = chat_id;
        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: messageData,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Something went wrong while sending the message",
        });
    }
};

export const sendMessageToDB = async ({ sender_user_id, message, attachments, chat_id }) => {
    if (!chat_id || !sender_user_id || !message) {
        throw new Error("Something went wrong while sending the message");
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(chat_id) ||
            !mongoose.Types.ObjectId.isValid(sender_user_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        const newMessage = await Message.create({
            message,
            sender_user_id: new mongoose.Types.ObjectId(sender_user_id),
            attachments,
        });

        const chat = await ChatModel.findByIdAndUpdate(
            chat_id,
            {
                $push: { messages: newMessage._id },
                $set: {
                    lastMessage: {
                        senderId: sender_user_id,
                        message,
                        timestamp: new Date()
                    }
                }
            },
            { new: true, useFindAndModify: false }
        );

        if (!chat) {
            await Message.deleteOne({ _id: newMessage._id });
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }
        const data = await newMessage.populate('sender_user_id', 'name avatar');
        const messageData = data.toObject();
        messageData.chat_id = chat_id;
        return messageData;
    } catch (err) {
        throw new Error(err.message || "Something went wrong while sending the message");
    }
};

const getMessages = async (req, res) => {
    //frontend is requiring the name and dp to display so i will attach it with response
    const { chat_id, userId } = req.body;

    if (!chat_id) {
        return res.status(400).json({
            success: false,
            message: "chat_id is required in params",
        });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(chat_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid chat ID format"
            });
        }

        const chat = await ChatModel.findById(chat_id)
            .populate({
                path: 'messages',
                populate: {
                    path: 'sender_user_id',
                    select: 'name avatar',
                },
            })
            .lean();

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        //if user is in contact list we will update the user name and display that name in chat
        const user = await User.findById(userId);
        const userContacts = user.user_contacts;
        chat.messages.forEach((message) => {
            const contact = userContacts.find(contact => contact.user_id.equals(message.sender_user_id._id));
            if (contact) {
                message.sender_user_id.name = contact.saved_name;
            }
        });
        const chatData = {}

        if (chat.is_group_chat) {
            chatData.dp = chat.group_image,
                chatData.name = chat.group_name
        }
        else {
            const other_user = chat.members.filter((member) => {
                return member.user_id.toString() !== userId.toString();
            });

            if (other_user.length > 0) {
                const second_user = await User.findById(other_user[0].user_id);

                const isSaved = user.user_contacts.find(contact =>
                    contact.user_id.equals(second_user?._id)
                );

                chatData.name = isSaved ? isSaved.saved_name : second_user?.name;
                chatData.dp = second_user?.avatar?.secure_url;
                chatData.about = second_user?.about;
                chatData.email = second_user?.email;
                chatData.phone_no = second_user?.phone_no;
            }
        }
        chatData.chat_id = chat_id;
        // Sort messages by creation date
        const sortedMessages = chat.messages.sort(
            (a, b) => new Date(a.timestamp.created_at) - new Date(b.timestamp.created_at)
        );
        return res.status(200).json({
            success: true,
            chatData: chatData,
            data: sortedMessages,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Something went wrong while retrieving messages",
        });
    }
};


//for sidebar which has list of chats
const fetchChats = async (req, res) => {
    try {
        const { userId } = req.body;
        const objId = new mongoose.Types.ObjectId(userId);
        const chats = await ChatModel.find({ "members.user_id": objId })
            .select("group_name is_group_chat lastMessage members group_image")
            .lean()

        chats.forEach(chat => {
            if (!chat.is_group_chat) {
                chat.members = chat.members.filter(member => !member.user_id.equals(objId));
            }
        });

        const user = await User.findById(objId);
        for (const chat of chats) {
            if (chat.is_group_chat) {
                chat.name = chat.group_name;
                chat.dp = chat.group_image;
            } else {
                const member = await User.findById(chat.members[0].user_id);
                const isSaved = user.user_contacts.find(contact => contact.user_id.equals(member._id));
                chat.name = isSaved ? isSaved.saved_name : member.name;
                chat.dp = member.avatar.secure_url;
            }
        }
        //something is wrong with the ordering of chats while sorting fix it
        // console.log(chats);
        // const newchats = chats.sort(
        //     (a, b) => new Date(a.lastMessage?.timestamp.created_at) - new Date(b.lastMessage?.timestamp.created_at)
        // );
        // console.log("newchats",newchats)
        res.status(200).json({
            success: true,
            data: chats
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Server error" });
    }
};


export {
    googleSignUp,
    createContactList,
    editContactDetails,
    createChat,
    addMembersToGroup,
    sendMessage,
    getMessages,
    fetchChats,
    search
}
