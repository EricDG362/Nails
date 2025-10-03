import { useTurnoStore } from "../store/TurnoStore";
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase/BaseFire';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";

const storage = getStorage();

const Confirmacion = ({ onReset, setModalConfirmVisible, setDatosTurno }) => {
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
      month: "long",
      day: "numeric",
    });
  }

  const resizeImageIfHeavy = (file, maxSize = 1200, quality = 0.8, thresholdMB = 1.5) =>
    new Promise((resolve) => {
      if (!(file instanceof File)) return resolve(file);
      if (file.size / 1024 / 1024 <= thresholdMB) return resolve(file);

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

        canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
      };
      img.src = URL.createObjectURL(file);
    });

  const guardar = async () => {
    setCargando(true);

    try {
      let urlImagen = null;

      if (modelo) {
        if (modelo instanceof File) {
          const resizedBlob = await resizeImageIfHeavy(modelo, 1200);
          const storageRef = ref(storage, `uñas/${modelo.name}-${Date.now()}`);
          await uploadBytes(storageRef, resizedBlob);
          urlImagen = await getDownloadURL(storageRef);
        } else if (typeof modelo === "string" && modelo.startsWith("data:image")) {
          const res = await fetch(modelo);
          const blob = await res.blob();
          const storageRef = ref(storage, `uñas/${Date.now()}.jpg`);
          await uploadBytes(storageRef, blob);
          urlImagen = await getDownloadURL(storageRef);
        } else if (modelo.imagen) {
          urlImagen = modelo.imagen;
        } else if (typeof modelo === "string") {
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

      // 🔹 Armamos los datos para el modal
      setDatosTurno({
        nombre,
        fecha: fechaFormateada,
        hora,
        urlImagen,
      });

      setModalConfirmVisible(true);
    } catch (error) {
      console.error("Error al guardar el turno:", error);
      setCargando(false);
      alert("Hubo un error al guardar el turno. Revisa la consola para más detalles.");
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8 -mt-14 overflow-hidden">
      <div className="relative z-20 flex flex-col items-center justify-center backdrop-blur-md bg-black/50 border border-pink-400/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(255,105,180,0.5)]">
        <div className="relative animate-bounce">
          <img
            src={
              modelo
                ? modelo instanceof File
                  ? URL.createObjectURL(modelo)
                  : modelo.imagen || modelo
                : "/placeholder.png"
            }
            alt="Modelo elegido"
            className="w-32 h-32 rounded-full shadow-[0_0_20px_rgba(255,20,147,0.5)] mb-6 object-cover border-2 border-pink-500"
          />
        </div>

        <div className="bg-gradient-to-br -mt-8 from-pink-600/20 to-red-500/20 p-6 rounded-xl border border-pink-400/50 shadow-lg relative overflow-hidden">
          <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-500 font-[Bebas_Neue] tracking-wider animate-pulse">
            <span className="uppercase">{nombre}</span>, tu solicitud...
          </h2>

          <div className="space-y-4 text-center">
            <p className="text-lg text-pink-300">Vas a agendar un turno para el día:</p>
            <div className="py-3 px-6 bg-black/40 rounded-lg border border-pink-500/50 shadow-[0_0_10px_rgba(255,20,147,0.3)]">
              <p className="text-2xl font-bold text-pink-400">{fechaFormateada}</p>
              <p className="text-xl font-semibold text-pink-500">a las {hora} hs</p>
            </div>

            <button
              className="mt-6 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-pink-400/50 transform hover:scale-105"
              onClick={guardar}
              disabled={cargando}
            >
              {cargando ? "SOLICITANDO..." : "SOLICITAR TURNO"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmacion;
