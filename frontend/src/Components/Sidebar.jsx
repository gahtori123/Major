import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const [showUserProfile, setShowUserProfile] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const profileRef = useRef(null);

  const handleClick = () => {
    setShowUserProfile((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowUserProfile(false);
      }
    };

    if (showUserProfile) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserProfile]);

  return (
    <div className="min-w-14 bg-gray-900 h-[92vh] flex flex-col items-center justify-end shadow-lg border-r border-gray-700 relative">
      <img
        src={user.avatar.secure_url}
        alt="PP"
        className="w-12 h-12 rounded-full mt-4 mb-8 border-2 border-gray-300 cursor-pointer hover:scale-105 transition-transform"
        onClick={handleClick}
      />

      {showUserProfile && (
        <div
          ref={profileRef}
          className="absolute bottom-32 left-16 z-50 bg-white p-4 shadow-2xl rounded-xl w-56 animate-fade-in"
        >
          <div className="flex flex-col items-center">
            <img
              src={user.avatar.secure_url}
              alt="PP"
              className="w-16 h-16 rounded-full mb-2 border-2 border-gray-300"
            />
            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
            <p className="text-sm text-gray-500 break-words text-center px-2">{user.email}</p>
            <button className="mt-3 px-4 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-full"
            onClick={() => {
              localStorage.removeItem('user');
              localStorage.removeItem('isLoggedIn');
              window.location.reload();
            }}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
