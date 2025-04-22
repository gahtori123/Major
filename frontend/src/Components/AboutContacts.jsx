import React from 'react'

function AboutContacts({ selectedChat }) {
    console.log("Selected Chat:", selectedChat);
    return (
        <div className='absolute w-96 h-3/5 bg-slate-300 z-10 rounded-lg shadow-lg p-4 flex flex-col'>
            <div className='flex flex-col items-center mb-4'>
                <img
                    className="w-20 h-20 rounded-full mb-4 object-cover"
                    src={selectedChat?.dp || "/default-avatar.png"}
                    alt="DP"
                />
                <h2 className="text-lg font-semibold">{selectedChat?.name || "Unknown"}</h2>
            </div>
            <div>
                <h2>about</h2>
                <p className="text-sm text-gray-600 mb-4">{selectedChat?.about?.about || "No about available"}</p>
                <h2>email</h2>
                <p className="text-sm text-gray-600 mb-4">{selectedChat?.email || "email?"}</p>
                <h2>phone number</h2>
                <p className="text-sm text-gray-600 mb-4">{selectedChat?.phone_no || "no phone number available?"}</p>
            </div>
        </div>
    )
}

export default AboutContacts
