// FreelancingCard.jsx - CORRECTED VERSION
import React from "react";
import { useNavigate } from "react-router-dom"; // FIX: Import useNavigate hook
import { 
  FaBriefcase, 
  FaTools, 
  FaLaptopCode, 
  FaClock, 
  FaMapMarkerAlt, 
  FaMoneyBillAlt,
  FaCalendarAlt,
  FaUser,
  FaImage
} from "react-icons/fa";

// Enhanced utility function with category-based placeholders
const getImageUrl = (imagePath, category = 'general') => {
  if (!imagePath) return getPlaceholderImage(category);
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Extract filename from any path format
  let filename;
  if (imagePath.startsWith('file://') || imagePath.includes('uploads') || imagePath.includes('freelance')) {
    filename = imagePath.split('/').pop() || imagePath.split('\\').pop();
  } else if (imagePath.startsWith('/')) {
    filename = imagePath.split('/').pop();
  } else {
    filename = imagePath;
  }
  
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/freelance/${filename}`;
};

const getPlaceholderImage = (category = 'general') => {
  const placeholders = {
    job: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    service: 'https://images.unsplash.com/photo-1556655848-f3a79cc6d4a4?auto=format&fit=crop&w=500&q=80',
    'part-time': 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=500&q=80',
    'private-work': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=500&q=80',
    general: 'https://images.unsplash.com/photo-1556655848-f3a79cc6d4a4?auto=format&fit=crop&w=500&q=80'
  };
  
  return placeholders[category] || placeholders.general;
};

const FreelancingCard = ({ post }) => {
  const navigate = useNavigate(); // FIX: Use the hook to get navigate function
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleCardClick = () => {
    navigate(`/freelance/post/${post._id}`);
  };

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'job': return <FaBriefcase className="text-blue-600" />;
      case 'service': return <FaLaptopCode className="text-green-600" />;
      case 'part-time': return <FaClock className="text-orange-600" />;
      case 'private-work': return <FaTools className="text-purple-600" />;
      default: return <FaBriefcase className="text-gray-600" />;
    }
  };

  const getCategoryColor = (type) => {
    switch (type) {
      case 'job': return 'bg-blue-100 text-blue-800';
      case 'service': return 'bg-green-100 text-green-800';
      case 'part-time': return 'bg-orange-100 text-orange-800';
      case 'private-work': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCategory = (type) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleImageError = (e) => {
    console.log('🖼️ Using placeholder for missing image');
    setImageError(true);
    // Don't hide the image - replace with placeholder
    e.target.src = getPlaceholderImage(post.type);
    e.target.onerror = null; // Prevent infinite loop
  };

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully');
    setImageLoaded(true);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer  p-3!"
      onClick={handleCardClick}
    >
      {/* Image Section with Smart Fallback */}
      <div className="relative h-48 bg-gray-100 overflow-hidden p-1!">
        {post.attachments && post.attachments.length > 0 && !imageError ? (
          <>
            <img
              src={getImageUrl(post.attachments[0], post.type)}
              alt={post.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            )}
          </>
        ) : (
          // Show placeholder when no attachments or image failed
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-500">
              <FaImage className="text-4xl mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No image available</p>
              <p className="text-xs mt-1 opacity-70">{formatCategory(post.type)}</p>
            </div>
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.type)}`}>
            {formatCategory(post.type)}
          </span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="">
        <div className="flex items-start justify-between m-2!">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1 m-1!">
            {post.title}
          </h3>
          <div className="m-2! text-lg">
            {getCategoryIcon(post.type)}
          </div>
        </div>

        <p className="text-gray-600 text-sm  line-clamp-3 m-1!">
          {post.description}
        </p>

        {/* Skills */}
        {post.skills && post.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {post.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="p-2! bg-indigo-50 text-indigo-700 text-xs rounded-md"
                >
                  {skill}
                </span>
              ))}
              {post.skills.length > 3 && (
                <span className="p-2! bg-gray-100 text-gray-600 text-xs rounded-md">
                  +{post.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 p-2!">
          {/* Price/Budget */}
          {(post.budget || post.price) && (
            <div className="flex items-center gap-2">
              <FaMoneyBillAlt className="text-green-600" />
              <span className="font-semibold">
                ${post.budget || post.price}
              </span>
            </div>
          )}

          {/* Location */}
          {post.location && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-600" />
              <span>{post.location}</span>
            </div>
          )}

          {/* Duration */}
          {post.duration && (
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-600" />
              <span>{post.duration}</span>
            </div>
          )}

          {/* Delivery Time */}
          {post.deliveryTime && (
            <div className="flex items-center gap-2">
              <FaClock className="text-orange-600" />
              <span>{post.deliveryTime}</span>
            </div>
          )}
        </div>

        {/* User Info */}
        {post.user && (
          <div className=" pt-3! border-t border-gray-200 flex items-center gap-3">
            {post.user.avatar ? (
              <img
                src={getImageUrl(post.user.avatar)}
                alt={post.user.name}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&background=indigo&color=fff`;
                }}
              />
            ) : (
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-xs" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {post.user.name || post.user.username}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {/* Multiple Attachments Indicator */}
        {post.attachments && post.attachments.length > 1 && (
          <div className="mt-3 text-xs text-gray-500">
            +{post.attachments.length - 1} more attachment{post.attachments.length > 2 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancingCard;