import { GoogleLogin } from '@react-oauth/google';
import React from 'react'
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { googleLogin } from '../store/Slices/AuthSlice';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("in login");
  const handleGoogleSignup = async(response)=>{
    const {credential} = response;
    const res = await dispatch(googleLogin({tokenId:credential}));
    navigate("/")
  }
  return (
      <GoogleLogin
        onSuccess={handleGoogleSignup}
        onError={(error) => console.log(error)}
        size="large"
        useOneTap
      />
  )
}

export default Login;
