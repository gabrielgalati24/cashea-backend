// Polyfill para crypto.randomUUID() en versiones de Node.js anteriores a v19
import * as crypto from 'crypto';

// Verifica si randomUUID ya existe en el objeto global crypto
if (!crypto.randomUUID) {
  // Implementa randomUUID usando métodos disponibles en Node.js v18
  crypto.randomUUID = function randomUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

// Agrega crypto al objeto global si no existe
if (typeof global.crypto === 'undefined') {
  global.crypto = crypto as any;
} 