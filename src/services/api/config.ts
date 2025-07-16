
import axios from 'axios';

// Supabase REST API configuration
const SUPABASE_URL = 'https://yfkdcqgmyyrcxppxcswz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlma2RjcWdteXlyY3hwcHhjc3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTc0OTcsImV4cCI6MjA2ODIzMzQ5N30.dlEDNLZa6kLz_BCiGC1JJX83ceYTRRNc8mn1R70sOIw';

// Create axios instance for Supabase REST API
export const supabaseApi = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
});

// Add request interceptor for error handling
supabaseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
