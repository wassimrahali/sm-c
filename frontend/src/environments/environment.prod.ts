export const environment = {
  production: true,
  // When served from the frontend container via Nginx, use a relative path.
  // Nginx will proxy /api/* to the backend service.
  apiUrl: 'http://127.0.0.1:5000'
};
