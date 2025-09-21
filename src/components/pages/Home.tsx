// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const Home = ({ onNext }) => {
  const [hasLoaded, setHasLoaded] = useState(false); 
  const navi = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setHasLoaded(true);
    }, 100);
  }, []);

return (
  <div
    className="relative w-full h-[110%] mt-8 flex items-center justify-center bg-cover bg-center"
    style={{ backgroundImage: "url('u2.jpg')" }} // tu imagen de fondo
  >
    {/* //desde aca */}
    {/* Imagen de fondo con animación */}
    <div
      className={`absolute top-1/2 w-[95%] h-[40%] bg-cover rounded-2xl bg-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1500 ease-out
        ${hasLoaded ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
      `}
      style={{ backgroundImage: "url('logoyab.png')" }}
    />

    {/* Contenido centrado sobre la imagen */}
    <div className="relative z-10 w-[90%] max-w-xl h-[70%] rounded-2xl flex flex-col justify-between items-center p-6 text-center">
      
      {/* Título arriba */}
      <h1 className="text-5xl bg-black/40 px-5 py-3 rounded-2xl sm:text-5xl font-bold text-pink-400">
        ¡Bienvenidos!
      </h1>

      {/* Botón circular en el medio */}
      <button
        onClick={() => navi("/login")}
        className="self-end w-10 h-10 flex items-center justify-center bg-black text-white rounded-full shadow-md transition hover:scale-105"
      >
        ➜
      </button>

      {/* Botón “Pedir turno” abajo */}
      <button
        onClick={onNext}
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 mb-7 text-2xl rounded-2xl uppercase shadow-md transition"
      >
        Pedir turno
      </button>
    </div>

{/* hasta aca */}

  </div>
);



};

export default Home;
