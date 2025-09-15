import React, { useEffect, useRef, useState } from "react";
import { db } from "../../firebase/BaseFire";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * GestionarDias
 * Props:
 *  - onBack (función opcional): callback que se ejecuta al hacer "Atrás" / "Cancelar"
 */
export default function GestionarDias({ onBack }) {
  const [dias, setDias] = useState([]); // array de objetos Date
  const [seleccion, setSeleccion] = useState({}); // { "2025-09-15": { activo: true, horarios: ["14:30","16:00"] } }
  const [cargando, setCargando] = useState(false);
  const initialRef = useRef(null); // para revertir cambios al cancelar

  // Genera los próximos N días (por defecto 14 días = 2 semanas)
  const generarDias = (nDias = 14) => {
    const hoy = new Date();
    const arr = [];
    for (let i = 0; i < nDias; i++) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() + i);
      // normalizar hora a 00:00 para consistencia
      d.setHours(0, 0, 0, 0);
      arr.push(d);
    }
    return arr;
  };

  // Genera horarios desde hh:mm (ej "14:30") hasta hh:mm (ej "21:00") con step en minutos
  const generarHorarios = (start = "14:30", end = "21:00", stepMin = 90) => {
    const parse = (s) => {
      const [hh, mm] = s.split(":").map(Number);
      return hh * 60 + mm;
    };
    const format = (m) => {
      const hh = Math.floor(m / 60).toString().padStart(2, "0");
      const mm = (m % 60).toString().padStart(2, "0");
      return `${hh}:${mm}`;
    };

    const result = [];
    let cur = parse(start);
    const endMin = parse(end);
    while (cur <= endMin) {
      result.push(format(cur));
      cur += stepMin;
    }
    return result;
  };

  const horariosDisponiblesGenerados = generarHorarios("14:30", "21:00", 90); // ["14:30","16:00","17:30","19:00","20:30","22:00"?] <= stops at <=21:00

  // Cargar días y estado guardado desde Firestore
  useEffect(() => {
    const diasArr = generarDias(14);
    setDias(diasArr);

    const cargarDesdeFirestore = async () => {
      const selInicial = {};
      for (const d of diasArr) {
        const fechaStr = d.toISOString().slice(0, 10);
        try {
          const referencia = doc(db, "diasDisponibles", fechaStr);
          const snap = await getDoc(referencia);
          if (snap.exists()) {
            // esperar formato { activo: boolean, horarios: [] }
            selInicial[fechaStr] = snap.data();
          } else {
            selInicial[fechaStr] = { activo: false, horarios: [] };
          }
        } catch (err) {
          console.error("Error leyendo diasDisponibles:", err);
          selInicial[fechaStr] = { activo: false, horarios: [] };
        }
      }
      initialRef.current = JSON.parse(JSON.stringify(selInicial)); // copia profunda
      setSeleccion(selInicial);
    };

    cargarDesdeFirestore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle día completo
  const toggleDia = (fechaStr) => {
    setSeleccion((prev) => {
      const prevData = prev[fechaStr] || { activo: false, horarios: [] };
      // si desactivamos, limpiamos horarios
      const nuevo = {
        ...prev,
        [fechaStr]: {
          activo: !prevData.activo,
          horarios: !prevData.activo ? prevData.horarios : [],
        },
      };
      return nuevo;
    });
  };

  // Toggle horario dentro de un día
  const toggleHora = (fechaStr, hora) => {
    setSeleccion((prev) => {
      const prevData = prev[fechaStr] || { activo: false, horarios: [] };
      // si el día no está activo, activarlo al seleccionar hora
      const activo = prevData.activo || true;
      const horariosPrev = prevData.horarios || [];
      const horariosNuevos = horariosPrev.includes(hora)
        ? horariosPrev.filter((h) => h !== hora)
        : [...horariosPrev, hora];
      return {
        ...prev,
        [fechaStr]: { activo, horarios: horariosNuevos },
      };
    });
  };

  // Guardar todos los días en Firestore
  const guardar = async () => {
    setCargando(true);
    try {
      const keys = Object.keys(seleccion);
      for (const fecha of keys) {
        const docRef = doc(db, "diasDisponibles", fecha);
        await setDoc(docRef, seleccion[fecha]);
      }
      // actualizar snapshot inicial
      initialRef.current = JSON.parse(JSON.stringify(seleccion));
      alert("Días y horarios guardados correctamente ✅");
    } catch (err) {
      console.error("Error guardando diasDisponibles:", err);
      alert("Ocurrió un error al guardar. Reintenta.");
    } finally {
      setCargando(false);
    }
  };

  // Cancelar -> revertir al estado inicial y volver
  const cancelar = () => {
    if (initialRef.current) setSeleccion(JSON.parse(JSON.stringify(initialRef.current)));
    if (onBack) onBack();
    else window.history.back();
  };

  // Botón "Atrás" superior (solo vuelve sin guardar)
  const irAtras = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  return (
    <div className="min-h-screen bg-red-50 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={irAtras}
            aria-label="Atrás"
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-900"
          >
            <span className="text-2xl">←</span> Atrás
          </button>

          <h1 className="text-xl sm:text-2xl font-bold text-red-800">Gestionar Días y Horarios</h1>

          {/* placeholder para balancear layout en móvil */}
          <div className="w-10" />
        </div>

        {/* Grid de días */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dias.map((d) => {
            const fechaStr = d.toISOString().slice(0, 10);
            const data = seleccion[fechaStr] || { activo: false, horarios: [] };
            return (
              <div
                key={fechaStr}
                className="bg-white rounded-lg p-4 shadow-sm border border-red-100 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm text-red-600 font-semibold">
                      {d.toLocaleDateString("es-AR", { weekday: "long" })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {d.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      aria-label={`Activar día ${fechaStr}`}
                      type="checkbox"
                      checked={!!data.activo}
                      onChange={() => toggleDia(fechaStr)}
                      className="w-5 h-5 accent-pink-500"
                    />
                    <span className="text-xs text-gray-600">Dia</span>
                  </label>
                </div>

                {/* Horarios: solo visibles si dia activo */}
                <div className={`mt-2 ${data.activo ? "" : "opacity-60"}`}>
                  <div className="flex flex-wrap gap-2">
                    {horariosDisponiblesGenerados.map((hora) => {
                      const activoHora = data.horarios?.includes(hora);
                      return (
                        <button
                          key={hora}
                          onClick={() => toggleHora(fechaStr, hora)}
                          disabled={!data.activo}
                          className={`text-sm px-3 py-1 rounded-full border transition 
                            ${activoHora ? "bg-pink-500 text-white border-pink-500" : "bg-white text-red-700 border-red-200"}
                            ${!data.activo ? "cursor-not-allowed opacity-60" : "hover:scale-105"}
                          `}
                          aria-pressed={activoHora}
                          aria-label={`Toggle horario ${hora} para ${fechaStr}`}
                        >
                          {hora}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer botones (responsive) */}
        <div className="mt-6 sticky bottom-0 left-0 right-0 bg-gradient-to-t from-red-50/80 p-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3">
            <button
              onClick={cancelar}
              className="w-full sm:w-auto flex-1 border border-red-300 text-red-700 bg-white py-3 rounded-lg font-semibold hover:bg-red-50 transition"
            >
              Cancelar
            </button>

            <button
              onClick={guardar}
              disabled={cargando}
              className="w-full sm:w-auto flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-bold shadow-md transition disabled:opacity-60"
            >
              {cargando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
