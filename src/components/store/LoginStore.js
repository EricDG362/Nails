import { create } from "zustand";


export const useLoginStore = create((set) =>({

    //inicializamos valores
    mail:"",
    contraseña:"",

    //seteamos valores
setMail: (mail) => set({mail}),
setContraseña: (contraseña) =>set({contraseña}),


//funcion limpia
reset:() => set({

    //limpia los campos
    mail:"",
    contraseña:""

}


)}))