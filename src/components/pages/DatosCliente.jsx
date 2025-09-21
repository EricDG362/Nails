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
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto mb-16">
      <h2 className="text-4xl font-bold text-center mb-6 text-white tracking-wider font-[Bebas_Neue]">
        INGRESA TUS DATOS
      </h2>

      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
        className="p-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
      />

      <input
        type="tel"
        value={whatsapp}
        onChange={handleWhatsappChange}
        placeholder="WhatsApp (10 dígitos)"
        maxLength={10}
        className="p-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}

    
    </div>
  );
};

export default DatosCliente;
