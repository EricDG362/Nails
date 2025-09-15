import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/BaseFire";
import { motion } from "framer-motion";

const VerTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [cancelando, setCancelando] = useState(null); // ID del turno que estoy cancelando
  const [motivo, setMotivo] = useState("");

  // Traer turnos
  const obtenerTurnos = async () => {
    const snapshot = await getDocs(collection(db, "turnos"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTurnos(data);
  };

  useEffect(() => {
    obtenerTurnos();
  }, []);

  // Eliminar y abrir WhatsApp
  const cancelarTurno = async (turno) => {
    try {
      // ✅ Eliminar de Firestore
      await deleteDoc(doc(db, "turnos", turno.id));

      // ✅ Armar mensaje de WhatsApp
      const mensaje = encodeURIComponent(
        `Hola ${turno.nombre}, lamentamos informarte que tu turno del día ${turno.fecha} a las ${turno.hora} fue cancelado. Motivo: ${motivo}. Por favor elegí otro día.`
      );

      // ✅ Abrir WhatsApp
      window.open(`https://wa.me/+549${turno.telefono}?text=${mensaje}`, "_blank");

      // Limpiar estados
      setMotivo("");
      setCancelando(null);

      // Refrescar lista
      obtenerTurnos();
    } catch (error) {
      console.error("Error al cancelar turno:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 to-red-800 p-4">
      <h1 className="text-white text-3xl font-bold text-center mb-6 tracking-wide uppercase">
        Turnos Agendados
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {turnos.map((turno) => (
          <motion.div
            key={turno.id}
            className="bg-red-200 rounded-2xl shadow-lg p-4 text-black flex flex-col justify-between"
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <p className="text-2xl font-semibold uppercase">{turno.nombre}</p>
              <p className="text-1xl">📅 {turno.fecha}</p>
              <p className="text-1xl">⏰ {turno.hora}</p>
              <p className="text-1xl">📱 {turno.telefono}</p>
            </div>

            {cancelando === turno.id ? (
              <div className="mt-4">
                <textarea
                  className="w-full p-2 rounded-lg text-black mb-2 bg-gray-300"
                  rows="2"
                  placeholder="Motivo de la cancelación..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => cancelarTurno(turno)}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg shadow"
                  >
                    Enviar
                  </button>
                  <button
                    onClick={() => {
                      setCancelando(null);
                      setMotivo("");
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg shadow"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setCancelando(turno.id)}
                className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg shadow"
              >
                Cancelar Turno
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VerTurnos;
