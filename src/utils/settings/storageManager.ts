
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
  // Prevent multiple rapid calls by using a debounced approach
  if (window._settingsRefreshTimer) {
    clearTimeout(window._settingsRefreshTimer);
  }
  
  // Only refresh if we're not already in a refresh cycle
  if (window._isRefreshing) {
    console.log("Settings refresh already in progress, skipping");
    return;
  }
  
  window._isRefreshing = true;
  
  window._settingsRefreshTimer = setTimeout(() => {
    console.log("Broadcasting settings update event");
    // Create a custom event that components can listen for
    const event = new CustomEvent('settingsUpdated');
    document.dispatchEvent(event);
    
    // Clear the refresh flag after a delay to allow components to update
    setTimeout(() => {
      window._isRefreshing = false;
      window._settingsRefreshTimer = null;
    }, 1000);
  }, 300);
}
