import './App.css';
import "tailwindcss";
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Jobs from './components/Jobs';
import MyNetworks from './components/MyNetworks';
import Notifications from './components/Notifications';
import MyProfile from './components/MyProfile';
import LoginPage from './components/LoginPage';
import JobsDetails from './components/JobsItem';
import FullDetails from './components/FullDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from "./components/Signup";
import Bookmarks from "./components/Bookmarks";
import Messages from "./components/Messages";
import Connections from "./components/Connections";
import Page from './components/Page'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Page />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            
            <Route path="/home" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobsDetails />} />
            <Route path="/myNetworks" element={<MyNetworks />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/myProfile" element={<MyProfile />} />
            <Route path="/fullDetails" element={<FullDetails />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/connections" element={<Connections />} />
          </Route>

          {/* Catch-all Route for 404 Not Found */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;