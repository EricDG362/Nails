import { create } from "zustand";

export const useTurnoStore = create((set) => ({
  // Inicializamos valores
  modelo: null,         // Puede ser File o un objeto de catálogo
  tipoModelo: null,     // "archivo" o "catalogo"
  fecha: null,
  hora: null,
  nombre: '',
  whatsapp: '',
  estadoTurno: 'pendiente', // puede ser "pendiente", "confirmado", "rechazado"

  // Setters
  setModelo: (modelo, tipo) => set({ modelo, tipoModelo: tipo }),
  setFecha: (fecha) => set({ fecha }),
  setHora: (hora) => set({ hora }),
  setNombre: (nombre) => set({ nombre }),
  setWhatsapp: (whatsapp) => set({ whatsapp }),
  setEstadoTurno: (estado) => set({ estadoTurno: estado }),

  // Reset
  resetTurno: () =>
    set({
      modelo: null,
      tipoModelo: null,
      fecha: null,
      hora: null,
      nombre: '',
      whatsapp: '',
      estadoTurno: 'pendiente',
    }),
}));
