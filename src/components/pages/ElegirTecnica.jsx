import { useState, useRef, useEffect } from "react";
import { useTurnoStore } from "../store/TurnoStore";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/BaseFire";
import { motion } from "framer-motion";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ElegirTecnica({ onNext }) {
  const modelo = useTurnoStore((state) => state.modelo);
  const setModelo = useTurnoStore((state) => state.setModelo);

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subiendo, setSubiendo] = useState(false); // ⬅️ nuevo estado de subida
  const fileInputRef = useRef(null);
  const carruselRef = useRef(null);
  const autoScrollRef = useRef(null);

  // 🔹 Cargar productos desde Firebase
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "catalogo"));
        const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProductos(lista);
      } catch (error) {
        console.error("Error al cargar catálogo:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, []);

  // 🔹 Auto-scroll infinito hacia la izquierda
  useEffect(() => {
    const carrusel = carruselRef.current;
    if (!carrusel) return;

    const scrollStep = 1;
    const intervalTime = 30;

    autoScrollRef.current = setInterval(() => {
      if (carrusel.scrollLeft >= carrusel.scrollWidth - carrusel.clientWidth) {
        carrusel.scrollLeft = 0;
      } else {
        carrusel.scrollLeft += scrollStep;
      }
    }, intervalTime);

    const stopScroll = () => clearInterval(autoScrollRef.current);
    carrusel.addEventListener("mousedown", stopScroll);
    carrusel.addEventListener("touchstart", stopScroll);

    return () => {
      clearInterval(autoScrollRef.current);
      carrusel.removeEventListener("mousedown", stopScroll);
      carrusel.removeEventListener("touchstart", stopScroll);
    };
  }, [productos]);

  // 🔹 Redimensiona imagen si es pesada (>1.5MB)
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

  const storage = getStorage();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendo(true); // ⬅️ empieza la carga
    try {
      const resizedBlob = await resizeImageIfHeavy(file, 1200);

      const storageRef = ref(storage, `uñas/${file.name}-${Date.now()}`);
      await uploadBytes(storageRef, resizedBlob);
      const url = await getDownloadURL(storageRef);

      setModelo({ imagen: url }, "archivo");
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("No se pudo subir la imagen. Revisa la consola.");
    } finally {
      setSubiendo(false); // ⬅️ termina la carga
    }
  };

  const abrirSelector = () => fileInputRef.current.click();
  const seleccionarDelCatalogo = (item) => setModelo(item, "catalogo");
  const continuarSinImagen = () => {
    setModelo(null, null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onNext();
  };

  return (
    <div className="flex flex-col items-center w-full h-full px-6 relative 
                    bg-gradient-to-br from-pink-800 via-fuchsia-900 to-rose-800 
                    animate-gradient-x">

      <h2 className="text-3xl font-extrabold mb-2 mt-4 text-white text-center drop-shadow-lg">
        1️⃣ Elegí del catálogo 💅
      </h2>

      {/* Carrusel */}
      <div className="w-full mb-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-400"></div>
          </div>
        ) : (
          <motion.div
            ref={carruselRef}
            className="flex overflow-x-auto space-x-6 p-4 scrollbar-hide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {productos.map((item) => (
              <motion.div
                key={item.id}
                onClick={() => seleccionarDelCatalogo(item)}
                whileHover={{ scale: 1.1, rotate: 2 }}
                className="flex-shrink-0 w-44 backdrop-blur-md bg-white/20 border border-white/30 rounded-xl shadow-lg cursor-pointer overflow-hidden"
              >
                <img src={item.imagen} alt={item.titulo} className="w-full h-32 object-cover" />
                <div className="p-3 text-center">
                  <p className="text-sm font-semibold text-white truncate">{item.titulo}</p>
                  <p className="text-pink-300 font-bold text-md">$ {item.precio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Vista previa */}
      <motion.div className="flex justify-center items-center -mb-16 relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 150 }}
      >
        {modelo ? (
          <>
            <img
              src={modelo.imagen}
              alt="Modelo elegido"
              className={`w-32 h-32 rounded-xl shadow-2xl object-cover border-4 border-pink-500 transition-opacity duration-300 ${subiendo ? "opacity-50" : "opacity-100"}`}
            />
            {subiendo && (
              <div className="absolute w-32 h-32 flex items-center justify-center bg-black/50 rounded-xl text-white font-bold text-sm">
                ⏳ Subiendo...
              </div>
            )}
          </>
        ) : (
          <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-pink-400 rounded-xl bg-white/10 shadow-inner">
            <img src="/placeholder.png" alt="Sin imagen" className="w-12 h-12 opacity-60" />
          </div>
        )}
      </motion.div>

      {/* Botones */}
  
{/* Botones */}
<button
  onClick={abrirSelector}
  disabled={subiendo} // deshabilita mientras sube
  className={`mt-20 w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform ${subiendo ? "opacity-50 cursor-not-allowed" : ""}`}
>
  {subiendo ? "⏳ Cargando..." : "2️⃣ Subí una imagen de referencia"}
</button>

      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      <button
        onClick={continuarSinImagen}
        className="mt-4 w-full bg-gradient-to-r from-pink-700 to-fuchsia-600 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform"
      >
        3️⃣ Continuá sin elegir imagen
      </button>
    </div>
  );
}
