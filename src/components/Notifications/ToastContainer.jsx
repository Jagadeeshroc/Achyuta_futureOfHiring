// src/components/notifications/ToastContainer.jsx
import React from 'react';

import Toast from './Toast';
import { useNotifications } from '../context/NotificationContext';


const ToastContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  // Only show the latest 3 notifications as toasts
  const toastNotifications = notifications
    .filter(notif => notif.type === 'message') // Only show message toasts
    .slice(0, 3);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastNotifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;