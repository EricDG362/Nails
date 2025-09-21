import { useState } from "react";
import { useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/BaseFire";

const Login = () => {
  const navigate = useNavigate();
  const [mail, setMail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // nuevo estado

  const ingresar = async (e) => {
    e.preventDefault();
    setError("");

    if (!mail || !contrasena) {
      setError("Por favor complete todos los campos.");
      return;
    }

    try {
      setLoading(true); // activamos spinner
      await signInWithEmailAndPassword(auth, mail, contrasena);
      navigate("/turnos");
    } catch (err) {
      console.error(err);
      setError("Email o contraseña incorrectos.");
    } finally {
      setLoading(false); // desactivamos spinner
    }
  };

  const SALIR = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('fondo1.jpg')" }}
    >
      <div
        className="bg-gray-200 p-10 rounded-2xl shadow-2xl w-[90%] justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('fondo.jpg')" }}
      >
        <h2 className="text-4xl font-bold text-bordo mb-6 text-center py-3 bg-pink-200 w-full rounded-2xl">
          Iniciar Sesión
        </h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={ingresar} className="flex flex-col gap-4">
          <label className="font-semibold text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Ingrese su email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none bg-white"
          />

          <label className="font-semibold text-gray-700">Contraseña</label>
          <input
            type="password"
            placeholder="Ingrese su contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none bg-white"
          />

          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg mt-4 transition-all duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={loading} // deshabilitar mientras carga
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
                INGRESANDO...
              </>
            ) : (
              "INGRESAR"
            )}
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
