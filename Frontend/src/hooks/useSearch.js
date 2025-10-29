// src/hooks/useSearch.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useSearch = (searchTerm, apiBaseUrl = 'http://localhost:5000') => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.defaults.baseURL = apiBaseUrl;
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to search users.');
          navigate('/login');
          return;
        }
        const res = await axios.get(`/api/users/search?query=${encodeURIComponent(searchTerm)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error searching users:', err);
        if (err.response?.status === 401) {
          setError('Unauthorized access. Please log in again.');
          navigate('/login');
        } else {
          setError('Failed to search users.');
        }
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, apiBaseUrl, navigate]);

  return { results, loading, error };
};