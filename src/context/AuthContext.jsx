import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const LDAP_LOGIN_URL = "http://localhost:8000/login";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("violin_jwt") || null);
  const [user, setUser] = useState(() => localStorage.getItem("violin_user") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Sesión cargada
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`%c🔐 [Auth] Autenticando usuario '${username}' contra LDAP...`, "color: #38bdf8; font-weight: bold;");
      const response = await axios.post(LDAP_LOGIN_URL, {
        username,
        password,
      });

      if (response.data && response.data.token) {
        const receivedToken = response.data.token;
        const loggedUser = response.data.username || username;

        setToken(receivedToken);
        setUser(loggedUser);
        localStorage.setItem("violin_jwt", receivedToken);
        localStorage.setItem("violin_user", loggedUser);

        console.log("%c✅ [Auth] Login LDAP exitoso!", "color: #10b981; font-weight: bold;");
        setLoading(false);
        return { success: true };
      } else {
        throw new Error("Respuesta inválida del servicio LDAP");
      }
    } catch (err) {
      console.error("❌ [Auth] Error en login LDAP:", err);
      const msg = err.response?.data?.detail || "Usuario o contraseña inválidos en LDAP";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    console.log("%c🚪 [Auth] Cerrando sesión y revocando JWT local", "color: #ef4444; font-weight: bold;");
    setToken(null);
    setUser(null);
    localStorage.removeItem("violin_jwt");
    localStorage.removeItem("violin_user");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
