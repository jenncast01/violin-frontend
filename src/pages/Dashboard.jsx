import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export const Dashboard = () => {
  const { token, user } = useAuth();
  const [practices, setPractices] = useState([]);
  const [stats, setStats] = useState({
    level: "Principiante ⭐",
    total_hours: 45.0,
    streak_days: 12,
    songs_learned: 8,
    total_sessions: 4,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Mostrar JWT de forma destacada en la consola como pide la consigna
    console.log(
      "%c🎻 [Violin Journey] Accediendo a la Landing Page / Dashboard",
      "background: #1e293b; color: #10b981; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;"
    );
    console.log(
      "%c🔑 [JWT Almacenado en Context / localStorage]:",
      "background: #312e81; color: #fbbf24; font-weight: bold; padding: 2px 6px; border-radius: 3px;",
      token
    );

    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Peticiones protegidas al Backend (puerto 5000)
      const [practicesRes, statsRes] = await Promise.all([
        api.get("/api/practices"),
        api.get("/api/stats"),
      ]);

      setPractices(practicesRes.data);
      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error("Error al cargar datos del backend:", err);
      setError("No se pudo conectar con el backend de prácticas (puerto 5000).");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyStars = (difficulty) => {
    return "⭐".repeat(Math.max(1, Math.min(5, difficulty)));
  };

  const getTechniqueBadgeClass = (technique) => {
    const t = technique.toLowerCase();
    if (t.includes("escala")) return "badge-technique-scale";
    if (t.includes("arco")) return "badge-technique-bow";
    if (t.includes("afina")) return "badge-technique-tuning";
    if (t.includes("canci")) return "badge-technique-song";
    return "badge-technique-general";
  };

  return (
    <div className="dashboard-page">
      {/* Header del Dashboard con Bienvenida y Botón de Acción */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            ¡Hola, <span className="highlight-name">{user}</span>! 🎻
          </h1>
          <p className="dashboard-desc">
            Bienvenido a tu registro diario. La constancia es el secreto para dominar el violín.
          </p>
        </div>

        <Link to="/nueva-practica" className="btn-primary btn-add-practice">
          <span>➕</span> Registrar Nueva Práctica
        </Link>
      </div>

      {/* Banner Informativo de Token JWT */}
      <div className="jwt-status-banner">
        <div className="jwt-status-icon">🔐</div>
        <div className="jwt-status-info">
          <span className="jwt-status-title">Sesión Segura Activa (JWT Bearer Token):</span>
          <code className="jwt-preview">{token ? `${token.substring(0, 48)}...` : "Sin token"}</code>
        </div>
        <span className="jwt-hint">Revisa la Consola Web (F12) para ver el token completo</span>
      </div>

      {/* Tarjetas de Progreso (Mi Progreso) */}
      <section className="stats-section">
        <h2 className="section-title">📊 Mi Progreso</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎻</div>
            <div className="stat-data">
              <span className="stat-label">Nivel actual</span>
              <span className="stat-value">{stats.level || "Principiante ⭐"}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-data">
              <span className="stat-label">Tiempo practicado</span>
              <span className="stat-value">{stats.total_hours} hrs</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-data">
              <span className="stat-label">Días consecutivos</span>
              <span className="stat-value">{stats.streak_days} días de racha</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎵</div>
            <div className="stat-data">
              <span className="stat-label">Canciones aprendidas</span>
              <span className="stat-value">{stats.songs_learned} piezas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal en dos columnas */}
      <div className="dashboard-content-layout">
        {/* Columna Izquierda: Listado de Últimas Prácticas */}
        <section className="practices-section">
          <div className="section-header-row">
            <h2 className="section-title">📝 Últimas Prácticas Registradas</h2>
            <span className="practice-count-badge">
              {practices.length} sesiones registradas
            </span>
          </div>

          {loading ? (
            <div className="loading-card">
              <div className="spinner"></div>
              <p>Cargando diario de práctica musical...</p>
            </div>
          ) : error ? (
            <div className="alert-error">
              <span>⚠️ {error}</span>
            </div>
          ) : practices.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🎼</span>
              <h3>No hay prácticas registradas aún</h3>
              <p>¡Toma tu arco y registra tu primera práctica musical!</p>
              <Link to="/nueva-practica" className="btn-secondary">
                Registrar Práctica Ahora
              </Link>
            </div>
          ) : (
            <div className="practices-list">
              {practices.map((item) => (
                <div key={item.id} className="practice-card">
                  <div className="practice-card-header">
                    <div className="practice-title-group">
                      <span className="practice-piece-icon">🎼</span>
                      <h3 className="practice-title">{item.title}</h3>
                    </div>
                    <span className="practice-date">📅 {item.date}</span>
                  </div>

                  <div className="practice-meta-row">
                    <div className="meta-item">
                      <span className="meta-icon">⏳</span>
                      <span className="meta-text">{item.duration_minutes} min</span>
                    </div>

                    <div className="meta-item">
                      <span className="meta-icon">🛠️</span>
                      <span className={`badge-technique ${getTechniqueBadgeClass(item.technique)}`}>
                        {item.technique}
                      </span>
                    </div>

                    <div className="meta-item">
                      <span className="meta-icon">Dificultad:</span>
                      <span className="difficulty-stars" title={`Dificultad: ${item.difficulty}/5`}>
                        {getDifficultyStars(item.difficulty)}
                      </span>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="practice-notes">
                      <span className="notes-label">Notas personales:</span>
                      <p className="notes-text">"{item.notes}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Columna Derecha: Repertorio Actual & Metas */}
        <aside className="dashboard-sidebar">
          {/* Widget Canciones Actuales */}
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">🎵 Canciones Actuales</h3>
            <ul className="repertoire-list">
              {[
                { title: "You Are My Hiding Place 🎵", tag: "En Repertorio", statusClass: "status-mastered" },
                { title: "How Great Thou Art 🎻", tag: "En Progreso", statusClass: "status-progress" },
                { title: "The Prayer (Andrea Bocelli) 🎼", tag: "Aprendiendo", statusClass: "status-new" },
                { title: "Oceans (Where Feet May Fail) 🌊", tag: "En Progreso", statusClass: "status-progress" },
                { title: "Yeshua 🕊️", tag: "Dominada", statusClass: "status-mastered" },
                { title: "Essential Elements - Lección 14 📖", tag: "Calentamiento", statusClass: "status-routine" },
              ].map((song) => (
                <li key={song.title} className="repertoire-item">
                  <div className="song-info">
                    <div className="song-title-group">
                      <span className="song-title">{song.title}</span>
                      <span className={`song-tag ${song.statusClass}`}>{song.tag}</span>
                    </div>
                    <Link
                      to={`/nueva-practica?song=${encodeURIComponent(song.title)}`}
                      className="btn-practice-song"
                      title={`Registrar práctica de ${song.title}`}
                    >
                      ➕ Practicar
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Widget Metas Musicales */}
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">🎯 Objetivos del Mes</h3>
            <div className="goal-item">
              <div className="goal-header">
                <span>Practicar 5 días por semana</span>
                <span className="goal-pct">80%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: "80%" }}></div>
              </div>
            </div>

            <div className="goal-item">
              <div className="goal-header">
                <span>Arco recto en cuerdas La y Mi</span>
                <span className="goal-pct">65%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: "65%" }}></div>
              </div>
            </div>

            <div className="goal-item">
              <div className="goal-header">
                <span>Memorizar lección 14 completa</span>
                <span className="goal-pct">100% ✅</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill completed" style={{ width: "100%" }}></div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
