import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎻</span>
          <div className="brand-text">
            <span className="brand-title">Violin Journey</span>
            <span className="brand-subtitle">Diario de Práctica Musical</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            📊 Dashboard
          </Link>
          <Link
            to="/nueva-practica"
            className={`nav-link ${location.pathname === "/nueva-practica" ? "active" : ""}`}
          >
            ➕ Nueva Práctica
          </Link>
        </nav>

        <div className="navbar-user">
          <div className="user-badge" title={`JWT activo: ${token ? token.substring(0, 20) + '...' : 'Ninguno'}`}>
            <span className="user-avatar">🎵</span>
            <div className="user-meta">
              <span className="user-name">{user || "Músico"}</span>
              <span className="user-role">Autenticado vía LDAP</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout" title="Cerrar sesión">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};
