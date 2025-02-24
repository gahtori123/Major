import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import { fetchChats } from "../store/Slices/AuthSlice";

const ChatList = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user?._id);
    const { chatList, status, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userId) {
            dispatch(fetchChats(userId));
        }
    }, [dispatch, userId]);


    if (status === "loading") return <p>Loading chats...</p>;
    if (status === "failed") return <p>Error: {error}</p>;
    console.log("chatList: ", chatList);
    return (
        <div className="w-1/3 border-r h-screen overflow-y-auto">
            {chatList.map((chat) => (
        <ChatItem key={chat._id} chat={chat} />
      ))}
        </div>
    );
};

export default ChatList;