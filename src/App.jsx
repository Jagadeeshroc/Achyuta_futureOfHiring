import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios'; // For global headers
import './App.css'; // Assuming this includes Tailwind directives or imports
// If you have a separate CSS for Tailwind:
// import './index.css'; // With @tailwind base; @tailwind components; @tailwind utilities;

// ProtectedRoute and SocketProvider
import ProtectedRoute from './components/ProtectedRoute';
import { SocketProvider } from './components/context/SocketContext.jsx';
import { NotificationProvider } from './components/context/NotificationContext';

// Components
import Header from './components/Header/Header';
import Home from './components/Home';

import Notifications from './components/Notifications';

import LoginPage from './components/LoginPage';
import FullDetails from './components/FullDetails';
import Bookmarks from './components/Bookmarks';
import Connections from './components/Connections';
import StartPage from './components/StartPage';
import Goals from './components/ProfileIcon/MyProfile/Goals';
import Settings from './components/ProfileIcon/MyProfile/Settings';
import Grow from './components/ProfileIcon/MyProfile/Grow';
import Updates from './components/ProfileIcon/MyProfile/Updates';
import Reviews from './components/ProfileIcon/MyProfile/Reviews';
import Feedback from './components/ProfileIcon/MyProfile/Feedback';

import CreateJob from './components/JobPages/CreateJob';
import EditJob from './components/JobPages/EditJob';
import RegisterForm from './components/RegisterForm/RegisterForm.jsx';
import MessageComponent from './components/messages/MessageComponent.jsx';
import JobDetails from './components/JobPages/JobDetails';
// import UserDetails from './components/MyNetworks/userDetails.jsx';
import MyNetwork from './components/MyNetworks/MyNetwork.jsx';
import Premium from './components/ProfileIcon/Premuim.jsx';
import MyProfile from './components/ProfileIcon/MyProfile/index';
import Dashboard from './components/JobPages/Dashboard';
import Posts from './components/feed/Posts';
import PostDetails from './components/feed/PostDetails';


// Simple 404 Component
const NotFound = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mt-4 text-gray-600">Sorry, the page you're looking for doesn't exist.</p>
      <a href="/" className="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Go Home
      </a>
    </div>
  </div>
);

function App() {
  // Set Axios defaults reactively (runs on mount and token change)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }

    // Optional: Listen for storage changes (e.g., logout in another tab)
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      if (newToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <NotificationProvider>
    <SocketProvider>

      <BrowserRouter>
        <div className="App min-h-screen bg-gray-50">
          <Header /> {/* Assuming Header is global; move inside Routes if needed */}
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterForm />} />
            <Route path="/" element={<StartPage />} />
            <Route path="/feeds" element={<Posts/>} />
            <Route path="/posts/:id" element={<PostDetails />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
               <Route path="/premium" element={<Premium />} />
              <Route path="/home" element={<Home />} />
              <Route path="/jobs" element={<Dashboard/>} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/Hiring" element={<CreateJob />} />
              <Route path="/jobs/:id/edit" element={<EditJob />} />
              <Route path="/myNetworks" element={<MyNetwork />} />
              {/* <Route path="/user/:userId" element={<UserDetails />} /> */}
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/myProfile" element={<MyProfile />} />
              <Route path="/FullDetails/:userId" element={<FullDetails />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/messages" element={<MessageComponent />} />
              <Route path="/connections" element={<Connections />} />

              {/* Nested profile routes - adjust paths if needed (e.g., under /myProfile) */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/grow" element={<Grow />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/updates" element={<Updates />} />
              <Route path="/feedback" element={<Feedback />} />
            </Route>

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SocketProvider>
    </NotificationProvider>
  );
}

export default App;