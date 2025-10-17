// src/components/context/SocketContext.jsx
import React, { createContext, useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

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
    const newSocket = io('http://localhost:5000', { withCredentials: true, transports: ['websocket'] });
    newSocket.on('connect', () => newSocket.emit('joinUser', userId));
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [userId]);

  const memoizedSocket = useMemo(() => socket, [socket]);
  return <SocketContext.Provider value={memoizedSocket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => React.useContext(SocketContext);