import React, { useEffect, useRef, useState } from "react";
import { db } from "../../firebase/BaseFire";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function GestionarDias({ onBack }) {
  const [dias, setDias] = useState([]);
  const [seleccion, setSeleccion] = useState({});
  const [cargando, setCargando] = useState(true); // ahora cargando inicia en true
  const initialRef = useRef(null);

  const generarDias = (nDias = 14) => {
    const hoy = new Date();
    const arr = [];
    for (let i = 0; i < nDias; i++) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() + i);
      d.setHours(0, 0, 0, 0);
      arr.push(d);
    }
    return arr;
  };

  const generarHorarios = (start = "14:30", end = "21:00", stepMin = 90) => {
    const parse = (s) => s.split(":").map(Number).reduce((a, b, i) => a + (i === 0 ? b * 60 : b), 0);
    const format = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    const result = [];
    let cur = parse(start);
    const endMin = parse(end);
    while (cur <= endMin) {
      result.push(format(cur));
      cur += stepMin;
    }
    return result;
  };

  const horariosDisponiblesGenerados = generarHorarios("14:30", "21:00", 90);

  useEffect(() => {
    const diasArr = generarDias(14);
    setDias(diasArr);

    const cargarDesdeFirestore = async () => {
      const selInicial = {};
      for (const d of diasArr) {
        const fechaStr = d.toISOString().slice(0, 10);
        try {
          const snap = await getDoc(doc(db, "diasDisponibles", fechaStr));
          selInicial[fechaStr] = snap.exists() ? snap.data() : { activo: false, horarios: [] };
        } catch {
          selInicial[fechaStr] = { activo: false, horarios: [] };
        }
      }
      initialRef.current = JSON.parse(JSON.stringify(selInicial));
      setSeleccion(selInicial);
      setCargando(false); // termina de cargar
    };

    cargarDesdeFirestore();
  }, []);

  const toggleDia = (fechaStr) => {
    setSeleccion((prev) => {
      const prevData = prev[fechaStr] || { activo: false, horarios: [] };
      return {
        ...prev,
        [fechaStr]: { activo: !prevData.activo, horarios: !prevData.activo ? prevData.horarios : [] },
      };
    });
  };

  const toggleHora = (fechaStr, hora) => {
    setSeleccion((prev) => {
      const prevData = prev[fechaStr] || { activo: false, horarios: [] };
      const horariosNuevos = prevData.horarios.includes(hora)
        ? prevData.horarios.filter((h) => h !== hora)
        : [...prevData.horarios, hora];
      return { ...prev, [fechaStr]: { activo: true, horarios: horariosNuevos } };
    });
  };

  const guardar = async () => {
    setCargando(true);
    try {
      for (const fecha of Object.keys(seleccion)) {
        await setDoc(doc(db, "diasDisponibles", fecha), seleccion[fecha]);
      }
      initialRef.current = JSON.parse(JSON.stringify(seleccion));
      alert("Días y horarios guardados correctamente ✅");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al guardar. Reintenta.");
    } finally {
      setCargando(false);
    }
  };

  const cancelar = () => {
    if (initialRef.current) setSeleccion(JSON.parse(JSON.stringify(initialRef.current)));
    if (onBack) onBack();
    else window.history.back();
  };

  const irAtras = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  return (
    <div className="min-h-screen bg-red-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={irAtras} className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-900">
            <span className="text-2xl">←</span> Atrás
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-red-800">Gestionar Días y Horarios</h1>
          <div className="w-10" />
        </div>

        {/* 🔹 Spinner mientras carga */}
        {cargando ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dias.map((d) => {
              const fechaStr = d.toISOString().slice(0, 10);
              const data = seleccion[fechaStr] || { activo: false, horarios: [] };
              return (
                <div key={fechaStr} className="bg-white rounded-lg p-4 shadow-sm border border-red-100 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm text-red-600 font-semibold">{d.toLocaleDateString("es-AR", { weekday: "long" })}</div>
                      <div className="text-xs text-gray-500">{d.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}</div>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!data.activo}
                        onChange={() => toggleDia(fechaStr)}
                        className="w-5 h-5 accent-pink-500"
                      />
                      <span className="text-xs text-gray-600">Dia</span>
                    </label>
                  </div>

                  <div className={`mt-2 ${data.activo ? "" : "opacity-60"}`}>
                    <div className="flex flex-wrap gap-2">
                      {horariosDisponiblesGenerados.map((hora) => {
                        const activoHora = data.horarios.includes(hora);
                        return (
                          <button
                            key={hora}
                            onClick={() => toggleHora(fechaStr, hora)}
                            disabled={!data.activo}
                            className={`text-sm px-3 py-1 rounded-full border transition ${
                              activoHora ? "bg-pink-500 text-white border-pink-500" : "bg-white text-red-700 border-red-200"
                            } ${!data.activo ? "cursor-not-allowed opacity-60" : "hover:scale-105"}`}
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
        )}

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
