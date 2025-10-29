// src/contexts/SocketContext.js
import React, { createContext, useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  // Sync userId if changed in another tab
  useEffect(() => {
    const syncUserId = () => setUserId(localStorage.getItem('userId'));
    window.addEventListener('storage', syncUserId);
    return () => window.removeEventListener('storage', syncUserId);
  }, []);

  useEffect(() => {
    if (!userId) {
      setSocket(null);
      return;
    }

    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket'],
      query: { userId }, // optional, but useful
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit('joinUser', userId);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [userId]);

  // Memoize socket instance for stable reference
  const memoizedSocket = useMemo(() => socket, [socket]);

  return (
    <SocketContext.Provider value={memoizedSocket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => React.useContext(SocketContext);
