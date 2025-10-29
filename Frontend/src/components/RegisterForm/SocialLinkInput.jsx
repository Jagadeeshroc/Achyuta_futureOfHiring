import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX } from 'react-icons/fi';
import { FaLinkedin, FaGithub, FaTwitter, FaStackOverflow } from 'react-icons/fa';

const socialPlatforms = [
  { name: 'linkedin', icon: <FaLinkedin className="text-blue-600" /> },
  { name: 'github', icon: <FaGithub className="text-gray-800" /> },
  { name: 'twitter', icon: <FaTwitter className="text-blue-400" /> },
  { name: 'stackoverflow', icon: <FaStackOverflow className="text-orange-500" /> }
];

const SocialLinkInput = ({ socialLinks, setSocialLinks }) => {
  const [currentSocialLink, setCurrentSocialLink] = useState({ platform: '', url: '' });

  const handleSocialLinkAdd = () => {
    if (currentSocialLink.platform && currentSocialLink.url) {
      setSocialLinks({
        ...socialLinks,
        [currentSocialLink.platform]: currentSocialLink.url
      });
      setCurrentSocialLink({ platform: '', url: '' });
    }
  };

  const handleSocialLinkRemove = (platform) => {
    const newLinks = { ...socialLinks };
    delete newLinks[platform];
    setSocialLinks(newLinks);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1!">Social Links</label>
      <div className="space-y-3">
        <div className="flex space-x-2">
          <select
            value={currentSocialLink.platform}
            onChange={(e) => setCurrentSocialLink(prev => ({ ...prev, platform: e.target.value }))}
            className="flex-1 p-2! border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">Select platform</option>
            {socialPlatforms.map(platform => (
              <option key={platform.name} value={platform.name}>
                {platform.name.charAt(0).toUpperCase() + platform.name.slice(1)}
              </option>
            ))}
          </select>
          <input
            type="url"
            value={currentSocialLink.url}
            onChange={(e) => setCurrentSocialLink(prev => ({ ...prev, url: e.target.value }))}
            placeholder="Profile URL"
            className="flex-1 p-2! border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <button
            type="button"
            onClick={handleSocialLinkAdd}
            className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <FiPlus />
          </button>
        </div>

        <div className="flex flex-wrap p-3">
          {Object.entries(socialLinks).map(([platform, url]) => (
            <motion.div
              key={platform}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg"
            >
              <span className="mr-2">
                {socialPlatforms.find(p => p.name === platform)?.icon}
              </span>
              <span className="text-sm text-gray-700 truncate max-w-xs">{url}</span>
              <button
                type="button"
                onClick={() => handleSocialLinkRemove(platform)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiX size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialLinkInput;