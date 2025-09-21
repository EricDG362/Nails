import { useState, useRef, useEffect } from "react";
import { useTurnoStore } from "../store/TurnoStore";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/BaseFire";

export default function ElegirTecnica({ onNext }) {
  const modelo = useTurnoStore((state) => state.modelo);
  const tipoModelo = useTurnoStore((state) => state.tipoModelo);
  const setModelo = useTurnoStore((state) => state.setModelo);

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
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

    const scrollStep = 1; // velocidad
    const intervalTime = 30; // ms

    autoScrollRef.current = setInterval(() => {
      if (carrusel.scrollLeft >= carrusel.scrollWidth - carrusel.clientWidth) {
        carrusel.scrollLeft = 0; // reinicia al principio
      } else {
        carrusel.scrollLeft += scrollStep;
      }
    }, intervalTime);

    // Pausar cuando el usuario interactúe
    const stopScroll = () => clearInterval(autoScrollRef.current);
    carrusel.addEventListener("mousedown", stopScroll);
    carrusel.addEventListener("touchstart", stopScroll);

    return () => {
      clearInterval(autoScrollRef.current);
      carrusel.removeEventListener("mousedown", stopScroll);
      carrusel.removeEventListener("touchstart", stopScroll);
    };
  }, [productos]);

  // 🔹 Maneja la subida de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setModelo(file, "archivo"); // viene de archivo
    }
  };

  const abrirSelector = () => fileInputRef.current.click();

  // 🔹 Maneja la selección del catálogo
  const seleccionarDelCatalogo = (item) => {
    setModelo(item, "catalogo"); // viene del catálogo
  };

  // 🔹 Continuar sin imagen → limpia selección e input
  const continuarSinImagen = () => {
    setModelo(null, null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onNext();
  };

  return (
    <div className="flex flex-col items-center mt-30 w-full h-full px-6 relative">
      <h2 className="text-2xl font-bold mb-4 text-gray-300 text-center">
        1️⃣ Elegí del catálogo 💅
      </h2>

      {/* Carrusel de catálogo */}
      <div className="w-full mb-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <div
            ref={carruselRef}
            className="flex overflow-x-auto space-x-4 p-2 scrollbar-hide"
          >
            {productos.map((item) => (
              <div
                key={item.id}
                onClick={() => seleccionarDelCatalogo(item)}
                className="flex-shrink-0 w-40 bg-white rounded-lg shadow cursor-pointer hover:scale-105 transition-transform"
              >
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="p-2 text-center">
                  <p className="text-sm font-semibold text-gray-700 truncate">
                    {item.titulo}
                  </p>
                  <p className="text-pink-500 font-bold text-sm">
                    $ {item.precio}
                  </p>
                </div>
              </div>
            ))}
            {productos.length === 0 && (
              <p className="text-gray-500 text-center w-full">
                No hay productos en el catálogo
              </p>
            )}
          </div>
        )}
      </div>

      {/* Vista previa */}
      {modelo && (
        <div className="-mb-18">
          {tipoModelo === "archivo" && modelo instanceof File ? (
            <img
              src={URL.createObjectURL(modelo)}
              alt="Modelo elegido"
              className="w-18 h-18 rounded-lg shadow-lg"
            />
          ) : (
            modelo?.imagen && (
              <img
                src={modelo.imagen}
                alt={modelo.titulo || "Modelo elegido"}
                className="w-18 h-18 rounded-lg shadow-lg"
              />
            )
          )}
        </div>
      )}

      {/* Botón subir imagen */}
      <button
        onClick={abrirSelector}
        className="bg-pink-500 text-white font-semibold px-6 py-4 rounded-lg shadow-md hover:bg-pink-600 transition mb-10 mt-24"
      >
        2️⃣ O subí una imagen de referencia
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* O continuar sin imagen */}
      <button
        onClick={continuarSinImagen}
        className="text-gray-400 underline hover:text-pink-400"
      >
        3️⃣ O continuá sin elegir imagen
      </button>
    </div>
  );
}
