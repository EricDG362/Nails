import React, { useState, useEffect } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../firebase/BaseFire';
import { useTurnoStore } from "../store/TurnoStore";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import es from "date-fns/locale/es";

registerLocale("es", es);

const ElegirFechaHora = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [horariosOcupados, setHorariosOcupados] = useState([]);

  const modelo = useTurnoStore((state) => state.modelo);
  const setHora = useTurnoStore((state) => state.setHora);
  const setFecha = useTurnoStore((state) => state.setFecha);
  const fecha = useTurnoStore((state) => state.fecha);

  useEffect(() => {
    if (!fecha) {
      setFechaSeleccionada(null);
      setHorariosDisponibles([]);
      setHorariosOcupados([]);
    }
  }, [fecha]);

  useEffect(() => {
    const obtenerHorarios = async () => {
      if (!fechaSeleccionada) return;

      const fechaStr = fechaSeleccionada.toISOString().split("T")[0];

      // 🔹 1. Traemos los horarios habilitados para ese día desde "diasDisponibles"
      const diaDoc = doc(db, "diasDisponibles", fechaStr);
      const diaSnap = await getDoc(diaDoc);

      if (!diaSnap.exists() || !diaSnap.data().activo) {
        setHorariosDisponibles([]);
        return;
      }

      const habilitados = diaSnap.data().horarios || [];

      // 🔹 2. Traemos los horarios ya ocupados en "turnos"
      const q = query(
        collection(db, "turnos"),
        where("fecha", "==", fechaStr)
      );

      const snapshot = await getDocs(q);
      const ocupados = snapshot.docs.map((doc) => doc.data().hora);

      // 🔹 3. Filtramos
      const libres = habilitados.filter((h) => !ocupados.includes(h));

      setHorariosDisponibles(libres);
      setHorariosOcupados(ocupados);
    };

    obtenerHorarios();
  }, [fechaSeleccionada]);

  // calculamos la fecha máxima: domingo de la semana siguiente
  const hoy = new Date();
  const diaSemana = hoy.getDay();
  const diasHastaDomingoProxSemana = 7 - diaSemana;
  const maxDate = addDays(hoy, diasHastaDomingoProxSemana);

  return (
    <div className="flex flex-col items-center mb-32">
      {/* Imagen del modelo o placeholder */}
      <div className="flex flex-col items-center mb-6">
        {modelo ? (
          <img
            src={URL.createObjectURL(modelo)}
            alt="Modelo elegido"
            className="w-40 h-40 rounded-full object-cover shadow-lg mb-2"
          />
        ) : (
          <div className="w-40 h-40 flex items-center justify-center bg-gray-200 rounded-full shadow-lg mb-2">
            <p className="text-gray-500 text-center">Sin imagen</p>
          </div>
        )}
      </div>

      <div className="text-center mb-4 text-white tracking-wider text-4xl">
        ELEGÍ UNA FECHA
      </div>

      <DatePicker
        selected={fechaSeleccionada}
        onChange={(date) => {
          setFechaSeleccionada(date);
          const fechaStr = date.toISOString().split("T")[0];
          setFecha(fechaStr);
        }}
        minDate={hoy}
        maxDate={maxDate}
        dateFormat="dd/MM/yyyy"
        locale="es"
        placeholderText="--seleccione--"
        className="p-2 rounded bg-white text-black text-center mb-4"
      />

      {fechaSeleccionada && (
        horariosDisponibles.length > 0 ? (
          <select
            className="p-2 rounded bg-white text-black text-center mb-5"
            onChange={(e) => setHora(e.target.value)}
          >
            <option value="">-- Seleccionar horario --</option>
            {horariosDisponibles.map((hora) => (
              <option key={hora} value={hora}>{hora}</option>
            ))}
          </select>
        ) : (
          <p className="text-red-600 font-semibold mt-4">
            No hay horarios disponibles para este día
          </p>
        )
      )}
    </div>
  );
};

export default ElegirFechaHora;
