import { useTurnoStore } from "../store/TurnoStore";
import { useState } from "react";

const DatosCliente = ({ onNext }) => {
  const nombre = useTurnoStore((state) => state.nombre);
  const whatsapp = useTurnoStore((state) => state.whatsapp);

  const setNombre = useTurnoStore((state) => state.setNombre);
  const setWhatsapp = useTurnoStore((state) => state.setWhatsapp);

  const [error, setError] = useState("");

  const handleWhatsappChange = (e) => {
    // Solo números
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 10) valor = valor.slice(0, 10);
    setWhatsapp(valor);

    // Validación
    if (valor.length < 10) {
      setError("El número debe tener 10 dígitos completos");
    } else {
      setError("");
    }
  };

  const handleNext = () => {
    if (!nombre.trim()) {
      setError("Debe ingresar su nombre");
      return;
    }
    if (whatsapp.length !== 10) {
      setError("El número debe tener 10 dígitos completos");
      return;
    }
    setError("");
    if (onNext) onNext(); // Avanza a la siguiente pantalla
  };

return (
  <div className="flex flex-col gap-4 p-5 w-[90%] max-w-md mx-auto mb-16 bg-gradient-to-b from-red-100 to-pink-100 rounded-2xl shadow-lg shadow-pink-300/40">
    <h2 className="text-4xl font-bold text-center mb-6 text-pink-600 tracking-wider font-[Bebas_Neue] animate-pulse">
      INGRESA TUS DATOS
    </h2>

    <input
      type="text"
      value={nombre}
      onChange={(e) => setNombre(e.target.value)}
      placeholder="Nombre"
      className="p-3 rounded-lg text-center uppercase  bg-white/40  border-2
       text-pink-800 placeholder-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:shadow-[0_0_10px_rgba(255,105,180,0.5)] transition"
    />

    <input
      type="tel"
      value={whatsapp}
      onChange={handleWhatsappChange}
      placeholder="WhatsApp (10 dígitos)"
      maxLength={10}
      className="p-3 rounded-lg text-center bg-white/40 border-2 text-pink-800 placeholder-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:shadow-[0_0_10px_rgba(255,105,180,0.5)] transition"
    />

    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
  </div>
);








};

export default DatosCliente;
