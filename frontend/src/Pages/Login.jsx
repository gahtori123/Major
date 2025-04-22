import { GoogleLogin } from '@react-oauth/google';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../store/Slices/AuthSlice';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSignup = async (response) => {
    const { credential } = response;
    await dispatch(googleLogin({ tokenId: credential }));
    navigate("/");
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80 max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Batchit</h1>
          <p className="text-gray-600">A Secure Chatting App with Scheduling Features</p>
        </div>
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSignup}
            onError={(error) => console.log(error)}
            size="large"
            useOneTap
            className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-blue-600 transition duration-300"
          >
            Sign in with Google
          </GoogleLogin>
        </div>
        <div className="text-center text-sm text-gray-500">
          <p>By signing in, you agree to our <span className="text-blue-500 cursor-pointer">Terms of Service</span> and <span className="text-blue-500 cursor-pointer">Privacy Policy</span>.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
