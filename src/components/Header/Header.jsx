import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiX,
  FiClock,
  FiUser,
  FiBell,
  FiMessageSquare,
  FiMenu,
  FiHash,
  FiPlusSquare,
} from "react-icons/fi";
import {
  FaHome,
  FaSuitcase,
  FaUserFriends,
  FaRegBuilding,
  FaRegComments,
} from "react-icons/fa";
import { TbCircleLetterF } from "react-icons/tb";
import { useNotifications } from "../context/NotificationContext";

export default function JobbyNavbar() {
  const [notificationsCount] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  // Removed unused showSuggestions state
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { globalUnreadMessages } = useNotifications();

  const navItems = [
    { path: "/home", icon: <FaHome className="text-lime-950" />, text: "Home" },
    {
      path: "/feeds",
      icon: <FiPlusSquare className="text-lime-950" />,
      text: "Feeds",
    },
    {
      path: "/jobs",
      icon: <FaSuitcase className="text-lime-950" />,
      text: "Jobs",
    },
    {
      path: "/myNetworks",
      icon: <FaUserFriends className="text-lime-950" />,
      text: "Network",
    },
    {
      path: "/freelance",
      icon: <TbCircleLetterF className="text-lime-950" />,
      text: "Freelance",
    },
  ];

  // Removed unused debouncedFetch to fix lint error

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // setShowSuggestions(false); // Removed unused state update
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    const updateUser = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setCurrentUser({ ...parsedUser, _id: parsedUser._id || parsedUser.id });
      } else {
        setCurrentUser(null);
      }
    };
    updateUser();
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  // Removed unused handleSearch function to fix lint error

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-white via-purple-100 to-white shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center bg-gradient-to-r from-white via-purple-400 to-white p-2! ">
        <Link
          to={localStorage.getItem("token") ? "/home" : "/"}
          className="flex items-center space-x-2"
        >
          <img
            src="/images/WhatsApp Image 2025-04-18 at 14.56.02_34b122d5.jpg"
            alt="Logo"
            className="w-14 h-14 rounded-full hover:scale-120 "
          />
          <span className=" m-2! hidden lg:block no-underline! font-bold text-lg text-blue-950! hover:text-amber-400!"
           style={{ fontFamily: '"Gugi", cursive' }}
          >Achyuta</span>
        </Link>


        
      <div className="hidden md:flex justify-center gap-6 m-2! ">
        {navItems.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={`relative flex flex-col items-center group px-3 py-2 text-sm ${location.pathname === item.path
                ? "text-blue-600 font-semibold"
                : "text-gray-600"
              }`}
          >
            <div className="text-2xl">{item.icon}</div>
            <span className="absolute bottom-[-1.5rem] scale-0 group-hover:scale-100 transition-transform bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {item.text}
            </span>
          </Link>
        ))}
      </div>

        <div className="flex items-center gap-4">
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <FiMenu size={24} />
          </button>

          <Link to="/messages" className="relative">
            <FiMessageSquare size={20} />
            {globalUnreadMessages > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full animate-pulse">
                {globalUnreadMessages > 99 ? "99+" : globalUnreadMessages}
              </span>
            )}
          </Link>

          <Link to="/notifications" className="relative">
            <FiBell size={20} />
            {notificationsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full animate-pulse">
                {notificationsCount}
              </span>
            )}
          </Link>
          <div className="relative group cursor-pointer mr-4!">
            <img
              src={
                currentUser?.avatar
                  ? currentUser.avatar.startsWith("http")
                    ? currentUser.avatar
                    : `http://localhost:5000${currentUser.avatar.replace(
                      /^\/Uploads/,
                      "/uploads"
                    )}`
                  : "/images/WhatsApp Image 2025-04-18 at 14.56.02_34b122d5.jpg"
              }
              alt="User"
              className="rounded-full h-12 w-12 "
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "/images/WhatsApp Image 2025-04-18 at 14.56.02_34b122d5.jpg";
              }}
            />

            <div className="hidden group-hover:flex flex-col absolute top-full right-0 bg-white shadow-md rounded-md m-2! w-40 z-50">
              <Link
                to="/myProfile"
                className=" hover:bg-gray-100 no-underline! m-2!"
              >
                My Profile
              </Link>
              <Link
                to="/settings"
                className=" hover:bg-gray-100  no-underline! m-2!"
              >
                Settings
              </Link>
              <Link
                to="/premium"
                className=" text-yellow-500 hover:bg-gray-100  no-underline! m-2!"
              >
                Go Premium
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-left hover:bg-gray-100 m-2!"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-200 px-4 pb-2">
          {navItems.map((item, i) => (
            <Link key={i} to={item.path} className="block p-2! bg-amber-200 text-sm"><span className='font-medium p-2!'>{item.text}</span>
              
            </Link>
          ))}
        </div>
      )}

    </nav>
  );
}
