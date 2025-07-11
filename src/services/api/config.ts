
import axios from 'axios';

// Supabase REST API configuration
const SUPABASE_URL = 'https://xiwodvtyfnvbrrkqmond.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpd29kdnR5Zm52YnJya3Ftb25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzODMzMjIsImV4cCI6MjA2MTk1OTMyMn0.oPzNdPnYt4gKVM72yekgpmfYjbOwqdS9dcSixeMAu_g';

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
