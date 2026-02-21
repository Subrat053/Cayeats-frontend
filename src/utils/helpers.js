// Date & Time Helpers
export const getDayName = (date = new Date()) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

export const formatTime = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const isRestaurantOpen = (hours) => {
  if (!hours) return false;
  
  const now = new Date();
  const dayName = getDayName(now).toLowerCase();
  const todayHours = hours[dayName];
  
  if (!todayHours || todayHours.closed) return false;
  
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMin] = todayHours.open.split(':').map(Number);
  const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
  
  const openTime = openHour * 60 + openMin;
  let closeTime = closeHour * 60 + closeMin;
  
  // Handle closing time past midnight (e.g., closes at 00:00 or 01:00)
  if (closeTime <= openTime) {
    closeTime += 24 * 60;
    if (currentTime < openTime) {
      return currentTime + 24 * 60 >= openTime && currentTime + 24 * 60 <= closeTime;
    }
  }
  
  return currentTime >= openTime && currentTime <= closeTime;
};

export const getOpenStatus = (hours) => {
  if (!hours) return { isOpen: false, message: 'Hours not available' };
  
  const isOpen = isRestaurantOpen(hours);
  const now = new Date();
  const dayName = getDayName(now).toLowerCase();
  const todayHours = hours[dayName];
  
  if (!todayHours || todayHours.closed) {
    return { isOpen: false, message: 'Closed today' };
  }
  
  if (isOpen) {
    return { 
      isOpen: true, 
      message: `Open until ${formatTime(todayHours.close)}` 
    };
  }
  
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMin] = todayHours.open.split(':').map(Number);
  const openTime = openHour * 60 + openMin;
  
  if (currentTime < openTime) {
    return { 
      isOpen: false, 
      message: `Opens at ${formatTime(todayHours.open)}` 
    };
  }
  
  return { isOpen: false, message: 'Closed' };
};

// String Helpers
export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

export const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const truncate = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

// Currency Helpers
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Array Helpers
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
};

export const sortByKey = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Filter Helpers
export const filterRestaurants = (restaurants, filters) => {
  return restaurants.filter(restaurant => {
    // Search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const matchesName = restaurant.name.toLowerCase().includes(query);
      const matchesCuisine = restaurant.cuisines.some(c => c.toLowerCase().includes(query));
      if (!matchesName && !matchesCuisine) return false;
    }
    
    // Cuisine filter
    if (filters.cuisine && !restaurant.cuisines.includes(filters.cuisine)) {
      return false;
    }
    
    // Delivery provider filter
    if (filters.deliveryProvider) {
      const provider = restaurant.deliveryProviders[filters.deliveryProvider];
      if (!provider?.enabled || !provider?.url) return false;
    }
    
    // Open now filter
    if (filters.openNow && !isRestaurantOpen(restaurant.hours)) {
      return false;
    }
    
    // Pickup filter
    if (filters.hasPickup && !restaurant.hasPickup) {
      return false;
    }
    
    // Dine-in filter
    if (filters.hasDineIn && !restaurant.hasDineIn) {
      return false;
    }
    
    return true;
  });
};

// Validation Helpers
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPhone = (phone) => {
  const re = /^\+?[\d\s-()]{10,}$/;
  return re.test(phone);
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Local Storage Helpers
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};
