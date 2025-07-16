
// Extend the Window interface to include our custom properties
interface Window {
  _settingsRefreshTimer: ReturnType<typeof setTimeout> | null;
  _isRefreshing: boolean;
}
