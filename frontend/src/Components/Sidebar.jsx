import { FaComments, FaPhone, FaCog } from "react-icons/fa";
import { useState } from "react";

const Sidebar = ({ onSelect }) => {
    //will complete sidebar after basic chat functionality is done
  return (
    <div className="w-[4rem] h-screen bg-gray-900 flex flex-col items-center py-4">
      <button onClick={() => onSelect("chats")} className="my-4">
        <FaComments className="text-gray-400 text-2xl hover:text-white" />
      </button>
      <button onClick={() => onSelect("calls")} className="my-4">
        <FaPhone className="text-gray-400 text-2xl hover:text-white" />
      </button>
      <button onClick={() => onSelect("settings")} className="my-4">
        <FaCog className="text-gray-400 text-2xl hover:text-white" />
      </button>
    </div>
  );
};

export default Sidebar;
