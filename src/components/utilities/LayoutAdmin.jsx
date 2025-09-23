// LayoutAdmin.jsx
import { Outlet, useNavigate, useLocation } from "react-router";
import { Home, Calendar, ShoppingBag, LogOut } from "lucide-react";

const LayoutAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const botones = [
    { icon: <Home />, label: "Dias", path: "/gestiondias" },
    { icon: <Calendar />, label: "Turnos", path: "/verturnos" },
    { icon: <ShoppingBag />, label: "Catálogo", path: "/gestioncatalogo" },
    { icon: <LogOut />, label: "Salir", path: "/" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Contenido de la pantalla con margen inferior para no tapar la barra */}
      <div className="flex-1 overflow-auto pb-15">
        <Outlet />
      </div>

      {/* Barra fija abajo solo para admin */}
      <div className="fixed bottom-0 left-0 w-full bg-pink-200 border-t border-gray-200 flex justify-around py-3 shadow-lg rounded-tl-4xl rounded-tr-4xl">
        {botones.map((btn) => (
          <button
            key={btn.label}
            onClick={() => navigate(btn.path)}
            className={`flex flex-col items-center justify-center ${
              location.pathname.startsWith(btn.path)
                ? "text-pink-500"
                : "text-gray-500"
            }`}
          >
            {btn.icon}
            <span className="text-xs mt-1">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutAdmin;
