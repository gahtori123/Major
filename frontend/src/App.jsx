import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import AuthWrapper from './Components/authWrapper';
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/login';
import Home from './Pages/Home';



function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <AuthWrapper>
                <Routes>
                  <Route path="/" element={<Home />} />
                </Routes>
            </AuthWrapper>
          }
        />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
