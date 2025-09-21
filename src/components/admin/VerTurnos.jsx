import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/BaseFire";
import { motion } from "framer-motion";

const VerTurnos = () => {
  const [turnos, setTurnos] = useState([]);

  // Función para obtener turnos desde Firestore
  const obtenerTurnos = async () => {
    const snapshot = await getDocs(collection(db, "turnos"));
    const data = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

    // Convertimos la fecha a objeto Date y ordenamos ascendente (más cercano primero)
    const dataOrdenada = data
      .map((t) => ({ ...t, fechaObj: new Date(t.fecha) }))
      .sort((a, b) => a.fechaObj - b.fechaObj);

    setTurnos(dataOrdenada);
  };

  useEffect(() => {
    obtenerTurnos();
  }, []);

  // Función para eliminar un turno
  const eliminarTurno = async (turno) => {
    try {
      await deleteDoc(doc(db, "turnos", turno.id));
      obtenerTurnos();
    } catch (error) {
      console.error("Error al eliminar turno:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 to-red-800 p-4">
      <h1 className="text-white text-3xl font-bold text-center mb-6 tracking-wide uppercase">
        Turnos Agendados
      </h1>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {turnos.length === 0 ? (
    <p className="text-white text-center col-span-full text-xl font-semibold  ">
      ¡No hay turnos disponibles!
    </p>
  ) : (
    turnos.map((turno) => (
      <motion.div
        key={turno.id}
        className="relative bg-red-200 rounded-2xl shadow-lg p-4 text-black flex flex-col justify-between"
        whileHover={{ scale: 1.02 }}
      >
        {/* Cruz roja en esquina superior derecha */}
        <button
          onClick={() => eliminarTurno(turno)}
          className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow"
        >
          ×
        </button>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-2xl font-semibold uppercase">{turno.nombre}</p>
            <p className="text-1xl">📅 {turno.fechaObj.toLocaleDateString("es-AR")}</p>
            <p className="text-1xl">⏰ {turno.hora}</p>
            <p className="text-1xl">📱 {turno.whatsapp}</p>
          </div>

          {turno.modelo && (
            <img
              src={turno.modelo}
              alt={turno.nombre}
              className="w-24 h-24 rounded-xl object-cover"
            />
          )}
        </div>
      </motion.div>
    ))
  )}
</div>

    </div>
  );
};

export default VerTurnos;
