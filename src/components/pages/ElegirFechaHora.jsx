import React, { useState, useEffect } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/BaseFire";
import { useTurnoStore } from "../store/TurnoStore";
import { addDays } from "date-fns";

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

      // Fecha de hoy sin horas
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      // Vamos a traer los próximos 7 días
      const tempDias = [];
      for (let i = 0; i < 8; i++) {
        const d = addDays(hoy, i);
        tempDias.push(d);
      }

      let diasValidos = [];
      let horariosMap = {};

     for (const d of tempDias) {
  const fechaStr = d.toLocaleDateString("en-CA"); // formato ISO local
  const fechaMostrar = d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });


        const diaDoc = doc(db, "diasDisponibles", fechaStr);
        const diaSnap = await getDoc(diaDoc);


        if (diaSnap.exists() && diaSnap.data().activo) {
          // Horarios habilitados
          const habilitados = diaSnap.data().horarios || [];


          // Horarios ocupados en turnos
          const q = query(collection(db, "turnos"), where("fecha", "==", fechaStr));
          const snapshot = await getDocs(q);
          const ocupados = snapshot.docs.map(doc => (doc.data().hora || "").trim());

          // Horarios libres
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
    <div className="h-screen w-[90%] mx-auto bg-red-50 p-4 sm:p-6 md:p-8 overflow-y-auto">


      {/* Vista previa modelo */}
   
<div className="flex flex-col items-center mb-6 mt-10">
  {modelo ? (
    <>
      <img
        src={modelo instanceof File ? URL.createObjectURL(modelo) : modelo.imagen}
        alt="Modelo elegido"
        className="w-40 h-40 rounded-full border-pink-500 border-4 object-cover shadow-lg mb-2"
      />
      {/* Título o descripción si existe */}
      {modelo.titulo && (
        <p className="text-center text-gray-700 font-semibold">{modelo.titulo}</p>
      )}
    </>
  ) : (
    <div className="w-40 h-40 flex items-center justify-center bg-gray-200 rounded-full shadow-lg mb-2">
      <p className="text-gray-500 text-center">Sin imagen</p>
    </div>
  )}
</div>


  {/* Selección actual */}
<div className="text-center mb-6">
  <h2 className="text-lg font-semibold text-pink-600 bg-red-200 rounded-2xl p-2">
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
</div>



      {/* Grid de días */}
      {cargando ? (
        <p className="text-center text-gray-500">Cargando días disponibles...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh]">
          {diasDisponibles.map(({ fecha: d, fechaStr }) => (
            <div
              key={fechaStr}
              className={`bg-white rounded-lg p-4 shadow-sm border cursor-pointer transition 
                ${fecha === fechaStr ? "border-pink-500 ring-2 ring-pink-300" : "border-red-100"}`}
              onClick={() => setFecha(fecha === fechaStr ? null : fechaStr)}
            >
              <div className="mb-3">
                <div className="text-sm text-red-600 font-semibold">
                  {d.toLocaleDateString("es-AR", { weekday: "long" })}
                </div>
                <div className="text-xs text-gray-500">
                  {d.toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* Horarios: solo visibles si día seleccionado */}
              {fecha === fechaStr && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {horariosDisponibles[fechaStr]?.map((h) => (
                    <button
                      key={h}
                      onClick={(e) => {
                        e.stopPropagation();
                        setHora(h);
                      }}
                      className={`text-sm px-3 py-1 rounded-full border transition 
                        ${
                          hora === h
                            ? "bg-pink-500 text-white border-pink-500"
                            : "bg-white text-red-700 border-red-200 hover:scale-105"
                        }
                      `}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ElegirFechaHora;
