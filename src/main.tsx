// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa createRoot
import App from './App';
import './index.css';

// Selecciona el contenedor donde se renderizará la aplicación
const container = document.getElementById('root');

if (container) {
  // Crea una raíz para la aplicación
  const root = createRoot(container);

  // Renderiza la aplicación dentro de la raíz
  root.render(<App />);
} else {
  console.error('No se encontró el elemento con id "root"');
}