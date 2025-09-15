

const ModalConfirmacion = ({ visible, onAceptar }) => {
  if (!visible) return null;



  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center backdrop-blur-sm bg-black/50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-200">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-3">¡Solicitud Recibida!</h2>
        <p className="text-gray-600 mb-6">
          Su turno ha sido agendado.{" "}
          <span className="text-green-600 font-semibold">Muchas Gracias</span>
        </p>
        <button
          onClick={onAceptar}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default ModalConfirmacion;