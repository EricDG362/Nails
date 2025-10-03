import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/BaseFire";
import { motion } from "framer-motion";

const VerTurnos = () => {
  const [turnos, setTurnos] = useState([]);

  // Función para obtener turnos desde Firestore
  const obtenerTurnos = async () => {
    const snapshot = await getDocs(collection(db, "turnos"));
    const data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    // Ordenamos ascendente según fecha + hora
    const dataOrdenada = data.sort((a, b) => {
      const fechaA = new Date(a.fecha + "T00:00:00");
      const fechaB = new Date(b.fecha + "T00:00:00");
      return fechaA - fechaB;
    });

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
          <p className="text-white text-center col-span-full text-xl font-semibold">
            ¡No hay turnos disponibles!
          </p>
        ) : (
          turnos.map((turno) => (
            <motion.div
              key={turno.id}
              className="relative bg-red-200 rounded-2xl shadow-lg p-4 text-black flex flex-col justify-between"
              whileHover={{ scale: 1.02 }}
            >
              {/* Botón eliminar */}
              <button
                onClick={() => eliminarTurno(turno)}
                className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow"
              >
                ×
              </button>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-2xl font-semibold uppercase">
                    {turno.nombre}
                  </p>

                  {/* Fecha corregida */}
                  {turno.fecha && (
                    <p className="text-1xl">
                      📅{" "}
                      {new Date(
                        turno.fecha + "T00:00:00"
                      ).toLocaleDateString("es-AR", {
                        weekday: "long",
                       
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}

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
