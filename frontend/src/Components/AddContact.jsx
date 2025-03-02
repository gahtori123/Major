import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, X } from 'lucide-react'; // Import icons
import { AddContactIn } from '../store/Slices/AuthSlice';

function AddContact() {
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const id = useSelector((state) => state.auth.user?._id);
    const dispatch = useDispatch();

    return (
        <div className="relative">
            <button
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-700 text-white transition"
                onClick={() => setIsAdding(prev => !prev)}
            >
                <Plus size={20} />
            </button>

            {isAdding && (
                <div className="absolute  mt-2 w-64 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-50">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-semibold">Add Contact</h2>
                        <button onClick={() => setIsAdding(false)}>
                            <X size={20} />
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-2 px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mb-3 px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                        onClick={() => {
                            console.log("here in");
                            setIsAdding(false);
                            dispatch(AddContactIn({email,name,id}));
                        }}
                    >
                        Add
                    </button>
                </div>
            )}
        </div>
    );
}

export default AddContact;
