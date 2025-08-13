
import axios from 'axios';

// Supabase REST API configuration
const SUPABASE_URL = 'https://innpnyojhyedfrtnaxsi.supabase.co';
// Use the correct anon key for this project (public, safe to expose in client)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlubnBueW9qaHllZGZydG5heHNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjE4NjUsImV4cCI6MjA2OTUzNzg2NX0.DF3sGLr4JH7QmVmOcwODcyYmh5ZoRUxAcpWQG7eBasc';

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
