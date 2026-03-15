// Configuración de producción para Firebase + Render
export const environment = {
  production: true,
  apiUrl: 'https://login-backend-api.onrender.com/api/auth', // URL real de Render
  appName: 'Login System',
  version: '1.0.0',
  timeout: 5000,
  retryAttempts: 3
};
