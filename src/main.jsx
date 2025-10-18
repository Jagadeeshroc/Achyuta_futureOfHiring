// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import

import App from './App.jsx';
import { UserProvider } from './components/context/userContext.jsx';

const root = createRoot(document.getElementById('root')); // Create root
root.render(
  <UserProvider>
    
      <App />
  
  </UserProvider>
);