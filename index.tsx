import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Critical Application Crash:", error);
  // Fallback UI if React crashes entirely
  rootElement.innerHTML = `
    <div style="color: white; font-family: sans-serif; text-align: center; padding: 40px;">
      <h1>System Failure</h1>
      <p>Nexus AI failed to initialize. Please reload the page.</p>
      <pre style="text-align: left; background: #333; padding: 20px; border-radius: 8px; overflow: auto; margin-top: 20px;">${error}</pre>
    </div>
  `;
}