import { useState } from "react";
import { useNavigate } from "react-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/BaseFire";

const Login = () => {
  const navigate = useNavigate();
  const [mail, setMail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const ingresar = async (e) => {
    e.preventDefault();
    setError("");

    if (!mail || !contrasena) {
      setError("Por favor complete todos los campos.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, mail, contrasena);
      navigate("/turnos");
    } catch (err) {
      console.error(err);
      setError("Email o contraseña incorrectos.");
    }
  };

        const SALIR =() => {

navigate('/')
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-300 via-red-400 to-red-500">
      <div className="bg-gray-200 p-10 rounded-2xl shadow-xl w-[90%]">
        <h2 className="text-3xl font-bold text-bordo mb-6 text-center">Iniciar Sesión</h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={ingresar} className="flex flex-col gap-4">
          <label className="font-semibold text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Ingrese su email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
          />

          <label className="font-semibold text-gray-700">Contraseña</label>
          <input
            type="password"
            placeholder="Ingrese su contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
          />

          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg mt-4 transition-all duration-200 shadow-md"
          >
            INGRESAR
          </button>

           
        </form>

           <button
            onClick={SALIR}
            className="bg-pink-300 w-full mt-4 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-md"
          >
            SALIR
          </button>
      </div>
    </div>
  );
};

export default Login;
