import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global styles
const globalStyles = `
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    background: #0a0a0a;
    min-height: 100vh;
    color: #fff;
  }
  
  #root {
    min-height: 100vh;
  }

  ::selection {
    background: #e94560;
    color: #fff;
  }

  input::placeholder {
    color: rgba(255,255,255,0.4);
  }

  a {
    color: #e94560;
  }

  a:hover {
    color: #ff6b6b;
  }
`;

// Inject global styles
const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
