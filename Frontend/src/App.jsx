import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import "./App.css";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { SocketProvider } from "./components/context/SocketContext.jsx";
import { NotificationProvider } from "./components/context/NotificationContext";

import Header from "./components/Header/Header";
import Home from "./components/Home";
import Notifications from "./components/Notifications";
import LoginPage from "./components/LoginPage";
import FullDetails from "./components/FullDetails";
import Bookmarks from "./components/Bookmarks";
import Connections from "./components/Connections";
import StartPage from "./components/StartPage";
import Goals from "./components/ProfileIcon/MyProfile/Goals";
import Settings from "./components/ProfileIcon/MyProfile/Settings";
import Grow from "./components/ProfileIcon/MyProfile/Grow";
import Updates from "./components/ProfileIcon/MyProfile/Updates";
import Reviews from "./components/ProfileIcon/MyProfile/Reviews";
import Feedback from "./components/ProfileIcon/MyProfile/Feedback";
import CreateJob from "./components/JobPages/CreateJob";
import EditJob from "./components/JobPages/EditJob";
import RegisterForm from "./components/RegisterForm/RegisterForm.jsx";
import JobDetails from "./components/JobPages/JobDetails";
import MyNetwork from "./components/MyNetworks/MyNetwork.jsx";
import Premium from "./components/ProfileIcon/Premuim.jsx";
import MyProfile from "./components/ProfileIcon/MyProfile/index";
import Dashboard from "./components/JobPages/Dashboard";
import Posts from "./components/feed/Posts";
import PostDetails from "./components/feed/PostDetails";
import FreelanceCreatePage from "./components/freelancePage/FreelanceCreatePage.jsx";
import FreelanceLandingPage from "./components/freelancePage/FreelanceLandingPage.jsx";
import FreelancePostDetails from "./components/freelancePage/FreelancePostDetails.jsx";
import ToastContainer from "./components/Notifications/ToastContainer.jsx";
import MessagesAdvanced from "./components/MessagesPage/MessagesAdvanced.jsx";

const NotFound = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mt-4 text-gray-600">
        Sorry, the page you're looking for doesn't exist.
      </p>
      <a
        href="/"
        className="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Go Home
      </a>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      if (newToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      } else {
        delete axios.defaults.headers.common["Authorization"];
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <SocketProvider>
        <NotificationProvider>
          <div className="App min-h-screen bg-gray-50">
            <Header />
            <ToastContainer />
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<RegisterForm />} />

              <Route path="/feeds" element={<Posts />} />
              <Route path="/posts/:id" element={<PostDetails />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/premium" element={<Premium />} />
                <Route path="/home" element={<Home />} />
                <Route path="/jobs" element={<Dashboard />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/Hiring" element={<CreateJob />} />
                <Route path="/jobs/:id/edit" element={<EditJob />} />
                <Route path="/myNetworks" element={<MyNetwork />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/myProfile" element={<MyProfile />} />
                <Route path="/FullDetails/:userId" element={<FullDetails />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/messages" element={<MessagesAdvanced />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/grow" element={<Grow />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/updates" element={<Updates />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/freelance" element={<FreelanceLandingPage />} />
                <Route
                  path="/freelance/create"
                  element={<FreelanceCreatePage />}
                />
                // In your App.jsx or routing file
                <Route
                  path="/freelance/post/:id"
                  element={<FreelancePostDetails />}
                />
              </Route>

              {/* Catch-all for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </NotificationProvider>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
