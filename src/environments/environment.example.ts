// Configuración de entorno del frontend
// Desarrollar: Copiar a environment.ts
// Producción: Copiar a environment.prod.ts

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/auth',
  appName: 'Login System',
  version: '1.0.0',
  timeout: 5000,
  retryAttempts: 3
};
