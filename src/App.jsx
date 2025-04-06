import './App.css';
import "tailwindcss";
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import MyNetworks from './components/MyNetworks';
import Notifications from './components/Notifications';
import MyProfile from './components/MyProfile';
import LoginPage from './components/LoginPage';
import FullDetails from './components/FullDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from "./components/Signup";
import Bookmarks from "./components/Bookmarks";
import Messages from "./components/Messages";
import Connections from "./components/Connections";
import StartPage from './components/StartPage';
import Goals from './components/MyProfile/Goals';
import Settings from './components/MyProfile/Settings';
import Grow from './components/MyProfile/Grow';
import Updates from './components/MyProfile/Updates';
import Reviews from './components/MyProfile/Reviews';
import Feedback from './components/MyProfile/Feedback';
import Dashboard from './components/JobPages/Dashboard';
import JobDetails from './components/JobPages/JobDetails';
import CreateJob from './components/JobPages/CreateJob';
import EditJob from './components/JobPages/EditJob';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<StartPage/>} />
           {/* Catch-all Route for 404 Not Found */}
        <Route path="*" element={<div>404 Not Found</div>} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            
            <Route path="/home" element={<Home />} />
            <Route path="/jobs" element={<Dashboard />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/Hiring" element={<CreateJob />} />
            <Route path="/jobs/:id/edit" element={<EditJob/>} />

            
            <Route path="/myNetworks" element={<MyNetworks />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/myProfile" element={<MyProfile />} />
            <Route path="/fullDetails" element={<FullDetails />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/goals" element={<Goals />} />
          </Route>
          <Route path="/grow" element={<Grow />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/feedback" element={<Feedback />} />
          

          
          
        </Routes>
       
      </BrowserRouter>
    </div>
  );
}

export default App;