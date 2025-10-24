// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import
import './index.css';
// src/index.jsx or src/main.jsx
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import App from './App.jsx';
import { UserProvider } from './components/context/userContext.jsx';
import { SocketProvider } from './components/context/SocketContext.jsx';

const root = createRoot(document.getElementById('root')); // Create root
root.render(
  <React.StrictMode>
  <UserProvider>
      <SocketProvider>
         <App />
      </SocketProvider>
    
     
  
  </UserProvider>
  </React.StrictMode>
);