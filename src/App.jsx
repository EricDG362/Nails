import { Routes, Route } from "react-router";
import "./App.css";
import TurnoWizar from "./components/pages/TurnoWizar";
import Login from "./components/admin/Login";
import Turnos from './components/admin/Turnos';
import GestionarDias from "./components/admin/Gestionardias";
import VerTurnos from "./components/admin/VerTurnos";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TurnoWizar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/turnos" element={<Turnos />} />
        <Route path="/gestiondias" element={<GestionarDias />} />
        <Route path="/verturnos" element={<VerTurnos />} />


      </Routes>
    </div>
  );
}

export default App;
