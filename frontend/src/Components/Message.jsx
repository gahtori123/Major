import React from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

function Message({ message }) {
  const userId = useSelector((state) => state.auth.user._id); // Current user ID
  const isOwnMessage = message.sender_user_id._id === userId; // Check if message is sent by current user

  return (
    <div className={clsx(
      "flex items-end mb-3 w-full",
      isOwnMessage ? "justify-end" : "justify-start"
    )}>
      {!isOwnMessage && (
        <img
          src={message.sender_user_id.avatar.secure_url}
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
      )}

      <div className={clsx(
        "max-w-xs md:max-w-md px-3 py-2 rounded-lg shadow-md relative",
        isOwnMessage ? "bg-green-500 text-white" : "bg-gray-200 text-gray-900"
      )}>
        {/* Optionally show sender name for messages from others */}
        {!isOwnMessage && <h3 className="font-bold">{message.sender_user_id.name}</h3>}
        <p className="text-sm">{message.message}</p>
        <span className="text-xs text-gray-500 block text-right mt-1">
          {new Date(message.timestamp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

export default Message;
