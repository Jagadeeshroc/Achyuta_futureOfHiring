// src/utils/dateFormat.js
export const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const groupMessagesByDate = (messages) =>
  messages.reduce((acc, msg) => {
    const key = formatDate(msg.createdAt);
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {});