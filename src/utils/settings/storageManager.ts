
// Load settings from localStorage
export function loadSettingsFromStorage() {
  try {
    const settings = localStorage.getItem('radioSettings');
    return settings ? JSON.parse(settings) : null;
  } catch (e) {
    console.error("Error parsing saved settings:", e);
    return null;
  }
}

// Save settings to localStorage
export function saveSettingsToStorage(settings) {
  try {
    const currentSettings = loadSettingsFromStorage();
    // Only update storage if settings have actually changed
    if (JSON.stringify(currentSettings) !== JSON.stringify(settings)) {
      localStorage.setItem('radioSettings', JSON.stringify(settings));
      return true; // Settings were updated
    }
    return false; // No changes to settings
  } catch (e) {
    console.error("Error saving settings:", e);
    return false;
  }
}

// Force a refresh of settings across the application
export function forceSettingsRefresh() {
  // Use a debounced approach to prevent multiple rapid updates
  // This helps prevent audio initialization loops
  if (window._settingsRefreshTimer) {
    clearTimeout(window._settingsRefreshTimer);
  }
  
  window._settingsRefreshTimer = setTimeout(() => {
    console.log("Broadcasting settings update event");
    // Create a custom event that components can listen for
    const event = new CustomEvent('settingsUpdated');
    document.dispatchEvent(event);
    
    // Also trigger a storage event which some components might be listening for
    // But use a different timer to ensure they don't collide
    setTimeout(() => {
      window.dispatchEvent(new Event('storage'));
    }, 100);
    
    window._settingsRefreshTimer = null;
  }, 300);
}
