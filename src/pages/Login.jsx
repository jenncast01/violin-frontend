import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const [username, setUsername] = useState("alice");
  const [password, setPassword] = useState("alice123");
  const [localError, setLocalError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!username.trim() || !password.trim()) {
      setLocalError("Por favor ingresa usuario y contraseña");
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      navigate("/");
    } else {
      setLocalError(result.error || "Credenciales incorrectas en LDAP");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🎻</div>
          <h2>Violin Journey</h2>
          <p className="login-subtitle">
            Acceso seguro mediante <strong>OpenLDAP</strong> & <strong>JWT</strong>
          </p>
        </div>

        {localError && (
          <div className="alert-error">
            <span>⚠️ {localError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario LDAP</label>
            <input
              id="username"
              type="text"
              placeholder="Ej. alice o bob"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Autenticando con LDAP..." : "🎵 Iniciar Sesión Musical"}
          </button>
        </form>

        <div className="demo-credentials">
          <div className="demo-title">💡 Usuarios válidos en el contenedor LDAP:</div>
          <div className="demo-users">
            <div className="demo-pill" onClick={() => { setUsername("alice"); setPassword("alice123"); }}>
              <code>alice</code> / <code>alice123</code>
            </div>
            <div className="demo-pill" onClick={() => { setUsername("bob"); setPassword("bob123"); }}>
              <code>bob</code> / <code>bob123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
