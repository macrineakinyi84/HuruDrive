import React from 'react';
import { createRoot } from 'react-dom/client';
import InstagramIdeaGenerator from './pages/InstagramIdeaGenerator';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <InstagramIdeaGenerator />
  </React.StrictMode>,
);
