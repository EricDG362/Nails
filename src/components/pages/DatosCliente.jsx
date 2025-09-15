
import { useTurnoStore } from "../store/TurnoStore";

const DatosCliente = () => {
  const nombre = useTurnoStore((state) => state.nombre);
  const whatsapp = useTurnoStore((state) => state.whatsapp);

  const setNombre = useTurnoStore((state) => state.setNombre);

  const setWhatsapp = useTurnoStore((state) => state.setWhatsapp);

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
    onChange={(e) => setWhatsapp(e.target.value)}
    placeholder="WhatsApp"
    className="p-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
  />


</div>

  );
};

export default DatosCliente;
