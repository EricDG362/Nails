import { useTurnoStore } from "../store/TurnoStore";
import { useState, useRef, useEffect } from "react";

export default function ElegirModelo({ onNext }) {
  const modelo = useTurnoStore((state) => state.modelo);
  const setModelo = useTurnoStore((state) => state.setModelo);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setModelo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const abrirSelector = () => {
    fileInputRef.current.click();
  };

  // ✅ Sincronizamos preview con el store
  useEffect(() => {
    if (!modelo) {
      setPreview(null);
    }
  }, [modelo]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-300">
        Subí una foto de algún modelo que te haya gustado o quieras hacerte 💅
      </h2>

      {/* Input oculto */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Botón personalizado */}
      <button
        onClick={abrirSelector}
        className="bg-pink-500 text-white font-semibold px-6 py-4 mt-7 rounded-lg shadow-md hover:bg-pink-600 transition"
      >
        📷 Elegir archivo
      </button>

      {/* Vista previa */}
      {preview && (
        <div className="mt-4 mb-30">
          <img
            src={preview}
            alt="Modelo elegido"
            className="w-30 h-40 rounded-lg shadow-lg"
          />
        </div>
      )}

      <h3 className="pt-6">¡O continuar sin subir imagen! ➡️</h3>
    </div>
  );
}
