import { useDispatch, useSelector } from "react-redux";
import { selectChat } from "../store/Slices/AuthSlice";

const ChatItem = ({ chat }) => {
    const dispatch = useDispatch();
    const userId = useSelector((state)=>state.auth.user?._id);
    if (!chat || typeof chat !== "object") {
        return null;
    }
    return (
        <div onClick={() => dispatch(selectChat({ chat_id: chat._id, userId: userId , name:chat.name, dp:chat.dp}))} className="flex items-center p-3 pl-8 border-b cursor-pointer max-w-[100%] hover:bg-gray-100">
            <img
                src={chat.dp || "/default-avatar.png"}
                alt="Chat DP"
                className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <div className="max-w-[100%]">
                <h3 className="font-bold">{chat.name || "Unknown"}</h3>
                <p className="text-sm text-gray-600 truncate max-w-[80%]">{chat.lastMessage?.message || "No messages yet"}</p>
            </div>
        </div>
    );
};

export default ChatItem;
