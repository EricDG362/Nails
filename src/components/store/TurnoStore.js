
import { create } from "zustand";

//es una libreria para manejar los estados globales simple y liviana

export const useTurnoStore = create((set) => ({

  //inicializamos valores
modelo: null, //null xq esperamos mas q un simple string e este caso un objeto
  fecha: null,
  hora: null,
  nombre: '',
  whatsapp: '',
  estadoTurno: 'pendiente', // puede ser "pendiente", "confirmado", "rechazado"

  //seteamos valores
  //reciben un valor y utilizan set par actualizar el estado
 setModelo: (file) => set({ modelo: file }),
  setFecha: (fecha) => set({ fecha }),
  setHora: (hora) => set({ hora }),
  setNombre: (nombre) => set({ nombre }),

  setWhatsapp: (whatsapp) => set({ whatsapp }),
  setEstadoTurno: (estado) => set({ estadoTurno: estado }),


  //limpiar campos o formulario
  //colocarlos en valores iniciales
  resetTurno: () =>
    set({
      modelo: null,
      fecha: null,
      hora: null,
      nombre: '',
      whatsapp: '',
      estadoTurno: 'pendiente',
    }),




}));
