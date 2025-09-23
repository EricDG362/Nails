import { useTurnoStore } from "../store/TurnoStore";
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase/BaseFire';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";

const storage = getStorage();

const Confirmacion = ({ onReset, setModalConfirmVisible }) => {
  const { modelo, fecha, hora, nombre, whatsapp } = useTurnoStore();
  const [cargando, setCargando] = useState(false);

  if (!fecha || !hora || !nombre || !whatsapp) {
    return (
      <p className="text-center text-red-500">
        Faltan datos a completar del turno.
      </p>
    );
  }

 

let fechaFormateada = fecha;
if (fecha) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaLocal = new Date(anio, mes - 1, dia);
  fechaFormateada = fechaLocal.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
  const resizeImage = (file, maxSize = 400) =>
    new Promise((resolve) => {
      if (!(file instanceof File)) return resolve(null);
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > width && height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        } else if (width > maxSize) {
          width = height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.7);
      };
      img.src = URL.createObjectURL(file);
    });

  const guardar = async () => {
    setCargando(true);
    try {
      let urlImagen = null;
      if (modelo) {
        if (modelo instanceof File) {
          const resizedBlob = await resizeImage(modelo, 100);
          const storageRef = ref(storage, `uñas/${modelo.name}-${Date.now()}`);
          await uploadBytes(storageRef, resizedBlob);
          urlImagen = await getDownloadURL(storageRef);
        } else if (modelo.imagen) {
          urlImagen = modelo.imagen;
        } else {
          urlImagen = modelo;
        }
      }

      await addDoc(collection(db, "turnos"), {
        modelo: urlImagen,
        fecha,
        hora,
        nombre,
        whatsapp,
        estado: "pendiente",
        creado: new Date().toISOString(),
      });

      setCargando(false);
      onReset();
      setModalConfirmVisible(true);

      const mensaje = `📅 ${nombre} confirmó un turno:
- Para el Día: ${fecha}
- Hora: ${hora}
- Modelo: ${urlImagen ? urlImagen : "No hay imagen"}`;

      const numero = "5493512364203";
      window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank");
    } catch (error) {
      console.error("Error al guardar el turno:", error);
      setCargando(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      {/* Efecto luces */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-red-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-rose-700/15 blur-3xl animate-pulse delay-300"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-20 flex flex-col items-center justify-center backdrop-blur-md bg-black/50 border border-white/10 rounded-2xl p-8 shadow-[0_0_30px_rgba(190,20,30,0.3)] hover:shadow-[0_0_40px_rgba(190,20,30,0.4)] transition-all duration-500">
        {/* Foto */}
        <div className="relative group">
          <img
            src={
              modelo
                ? modelo instanceof File
                  ? URL.createObjectURL(modelo)
                  : modelo.imagen || modelo
                : "/placeholder.png"
            }
            alt={modelo ? "Modelo elegido" : "Sin imagen"}
            className="w-32 h-32 rounded-full shadow-lg mb-6 object-cover border-2 border-red-600/50"
          />
          <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-red-400/30 group-hover:animate-ping opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        </div>

        {/* Tarjeta */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-xl border-t border-red-500/50 shadow-lg relative overflow-hidden mb-15">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 font-[Bebas_Neue] tracking-wider">
            {nombre}, tu solicitud...
          </h2>

          <div className="space-y-4 text-center ">
            <p className="text-lg">Vas a agendar un turno para el día:</p>

            <div className="py-3 px-6 bg-black/40 rounded-lg border border-red-600/30">
              <p className="text-2xl font-bold text-red-400">{fechaFormateada}</p>
              <p className="text-xl font-semibold">a las {hora} hs</p>
            </div>

            <button
              className="mt-6 ml-6 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-4 rounded-full hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/30 transform hover:scale-105 flex items-center justify-center gap-2"
              onClick={guardar}
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    ></path>
                  </svg>
                  SOLICITANDO...
                </>
              ) : (
                "SOLICITAR TURNO"
              )}
            </button>

            <div className="pt-4 border-t border-white/10 ">
              <p className="text-sm">
                Estado de turno:
                <span className="ml-2 px-3 py-1 rounded-full bg-red-900/50 text-red-300 font-bold animate-pulse duration-1000 shadow-[0_0_8px_rgba(190,20,30,0.7)]">
                  PENDIENTE
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmacion;
