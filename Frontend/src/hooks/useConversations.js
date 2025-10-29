// src/hooks/useConversations.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/conversations');
      const uniq = Array.from(new Map(data.map(c => [c._id, c])).values())
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setConversations(uniq);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      setError(err.response?.data?.error || 'Failed to load conversations');
      console.error('Conversations fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { conversations, setConversations, loading, error, refetch: fetch };
};