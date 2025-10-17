// src/hooks/useSearch.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useSearch = (searchTerm) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setError(null);
    if (!searchTerm?.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/users/search?q=${encodeURIComponent(searchTerm)}`);
      setResults(data);
    } catch (err) {
      console.error('Search error:', err.response?.data);
      setError(err.response?.data?.error || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 200);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  return { results, loading, error };
};