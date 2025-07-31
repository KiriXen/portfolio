export const safeLocalStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = localStorage.getItem(key);
        if (item === null || item === 'undefined' || item === 'default') {
          return null;
        }
        return item;
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    return null;
  },

  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
        return true;
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
    return false;
  },

  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
        return true;
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
    return false;
  },

  parseJSON: (jsonString, fallback = null) => {
    try {
      if (!jsonString || jsonString === 'undefined' || jsonString === 'default') {
        return fallback;
      }
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('Error parsing JSON:', error);
      return fallback;
    }
  },

  setJSON: (key, obj) => {
    try {
      const jsonString = JSON.stringify(obj);
      return safeLocalStorage.setItem(key, jsonString);
    } catch (error) {
      console.warn(`Error stringifying object for key "${key}":`, error);
      return false;
    }
  },

  getJSON: (key, fallback = null) => {
    const item = safeLocalStorage.getItem(key);
    return safeLocalStorage.parseJSON(item, fallback);
  }
};

export default safeLocalStorage;
