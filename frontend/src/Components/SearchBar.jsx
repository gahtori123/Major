import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSearchData, createChat, searchBarContent, selectChat } from "../store/Slices/AuthSlice";

function SearchBar() {
    const [content, setContent] = useState("");
    const userId = useSelector((state) => state.auth.user?._id);
    const searchData = useSelector((state) => state.auth.searchData);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!content.trim()) {
            dispatch(clearSearchData());
            return;
        }

        const timeoutId = setTimeout(() => {
            dispatch(searchBarContent({ userId, content }));
        }, 250);

        return () => clearTimeout(timeoutId);
    }, [content, userId, dispatch]);

    const handleClick = useCallback((data) => {
        dispatch(createChat({ userId, users: [userId, data.receive_id] }));
        dispatch(selectChat({ chat_id: data.chat_id, userId }));
        setContent("");
        dispatch(clearSearchData());
    }, [dispatch, userId]);

    return (
        <div className="px-4 py-2">
            <input
                type="text"
                placeholder="Search or start a new conversation"
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            {searchData.length > 0 && (
                <div className="bg-white shadow-lg rounded-md mt-2">
                    {searchData.map((data, index) => (
                        <div
                            key={index}
                            className="flex items-center cursor-pointer hover:bg-gray-100 transition-all p-3 border-b last:border-none"
                            onClick={() => handleClick(data)}
                        >
                            <img src={data.dp} className="w-10 h-10 rounded-full mr-3" alt="Profile" />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold truncate">{data.name}</p>
                                <p className="text-sm text-gray-600 truncate max-w-[80%]">{data.lastMessage.message}</p>
                            </div>
                        </div>
                    ))}
                    <p className="text-center text-gray-500 p-2">Search results over</p>
                </div>
            )}
        </div>
    );
}

export default SearchBar;
