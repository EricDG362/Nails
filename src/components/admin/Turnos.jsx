import {  useNavigate } from "react-router";





const Turnos = () => {

  const navi = useNavigate()

  const verTurnos =() => {
navi('/verturnos')
  }

    const Gestion =() => {
navi('/gestiondias')
    
  }
      const Salir =() => {
navi('/')
    
  }



    return (

      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
        <h2 className="text-3xl font-bold text-bordo mb-8">Turnos</h2>
        <div className="flex flex-col gap-6">

          <button
            onClick={verTurnos}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition"
          >
            Ver Turnos
          </button>

          <button
            onClick={Gestion}
            className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition"
          >
            Gestionar Días
          </button>

           <button
            onClick={Salir}
            className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition"
          >
           Salir
          </button>
        </div>
      </div>
    );
  

 
};

export default Turnos;
