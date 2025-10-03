
import { motion } from "framer-motion"



const ModalConfirmacion = ({ visible, datosTurno, onCerrar }) => {
  if (!visible || !datosTurno) return null;

  const { nombre, fecha, hora, urlImagen } = datosTurno;

  const avisarYesica = () => {
    const mensaje = `📅 ${nombre} confirmó un turno:\n- Día: ${fecha}\n- Hora: ${hora} hs\n- Modelo: ${urlImagen ? urlImagen : "No hay imagen"}`;
    window.open(`https://wa.me/5493512364203?text=${encodeURIComponent(mensaje)}`, "_blank");
    if (onCerrar) onCerrar();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center backdrop-blur-sm bg-black/50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-200 text-center">
        
        <p className="text-gray-600 mb-6">
          Tu turno fue agendado para el <b>{fecha}</b> a las <b>{hora} hs</b>.
        </p>

        {urlImagen && (
          <img
            src={urlImagen}
            alt="Modelo elegido"
            className="w-24 h-24 mx-auto rounded-full mb-4 border-2 border-pink-500"
          />
        )}

           <div className="text-5xl mb-2">😊❤️</div>
           <div>
        <h2 className="text-2xl flex flex-col font-bold text-gray-800 mb-3">¡Gracias {nombre}! <span className="text-sm">...solo queda avisar a Yesica 🔽</span></h2></div>
<div className="flex justify-center">
       <motion.button
  onClick={avisarYesica}
  className="bg-green-600 text-white font-bold px-4 py-4 rounded-2xl shadow-lg flex items-center gap-2"
  animate={{
    scale: [1, 1.1, 1], // se agranda y achica
    opacity: [1, 0.7, 1] // parpadeo leve
  }}
  transition={{
    duration: 1, // velocidad de la animación
    repeat: Infinity, // animación infinita
    ease: "easeInOut"
  }}
>
  <p className="text-2xl"> Avisar a Yesica ➡️📱</p>

</motion.button>
</div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;
