import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { brand } from './brand';

// Global styles
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Prata&display=swap');

  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    background: ${brand.colors.base};
    min-height: 100vh;
    color: ${brand.colors.textPrimary};
    font-family: ${brand.fonts.body};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    min-height: 100vh;
  }

  ::selection {
    background: ${brand.colors.rust};
    color: ${brand.colors.white};
  }

  input::placeholder {
    color: ${brand.colors.textMuted};
  }

  input:focus {
    border-color: ${brand.colors.rust} !important;
    box-shadow: 0 0 0 3px rgba(200, 66, 42, 0.1);
  }

  button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(200, 66, 42, 0.2);
  }

  button:active:not(:disabled) {
    transform: translateY(0);
  }

  a {
    color: ${brand.colors.rust};
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  a:hover {
    opacity: 0.8;
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
