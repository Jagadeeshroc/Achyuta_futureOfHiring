import { useState, useEffect } from 'react';
import { FiBookmark, FiSearch, FiPlus, FiTrash2, FiEdit, FiFolder, FiTag } from 'react-icons/fi';
import './index.css';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', tags: '', folder: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFolder, setActiveFolder] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const initialBookmarks = [
      { id: 1, title: 'React Documentation', url: 'https://reactjs.org', tags: ['react', 'docs'], folder: 'Development' },
      { id: 2, title: 'CSS Tricks', url: 'https://css-tricks.com', tags: ['css', 'web'], folder: 'Design' },
      { id: 3, title: 'JavaScript Info', url: 'https://javascript.info', tags: ['javascript', 'docs'], folder: 'Development' },
    ];
    setBookmarks(initialBookmarks);
  }, []);

  const folders = ['All', ...new Set(bookmarks.map(b => b.folder))];

  const handleAddBookmark = () => {
    if (!newBookmark.title || !newBookmark.url) return;
    
    const tagsArray = newBookmark.tags.split(',').map(tag => tag.trim());
    
    const bookmark = {
      id: Date.now(),
      title: newBookmark.title,
      url: newBookmark.url,
      tags: tagsArray,
      folder: newBookmark.folder || 'Uncategorized'
    };
    
    setBookmarks([...bookmarks, bookmark]);
    setNewBookmark({ title: '', url: '', tags: '', folder: '' });
    setIsFormOpen(false);
  };

  const handleDeleteBookmark = (id) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const handleEditBookmark = (bookmark) => {
    setEditingId(bookmark.id);
    setNewBookmark({
      title: bookmark.title,
      url: bookmark.url,
      tags: bookmark.tags.join(', '),
      folder: bookmark.folder
    });
    setIsFormOpen(true);
  };

  const handleUpdateBookmark = () => {
    const tagsArray = newBookmark.tags.split(',').map(tag => tag.trim());
    
    setBookmarks(bookmarks.map(bookmark => 
      bookmark.id === editingId ? {
        ...bookmark,
        title: newBookmark.title,
        url: newBookmark.url,
        tags: tagsArray,
        folder: newBookmark.folder
      } : bookmark
    ));
    
    setEditingId(null);
    setNewBookmark({ title: '', url: '', tags: '', folder: '' });
    setIsFormOpen(false);
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         bookmark.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFolder = activeFolder === 'All' || bookmark.folder === activeFolder;
    
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="bookmarks-container">
      <div className="bookmarks-header">
        <h2>
          <FiBookmark className="bookmark-icon" /> My Bookmarks
        </h2>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="add-bookmark-btn"
        >
          <FiPlus /> Add Bookmark
        </button>
      </div>

      <div className="search-filter-container">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder=""
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="folder-filter-container">
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => setActiveFolder(folder)}
              className={`folder-filter-btn ${activeFolder === folder ? 'active' : ''}`}
            >
              <FiFolder /> {folder}
            </button>
          ))}
        </div>
      </div>

      {isFormOpen && (
        <div className="bookmark-form">
          <h3>{editingId ? 'Edit Bookmark' : 'Add New Bookmark'}</h3>
          <div className="form-grid">
            <div>
              <label>Title</label>
              <input
                type="text"
                value={newBookmark.title}
                onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
                placeholder="Bookmark title"
              />
            </div>
            <div>
              <label>URL</label>
              <input
                type="url"
                value={newBookmark.url}
                onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label>Tags (comma separated)</label>
              <input
                type="text"
                value={newBookmark.tags}
                onChange={(e) => setNewBookmark({...newBookmark, tags: e.target.value})}
                placeholder="react, docs, tutorial"
              />
            </div>
            <div>
              <label>Folder</label>
              <input
                type="text"
                value={newBookmark.folder}
                onChange={(e) => setNewBookmark({...newBookmark, folder: e.target.value})}
                placeholder="Development"
              />
            </div>
          </div>
          <div className="form-actions">
            <button
              onClick={() => {
                setIsFormOpen(false);
                setEditingId(null);
                setNewBookmark({ title: '', url: '', tags: '', folder: '' });
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              onClick={editingId ? handleUpdateBookmark : handleAddBookmark}
              className="submit-btn"
            >
              {editingId ? 'Update' : 'Add'} Bookmark
            </button>
          </div>
        </div>
      )}

      <div className="bookmarks-list">
        {filteredBookmarks.length === 0 ? (
          <div className="empty-state">
            No bookmarks found. Add some bookmarks to get started!
          </div>
        ) : (
          <ul>
            {filteredBookmarks.map(bookmark => (
              <li key={bookmark.id} className="bookmark-item">
                <div className="bookmark-content">
                  <div className="bookmark-title-container">
                    <a 
                      href={bookmark.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bookmark-link"
                    >
                      {bookmark.title}
                    </a>
                    <span className="bookmark-folder">
                      <FiFolder /> {bookmark.folder}
                    </span>
                  </div>
                  <div className="bookmark-url">{bookmark.url}</div>
                  <div className="bookmark-tags">
                    {bookmark.tags.map(tag => (
                      <span key={tag} className="bookmark-tag">
                        <FiTag /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bookmark-actions">
                  <button 
                    onClick={() => handleEditBookmark(bookmark)}
                    className="edit-btn"
                  >
                    <FiEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteBookmark(bookmark.id)}
                    className="delete-btn"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;