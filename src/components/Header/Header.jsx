import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiX, FiClock, FiUser, FiBell, FiMessageSquare, FiMenu, FiHash } from 'react-icons/fi';
import { FaHome, FaSuitcase, FaUserFriends, FaRegBuilding, FaRegComments } from 'react-icons/fa';
import { TbCircleLetterF } from 'react-icons/tb';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function JobbyNavbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResults, setSearchResults] = useState({ users: [], jobs: [], topics: [], companies: [], groups: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [messagesCount, setMessagesCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/home", icon: <FaHome className="text-lime-950"/>, text: "Home" },
    { path: "/jobs", icon: <FaSuitcase className="text-lime-950"  />, text: "Jobs" },
    { path: "/myNetworks", icon: <FaUserFriends className="text-lime-950" />, text: "Network" },
    { path: "/freelance", icon: <TbCircleLetterF className="text-lime-950" />, text: "Freelance" },
  ];

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSearchResults = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults({ users: [], jobs: [], topics: [], companies: [], groups: [] });
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get('/api/search', { params: { q: query } });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback(debounce((query) => fetchSearchResults(query), 300), [fetchSearchResults]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    const updateUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setCurrentUser({ ...parsedUser, _id: parsedUser._id || parsedUser.id });
      } else {
        setCurrentUser(null);
      }
    };
    updateUser();
    window.addEventListener('storage', updateUser);
    return () => window.removeEventListener('storage', updateUser);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const updatedSearches = [searchTerm, ...recentSearches.filter(item => item !== searchTerm).slice(0, 4)];
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      performSearch(searchTerm);
    }
  };

  const performSearch = (term) => {
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleSuggestionClick = (item, type) => {
    setSearchTerm(item.name || item.title || item);
    setShowSuggestions(false);
    if (type && item.id) {
      switch (type) {
        case 'user': navigate(`/profile/${item.id}`); break;
        case 'job': navigate(`/jobs/${item.id}`); break;
        case 'topic': navigate(`/topics/${item.slug}`); break;
        default: navigate(`/search?q=${encodeURIComponent(item.name || item.title || item)}`);
      }
    } else {
      performSearch(item.name || item.title || item);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/home" className="flex items-center space-x-2">
          <img src="/images/WhatsApp Image 2025-04-18 at 14.56.02_34b122d5.jpg" alt="Logo" className="w-14 h-14 rounded-full hover:scale-120" />
          <span className="hidden lg:block font-semibold text-lg">Achyuta</span>
        </Link>

        <div className="flex items-center gap-4">
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <FiMenu size={24} />
          </button>

          <Link to="/messages" className="relative">
            <FiMessageSquare size={20} />
            {messagesCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">{messagesCount}</span>
            )}
          </Link>

          <Link to="/notifications" className="relative">
            <FiBell size={20} />
            {notificationsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">{notificationsCount}</span>
            )}
          </Link>

          <div className="relative group">
            <img src={ currentUser?.avatar ? currentUser.avatar.startsWith('http') ? currentUser.avatar : `http://localhost:5000${currentUser.avatar.replace(/^\/Uploads/, '/uploads')}` : "images/pexels-njeromin-12149149.jpg" } alt="User" className="rounded-full h-12 w-12" onError={e => { e.target.onerror = null; e.target.src = "images/pexels-njeromin-12149149.jpg"; }} />

            <div className="hidden group-hover:flex flex-col absolute top-full right-0 bg-white shadow-md rounded-md mt-2 py-2 w-40 z-50">
              <Link to="/myProfile" className="px-4 py-2 hover:bg-gray-100">My Profile</Link>
              <Link to="/settings" className="px-4 py-2 hover:bg-gray-100">Settings</Link>
              <Link to="/premium" className="px-4 py-2 text-yellow-500 hover:bg-gray-100">Go Premium</Link>
              <button onClick={handleLogout} className="px-4 py-2 text-left hover:bg-gray-100">Logout</button>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-2">
          {navItems.map((item, i) => (
            <Link key={i} to={item.path} className="block py-2 text-sm">
              {item.text}
            </Link>
          ))}
        </div>
      )}

      <div className="hidden md:flex justify-center gap-6 py-2 border-t">
        {navItems.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={`relative flex flex-col items-center group px-3 py-2 text-sm ${location.pathname === item.path ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
          >
            <div className="text-2xl">{item.icon}</div>
            <span className="absolute bottom-[-1.5rem] scale-0 group-hover:scale-100 transition-transform bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {item.text}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}