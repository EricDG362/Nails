import React, { useState, useEffect } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/BaseFire";
import { useTurnoStore } from "../store/TurnoStore";
import { addDays } from "date-fns";
import { motion } from "framer-motion";

const ElegirFechaHora = () => {
  const [diasDisponibles, setDiasDisponibles] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState({});
  const [cargando, setCargando] = useState(true);

  const modelo = useTurnoStore((state) => state.modelo);
  const fecha = useTurnoStore((state) => state.fecha);
  const hora = useTurnoStore((state) => state.hora);
  const setFecha = useTurnoStore((state) => state.setFecha);
  const setHora = useTurnoStore((state) => state.setHora);

  useEffect(() => {
    const cargarDias = async () => {
      setCargando(true);

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const tempDias = [];
      for (let i = 0; i < 8; i++) {
        tempDias.push(addDays(hoy, i));
      }

      let diasValidos = [];
      let horariosMap = {};

      for (const d of tempDias) {
        const fechaStr = d.toLocaleDateString("en-CA");
        const fechaMostrar = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

        const diaDoc = doc(db, "diasDisponibles", fechaStr);
        const diaSnap = await getDoc(diaDoc);

        if (diaSnap.exists() && diaSnap.data().activo) {
          const habilitados = diaSnap.data().horarios || [];
          const q = query(collection(db, "turnos"), where("fecha", "==", fechaStr));
          const snapshot = await getDocs(q);
          const ocupados = snapshot.docs.map(doc => (doc.data().hora || "").trim());
          const libres = habilitados.filter(h => !ocupados.includes(h.trim()));

          if (libres.length > 0) {
            diasValidos.push({ fecha: d, fechaStr, fechaMostrar });
            horariosMap[fechaStr] = libres;
          }
        }
      }

      setDiasDisponibles(diasValidos);
      setHorariosDisponibles(horariosMap);
      setCargando(false);
    };

    cargarDias();
  }, []);

  return (
    <div className="h-screen w-[90%] mx-auto bg-gradient-to-b from-red-100 to-pink-100 p-4 sm:p-6 md:p-8 overflow-y-auto">

      {/* Vista previa modelo */}
      <motion.div
        className="flex flex-col items-center mb-6 mt-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {modelo ? (
          <>
            <motion.img
              src={modelo.imagen} // ahora siempre es base64 o url
              alt="Modelo elegido"
              className="w-40 h-40 rounded-full border-pink-500 border-4 object-cover shadow-[0_0_20px_rgba(255,105,180,0.7)] mb-3"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {modelo.titulo && (
              <p className="text-center text-gray-700 font-semibold">{modelo.titulo}</p>
            )}
          </>
        ) : (
          <div className="w-40 h-40 flex items-center justify-center bg-gray-200 rounded-full shadow-lg mb-2">
            <p className="text-gray-500 text-center">Sin imagen</p>
          </div>
        )}
      </motion.div>

      {/* Selección actual */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-semibold text-pink-600 bg-red-200 rounded-2xl p-2 shadow-md shadow-pink-200">
          {fecha && hora
            ? (() => {
                const [anio, mes, dia] = fecha.split("-").map(Number);
                const fechaLocal = new Date(anio, mes - 1, dia);
                return `Elegiste: ${fechaLocal.toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })} a las ${hora} hs`;
              })()
            : "Elegí una fecha y hora"}
        </h2>
      </motion.div>

      {/* Grid de días */}
      {cargando ? (
        <p className="text-center text-gray-500">Cargando días disponibles...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh] pb-6">
          {diasDisponibles.map(({ fecha: d, fechaStr }) => (
            <motion.div
              key={fechaStr}
              className={`rounded-xl p-4 border cursor-pointer relative overflow-hidden shadow-lg 
                ${fecha === fechaStr
                  ? "bg-gradient-to-r from-pink-500 to-red-400 text-white border-pink-500 shadow-[0_0_15px_rgba(255,20,147,0.7)]"
                  : "bg-white border-red-100 text-gray-800"
                }`}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFecha(fecha === fechaStr ? null : fechaStr)}
            >
              {fecha === fechaStr && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-pink-200 opacity-20 blur-xl"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <div className="mb-3 relative z-10">
                <div className="text-sm font-semibold">
                  {d.toLocaleDateString("es-AR", { weekday: "long" })}
                </div>
                <div className="text-xs opacity-80">
                  {d.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>

              {/* Horarios */}
              {fecha === fechaStr && (
                <div className="flex flex-wrap gap-2 mt-2 relative z-10">
                  {horariosDisponibles[fechaStr]?.map((h) => (
                    <motion.button
                      key={h}
                      onClick={(e) => { e.stopPropagation(); setHora(h); }}
                      whileTap={{ scale: 0.9 }}
                      className={`text-sm px-3 py-1 rounded-full border shadow-md transition-colors duration-200
                        ${hora === h
                          ? "bg-pink-500 text-white border-pink-500 shadow-[0_0_10px_rgba(255,20,147,0.9)]"
                          : "bg-white text-red-700 border-red-200"
                        }`}
                    >
                      {h}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ElegirFechaHora;
