import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "./Message";
import socket from "../socket/socket";
import { receiveMessage } from "../store/Slices/AuthSlice";

const ChatContainer = () => {
  const selectedChat = useSelector((state) => state.auth.selectedChat);
  const messagesData = useSelector((state) => state.auth.messagesData);
  const chatEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const sender_user_id = useSelector((state) => state.auth.user._id);
  const dispatch = useDispatch();
  const [typing, setTyping] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState("");

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      dispatch(receiveMessage(message));
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

  useEffect(() => {
    socket.on('typing', (data) => {
      setTyping(data);
    });
    return () => {
      socket.off('typing');
    };
  },);
  if (!selectedChat) return <p className="p-4">Select a chat to start messaging</p>;

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const messageData = { sender_user_id, chat_id: selectedChat.chat_id, message };
    socket.emit('sendMessage', messageData);
    setMessage("");
  };

  const isTyping = () => {
    const chat_id = selectedChat.chat_id;
    socket.emit('isTyping', { chat_id, typingUser: true });
    setTimeout(() => {
      socket.emit('isTyping', { chat_id, typingUser: false });
    }, 2000);
  }

  const scheduleMessage = () => {
    const sendAt = new Date(scheduledDateTime);
    const now = new Date();

    const delay = sendAt.getTime() - now.getTime();
    if (delay <= 0 || !message.trim()) return;

    setTimeout(() => {
      handleSendMessage();
    }, delay);

    alert("Message scheduled successfully!");
  };


  return (
    <div className="w-2/3 p-4 flex flex-col h-[92vh]">
      <div className="flex items-center border-b border-gray-300 p-2">
        <img
          src={selectedChat?.dp || "/default-avatar.png"}
          alt="Chat DP"
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <h2 className="text-xl font-bold border-b pb-2">{selectedChat?.name}</h2>
        {typing ? <p className="text-sm text-gray-500 ml-2">Typing...</p> : null}
      </div>
      <div className="flex-1 overflow-y-auto mt-4 pl-2 pr-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
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
          onChange={(e) => {
            setMessage(e.target.value);
            isTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          value={message}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={handleSendMessage}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowSchedulePopup(true);
          }}
        >
          Send
        </button>
        {showSchedulePopup && (
          <div className="absolute bg-white p-4 shadow-lg border rounded-lg z-50 right-8 bottom-24">
            <label className="block mb-2">Choose Date & Time:</label>
            <input
              type="datetime-local"
              value={scheduledDateTime}
              onChange={(e) => setScheduledDateTime(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <button
              onClick={() => {
                scheduleMessage();
                setShowSchedulePopup(false);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Schedule
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChatContainer;