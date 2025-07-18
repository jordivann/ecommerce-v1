import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';       // ← asegúrate de que exista ESTE archivo

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);