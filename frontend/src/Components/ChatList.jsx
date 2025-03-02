import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import { fetchChats } from "../store/Slices/AuthSlice";
import AddContact from "./AddContact";
import SearchBar from "./SearchBar";

const ChatList = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user?._id);
    const { chatList, status, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userId) {
            dispatch(fetchChats(userId));
        }
    }, [dispatch, userId]);
    console.log("chatList",chatList);
    if (status === "loading") return <p>Loading chats...</p>;
    if (status === "failed") return <p>Error: {error}</p>;

    return (
        <div className="flex flex-col h-[92vh] w-1/3 border-r shadow-lg border-gray-300 bg-white">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-100">
                <h1 className="text-lg font-semibold text-gray-800">Chats</h1>
                <AddContact />
            </div>

            <SearchBar />

            <div className="overflow-y-auto flex-1 px-4 space-y-2 pb-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {chatList.length > 0 ? (
                    chatList.map((chat) => <ChatItem key={chat._id} chat={chat} />)
                ) : (
                    <p className="text-center text-gray-500">No chats available</p>
                )}
            </div>
        </div>
    );
};

export default ChatList;