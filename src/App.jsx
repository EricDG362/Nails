import { Routes, Route } from "react-router";
import "./App.css";
import TurnoWizar from "./components/pages/TurnoWizar";
import Login from "./components/admin/Login";
import Turnos from './components/admin/Turnos';
import GestionarDias from "./components/admin/Gestionardias";
import VerTurnos from "./components/admin/VerTurnos";
import VerCatalogo from "./components/admin/VerCatalogo";
import LayoutAdmin from "./components/utilities/LayoutAdmin";

function App() {
  return (
    <Routes>
      {/* Pantallas cliente */}
      <Route path="/" element={<TurnoWizar />} />
      <Route path="/login" element={<Login />} />

      {/* Pantallas admin con layout */}
      <Route element={<LayoutAdmin />}>
        <Route path="/turnos" element={<Turnos />} />
        <Route path="/verturnos" element={<VerTurnos />} />
        <Route path="/gestiondias" element={<GestionarDias />} />
        <Route path="/gestioncatalogo" element={<VerCatalogo />} />
      </Route>
    </Routes>
  );
}

export default App;
