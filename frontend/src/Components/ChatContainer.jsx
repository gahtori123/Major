import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "./Message";
import { sendMessage } from "../store/Slices/AuthSlice";
import socket from "../socket/socket";

const ChatContainer = () => {
  const selectedChat = useSelector((state) => state.auth.selectedChat);
  const messagesData = useSelector((state) => state.auth.messagesData);
  const chatEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const sender_user_id = useSelector((state) => state.auth.user._id);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      dispatch(sendMessage(message));
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [dispatch]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesData]);

  if (!selectedChat) return <p className="p-4">Select a chat to start messaging</p>;

  console.log("Selected chat: ", selectedChat);

  const handleSendMessage = () => {
    const messageData = { sender_user_id, chat_id: selectedChat.chat_id, message };
    socket.emit('sendMessage', messageData);
    setMessage("");
  };

  return (
    <div className="w-2/3 p-4 flex flex-col h-[90vh]">
      <h2 className="text-xl font-bold border-b pb-2">{selectedChat?.name}</h2>
      <div className="flex-1 overflow-y-auto mt-4 px-2">
        {messagesData && messagesData.length > 0 ? (
          messagesData.map((message) => (
            <Message key={message._id} message={message} />
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="flex items-center border-t border-gray-300 p-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;