import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Global fetch interceptor to catch 401 Unauthorized responses and clear stale tokens
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (response.status === 401) {
    console.warn('Unauthorized (401) response intercepted. Dispatching auth-unauthorized event.');
    window.dispatchEvent(new Event('auth-unauthorized'));
  }
  return response;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

