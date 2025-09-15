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
    <div className="relative w-[90%] h-[80%] mt-8 flex items-center justify-center">
      {/* Imagen de fondo con animación */}
      <div
        className={`absolute inset-0 bg-cover bg-center transform transition-all duration-1000 ease-out
          ${hasLoaded ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
        `}
        style={{ backgroundImage: "url('u1.jpg')" }}
      />

      {/* Contenido centrado fijo sobre la imagen */}
      <div className="relative bg-black/40 py-8 px-12 w-full max-w-xl rounded-xl text-center z-10">
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          ¡Bienvenidos a <span className="text-pink-300">YESSINAILS!</span>
        </h1>

        <p className="text-lg text-gray-200 mb-8">
          “Donde la belleza empieza en tus manos”
        </p>

        <div className="flex flex-col">
          <button
            onClick={onNext}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-2xl uppercase shadow-md transition mb-3"
          >
            Pedir turno
          </button>

          <button
            onClick={() => navi("/login")}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-2xl uppercase shadow-md transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
