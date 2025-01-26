import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import { useEffect } from 'react';
import io from 'socket.io-client';
import AuthWrapper from './Components/authWrapper';
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/login';
import Layout from './Layout/layout';
import Home from './Pages/Home';

const socket = io(import.meta.env.VITE_BACKEND_URL, { withCredentials: true });

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server!");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <AuthWrapper>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                </Routes>
              </Layout>
            </AuthWrapper>
          }
        />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
