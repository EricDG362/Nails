import { useState } from "react";
import { motion } from "framer-motion"; //libreria de animaciones
import Home from "./Home";
import ElegirTecnica from "./ElegirTecnica";
import ElegirFechaHora from "./ElegirFechaHora";
import DatosCliente from "./DatosCliente";
import Confirmacion from "./Confirmacion";
import ModalCarga from "../utilities/ModalCarga";
import ModalConfirmacion from "../utilities/ModalConfirmacion ";

import { useTurnoStore } from "../store/TurnoStore";

const TurnoWizar = () => {

//controla el flujo y muestra en q paso o step esta
  const [step, setStep] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [datosTurno, setDatosTurno] = useState(null);

  

  // const turno = useTurnoStore(); // accede a todos los datos del store para el console log
  const resetTurno = useTurnoStore((state) => state.resetTurno); // Trae función para reiniciar turno


  const reiniciarTurno = () => {
    resetTurno();
    setStep(0);
  };

  // ⚠️ Usamos una constante temporal de `stepsLength` para evitar usar `steps` antes de definirlo
  const stepsLength = 5;

//funcion q avanza al siguiente paso
  const next = () => {
    //si el valor de pasos es menor q su alrgo -1 entopnces avanzar uno
    if (step < stepsLength - 1)
       setStep(step + 1)

//     console.log({
//   barbero: turno.barbero,
//   fecha: turno.fecha,
//   hora: turno.hora,
//   nombre: turno.nombre,
//   email: turno.email,
//   whatsapp: turno.whatsapp
// });
  };

  const back = () => {
    if (step > 0)
       setStep(step - 1);
  };


  //arrayu de pasos
//funcion o props q se espera de cada panatalla
  const pantallas = [
    <Home onNext={next} />, //home utiliza el poarametro onNext q ejecuta la funcion Next
    <ElegirTecnica onNext={next} />,
    <ElegirFechaHora onNext={next} />,
    <DatosCliente onNext={next} />,
    <Confirmacion onReset={reiniciarTurno} setCargando={setCargando} setModalConfirmVisible={setModalConfirmVisible}
     setDatosTurno={setDatosTurno}
       />,
  ];


  //modal confirmacion
    const onAceptar = () => {
    setModalConfirmVisible(false); //ocultar
   
  };


  return (
  <>
    <ModalCarga visible={cargando} />

    <ModalConfirmacion visible={modalConfirmVisible}
     onAceptar={onAceptar} 
      datosTurno={datosTurno} 
       onCerrar={() => setModalConfirmVisible(false)}
    />

    <div className="overflow-hidden w-screen h-screen bg-gradient-to-br from-fuchsia-800 via-pink-900 to-rose-900 relative">

      {/* componente de animacion */}
      <motion.div
        className="flex h-full"
        animate={{ x: `-${step * 100}vw` }}
        transition={{ duration: 0.5 }}
        style={{ width: `${pantallas.length * 100}vw` }}
      >
        {pantallas.map((content, index) => (
          <div
            key={index}
            className="w-screen h-screen flex-shrink-0 flex items-center justify-center"
          >
            {content}
          </div>
        ))}
      </motion.div>

      {/* caja de botones */}
      <div className="absolute bottom-24 w-full px-6 flex justify-between">
        {/* botón atrás (oculto en el paso 0) */}
        {step !== 0 ? (
          <button
            onClick={back}
            className="bg-gray-200 text-black font-semibold hover:bg-amber-500 hover:text-black px-4 py-2 rounded disabled:opacity-50"
          >
            Atrás
          </button>
        ) : (
          <div /> // mantiene espacio
        )}

        {/* botón siguiente (oculto en el último paso) */}
   {/* botón siguiente (oculto en el primer y último paso) */}
{step !== 0 && step !== pantallas.length - 1 && (
  <button
    onClick={next}
    disabled={step === pantallas.length - 1}
    className="bg-pink-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-pink-600 disabled:opacity-50"
  >
    {step === 4 ? 'Finalizar' : 'Siguiente'}
  </button>
)}

      </div>
    </div>
  </>
);


};

export default TurnoWizar;
