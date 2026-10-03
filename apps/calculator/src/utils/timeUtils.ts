/**
 * Time Utilities
 * 
 * Helper functions for formatting timestamps and relative time strings.
 * Used throughout the calculator app for history, recent tools, etc.
 */

/**
 * Format timestamp to relative time string
 * Examples: "Just now", "5 minutes ago", "2 hours ago", "Yesterday", "3 days ago"
 * 
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Just now (< 1 minute)
  if (diffSeconds < 60) {
    return 'Just now';
  }

  // Minutes ago (< 1 hour)
  if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  }

  // Hours ago (< 24 hours)
  if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }

  // Yesterday
  if (diffDays === 1) {
    return 'Yesterday';
  }

  // Days ago (< 7 days)
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  // Weeks ago (< 30 days)
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }

  // Months ago (< 365 days)
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  // Years ago
  const years = Math.floor(diffDays / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
};

/**
 * Format timestamp to readable date string
 * Example: "Sep 12, 2026" or "12 Sep 2026, 2:30 PM"
 * 
 * @param timestamp - Unix timestamp in milliseconds
 * @param includeTime - Whether to include time in the output
 * @returns Formatted date string
 */
export const formatDate = (timestamp: number, includeTime: boolean = false): string => {
  const date = new Date(timestamp);
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  if (!includeTime) {
    return `${month} ${day}, ${year}`;
  }
  
  // Format time
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${day} ${month} ${year}, ${hours}:${minutesStr} ${ampm}`;
};

/**
 * Format timestamp to short date string
 * Example: "12/09/26" or "09/12/26" (based on locale)
 * 
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Short date string
 */
export const formatShortDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  
  // Using DD/MM/YY format (common in India)
  return `${day}/${month}/${year}`;
};

/**
 * Check if timestamp is today
 * 
 * @param timestamp - Unix timestamp in milliseconds
 * @returns True if timestamp is today
 */
export const isToday = (timestamp: number): boolean => {
  const date = new Date(timestamp);
  const today = new Date();
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if timestamp is yesterday
 * 
 * @param timestamp - Unix timestamp in milliseconds
 * @returns True if timestamp is yesterday
 */
export const isYesterday = (timestamp: number): boolean => {
  const date = new Date(timestamp);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Get current timestamp
 * 
 * @returns Current Unix timestamp in milliseconds
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * Format timestamp for calculator history display
 * Shows relative time for recent items, date for older items
 * 
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted string for display
 */
export const formatHistoryTime = (timestamp: number): string => {
  if (isToday(timestamp)) {
    return formatRelativeTime(timestamp);
  }
  
  if (isYesterday(timestamp)) {
    return 'Yesterday';
  }
  
  const diffDays = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  
  return formatDate(timestamp, false);
};
