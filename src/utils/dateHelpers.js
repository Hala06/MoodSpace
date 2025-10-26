// Date and time formatting utilities

export const formatDate = (isoString) => {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTimeAgo = (isoString) => {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(isoString);
};

export const formatTime = (isoString) => {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  });
};

export const formatDateTime = (isoString) => {
  if (!isoString) return '';
  
  return `${formatDate(isoString)} at ${formatTime(isoString)}`;
};

export const isToday = (isoString) => {
  if (!isoString) return false;
  
  const date = new Date(isoString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isThisWeek = (isoString) => {
  if (!isoString) return false;
  
  const date = new Date(isoString);
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return date > weekAgo;
};
