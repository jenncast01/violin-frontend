import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

// Opciones de canciones de repertorio musical
export const REPERTOIRE_OPTIONS = [
  {
    title: "You Are My Hiding Place 🎵",
    technique: "Afinación y Arco",
    difficulty: 3,
    suggestedNotes: "Trabajé el puente y las notas agudas en cuerda Mi con arco suave.",
  },
  {
    title: "How Great Thou Art 🎻",
    technique: "Técnica de Arco (Bow Control)",
    difficulty: 3,
    suggestedNotes: "Control de dinámicas y manteniendo el arco recto paralelo al puente.",
  },
  {
    title: "The Prayer (Andrea Bocelli) 🎼",
    technique: "Canción Completa y Expresión",
    difficulty: 4,
    suggestedNotes: "Digitación en primera posición y cambios de cuerda suaves y expresivos.",
  },
  {
    title: "Oceans (Where Feet May Fail) 🌊",
    technique: "Lectura y Solfeo",
    difficulty: 3,
    suggestedNotes: "Enfoque en los coros, tempo constante y afinación con metrónomo.",
  },
  {
    title: "Yeshua 🕊️",
    technique: "Afinación y Arco",
    difficulty: 2,
    suggestedNotes: "Memoria muscular, sonido limpio y sostenido en cuerdas La y Re.",
  },
  {
    title: "Essential Elements - Lección 14 📖",
    technique: "Escalas y Afinación",
    difficulty: 2,
    suggestedNotes: "Escalas de Re Mayor y arpegios con metrónomo a 65 bpm.",
  },
  {
    title: "Canon en Re (Pachelbel) 🎻",
    technique: "Canción Completa y Expresión",
    difficulty: 4,
    suggestedNotes: "Postura de la mano izquierda, cuidando mantener el pulgar relajado.",
  },
  {
    title: "Estudio de Cuerdas al Aire 🎼",
    technique: "Cuerdas al Aire (Sonido Puro)",
    difficulty: 1,
    suggestedNotes: "Enfoque en peso del brazo y arco perpendicular al puente.",
  },
];

export const NewPractice = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const todayStr = new Date().toISOString().split("T")[0];
  const preselectedSong = searchParams.get("song");

  const [formData, setFormData] = useState({
    date: todayStr,
    duration_minutes: 45,
    title: preselectedSong || "You Are My Hiding Place 🎵",
    technique: "Afinación y Arco",
    difficulty: 3,
    notes: "Trabajé el puente y las notas agudas en cuerda Mi con arco suave.",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Si viene con un parámetro ?song= en la URL, aplicamos la configuración de esa canción
  useEffect(() => {
    if (preselectedSong) {
      applySongPreset(preselectedSong);
    }
  }, [preselectedSong]);

  const applySongPreset = (songTitle) => {
    const matched = REPERTOIRE_OPTIONS.find((s) => s.title === songTitle);
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        title: matched.title,
        technique: matched.technique,
        difficulty: matched.difficulty,
        notes: matched.suggestedNotes,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        title: songTitle,
      }));
    }
  };

  const handleDropdownChange = (e) => {
    const selected = e.target.value;
    if (selected === "__custom__") {
      setFormData((prev) => ({ ...prev, title: "" }));
    } else if (selected) {
      applySongPreset(selected);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration_minutes" || name === "difficulty" ? parseInt(value, 10) : value,
    }));
  };

  const handleDifficultyClick = (rating) => {
    setFormData((prev) => ({ ...prev, difficulty: rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Por favor selecciona o escribe la canción que practicaste.");
      return;
    }

    setLoading(true);

    // 1. Mostrar de forma clara el JWT en consola al agregar información (requisito de la práctica)
    console.log(
      "%c➕ [Nueva Práctica] Registrando sesión en el Backend...",
      "background: #1e1b4b; color: #c084fc; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;"
    );
    console.log(
      "%c🔑 [JWT Bearer Token Usado en la Petición]:",
      "background: #78350f; color: #fde68a; font-weight: bold; padding: 2px 6px; border-radius: 3px;",
      token
    );
    console.log("📦 Datos enviados:", formData);

    try {
      await api.post("/api/practices", formData);
      console.log("%c✅ [Nueva Práctica] Guardada con éxito en la base de datos!", "color: #10b981; font-weight: bold;");
      navigate("/");
    } catch (err) {
      console.error("Error al registrar la práctica:", err);
      setError(
        err.response?.data?.detail || "Error al conectar con el backend para guardar la práctica."
      );
      setLoading(false);
    }
  };

  return (
    <div className="new-practice-page">
      <div className="new-practice-container">
        {/* Cabecera y Enlace de Retorno */}
        <div className="form-header-nav">
          <Link to="/" className="btn-back">
            ← Volver al Dashboard
          </Link>
          <span className="form-step-tag">Registro de Sesión</span>
        </div>

        <div className="form-card">
          <div className="form-card-title-group">
            <span className="card-icon">🎻</span>
            <div>
              <h1 className="form-card-title">Registrar Nueva Práctica</h1>
              <p className="form-card-subtitle">
                Selecciona una canción de tu repertorio o anota tu ejercicio de hoy.
              </p>
            </div>
          </div>

          {error && (
            <div className="alert-error">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="practice-form">
            <div className="form-row-2">
              {/* Campo: Fecha */}
              <div className="form-group">
                <label htmlFor="date">📅 Fecha de Práctica</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Campo: Duración en minutos */}
              <div className="form-group">
                <label htmlFor="duration_minutes">⏱️ Tiempo Practicado</label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    id="duration_minutes"
                    name="duration_minutes"
                    min="1"
                    max="600"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    required
                  />
                  <span className="suffix">minutos</span>
                </div>
              </div>
            </div>

            {/* Selector de Canción del Repertorio */}
            <div className="form-group">
              <label htmlFor="repertoire_select">🎵 Seleccionar Canción de tu Repertorio</label>
              <select
                id="repertoire_select"
                onChange={handleDropdownChange}
                value={
                  REPERTOIRE_OPTIONS.some((r) => r.title === formData.title)
                    ? formData.title
                    : "__custom__"
                }
              >
                <optgroup label="✨ Repertorio Recomendado">
                  {REPERTOIRE_OPTIONS.map((song) => (
                    <option key={song.title} value={song.title}>
                      {song.title}
                    </option>
                  ))}
                </optgroup>
                <option value="__custom__">✍️ Otra canción o ejercicio personalizado...</option>
              </select>

              {/* Chips de selección rápida de 1-clic */}
              <div className="quick-chips-container">
                <span className="chips-label">Atajos rápidos:</span>
                <div className="chips-list">
                  {REPERTOIRE_OPTIONS.slice(0, 5).map((song) => (
                    <button
                      key={song.title}
                      type="button"
                      className={`chip-btn ${formData.title === song.title ? "active" : ""}`}
                      onClick={() => applySongPreset(song.title)}
                    >
                      {song.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Campo: Nombre de Canción / Ejercicio (Editable) */}
            <div className="form-group">
              <label htmlFor="title">🎼 Título de la Pieza o Ejercicio</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Ej. You Are My Hiding Place 🎵, How Great Thou Art 🎻..."
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Campo: Técnica Trabajada */}
            <div className="form-group">
              <label htmlFor="technique">🛠️ Técnica Trabajada</label>
              <select
                id="technique"
                name="technique"
                value={formData.technique}
                onChange={handleChange}
                required
              >
                <option value="Afinación y Arco">Afinación y Arco</option>
                <option value="Técnica de Arco (Bow Control)">Técnica de Arco (Bow Control)</option>
                <option value="Canción Completa y Expresión">Canción Completa y Expresión</option>
                <option value="Lectura y Solfeo">Lectura y Solfeo</option>
                <option value="Escalas y Afinación">Escalas y Afinación</option>
                <option value="Cambios de Cuerda y Postura">Cambios de Cuerda y Postura</option>
                <option value="Cuerdas al Aire (Sonido Puro)">Cuerdas al Aire (Sonido Puro)</option>
              </select>
            </div>

            {/* Campo: Dificultad (1 a 5 estrellas) */}
            <div className="form-group">
              <label>⭐ Nivel de Dificultad Percibida ({formData.difficulty}/5)</label>
              <div className="star-rating-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= formData.difficulty ? "active" : ""}`}
                    onClick={() => handleDifficultyClick(star)}
                    title={`Dificultad: ${star} de 5`}
                  >
                    ★
                  </button>
                ))}
                <span className="difficulty-hint">
                  {formData.difficulty === 1 && "Muy fluido y sencillo"}
                  {formData.difficulty === 2 && "Cómodo con pequeños detalles"}
                  {formData.difficulty === 3 && "Moderado, requirió concentración"}
                  {formData.difficulty === 4 && "Desafiante, buen esfuerzo"}
                  {formData.difficulty === 5 && "Muy complejo, a seguir puliendo"}
                </span>
              </div>
            </div>

            {/* Campo: Notas Personales */}
            <div className="form-group">
              <label htmlFor="notes">📝 Notas Personales y Sensaciones</label>
              <textarea
                id="notes"
                name="notes"
                rows="4"
                placeholder="Ejemplo: Hoy trabajé cambios de cuerda. Me costó mantener el arco recto pero el sonido mejoró hacia el final."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Botones de Envío y Cancelación */}
            <div className="form-actions">
              <Link to="/" className="btn-secondary">
                Cancelar
              </Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "🎻 Guardar en mi Diario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
