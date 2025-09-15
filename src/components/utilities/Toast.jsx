import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Importar los estilos

const Toast = () => {
  return (
    <ToastContainer
    position="bottom-center"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={true}
    closeButton={true}
    rtl={false}
    style={{
      backgroundColor: '#000',   // Fondo más claro para los toasts
      color: '#fff',             // Texto en blanco
      borderRadius: '5px',       // Bordes redondeados
      padding: '10px'            // Añadir algo de espacio
    }}
  />
  )
}

export default Toast