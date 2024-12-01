import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Debug environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 [main] Environment check:');
console.log('SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
console.log('SUPABASE_KEY:', supabaseKey ? '✅' : '❌');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ [main] Missing environment variables!');
  throw new Error('Missing environment variables');
}

console.log('🔍 [main] Initializing application...');

const root = document.getElementById('root');
if (!root) {
  console.error('❌ [main] Root element not found!');
  throw new Error('Root element not found');
}

console.log('✅ [main] Root element found, creating React root...');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log('✅ [main] React application mounted');