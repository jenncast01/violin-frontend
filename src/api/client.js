import axios from "axios";

const BACKEND_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: BACKEND_URL,
});

// Interceptor de Peticiones: inyecta el JWT Bearer Token y emite console.log
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("violin_jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        `%c📡 [Axios Request] %c${config.method.toUpperCase()} ${config.url}`,
        "color: #38bdf8; font-weight: bold;",
        "color: #f1f5f9; font-weight: normal;"
      );
    } else {
      console.warn("⚠️ [Axios Request] No se encontró JWT en localStorage.");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuestas: muestra confirmación y manejo de errores 401
api.interceptors.response.use(
  (response) => {
    console.log(
      `%c📥 [Axios Response] %cStatus: ${response.status} from ${response.config.url}`,
      "color: #10b981; font-weight: bold;",
      "color: #94a3b8;"
    );
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("❌ [Axios Response 401] Token no válido o expirado.");
    }
    return Promise.reject(error);
  }
);

export default api;
