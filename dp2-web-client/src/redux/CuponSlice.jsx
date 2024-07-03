// eslint-disable-next-line import/no-extraneous-dependencies
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    codigo: "",
    fidLocatario: "",
    fidTipoCupon: "",
    sumilla: "",
    descripcionCompleta: "",
    fechaExpiracion: "",
    terminosCondiciones: "",
    esLimitado: "",
    costoPuntos: "",
    cantidadInicial: "",
    cantidadDisponible: "",
    ordenPriorizacion: "",
    rutaFoto: "",
}

export const CuponSlice = createSlice({
    name: "Cupon",
    initialState,
    reducers: {

    addDatosCupon: (state, action) => {
        const {
        codigo,
        fidLocatario,
        fidTipoCupon,
        sumilla,
        descripcionCompleta,
        fechaExpiracion,
        terminosCondiciones,
        esLimitado,
        costoPuntos,
         cantidadInicial,
        cantidadDisponible,
        ordenPriorizacion,
        rutaFoto,
        } = action.payload;
            state.codigo=codigo;
            state.fidLocatario=fidLocatario;
            state.fidTipoCupon=fidTipoCupon;
            state.sumilla=sumilla;
            state.descripcionCompleta=descripcionCompleta;
            state.fechaExpiracion=fechaExpiracion;
            state.terminosCondiciones=terminosCondiciones;
            state.esLimitado=esLimitado;
            state.costoPuntos=costoPuntos;
            state.cantidadInicial=cantidadInicial;
            state.cantidadDisponible=cantidadDisponible;
            state.ordenPriorizacion=ordenPriorizacion;
            state.rutaFoto=rutaFoto;
        },

        addIdCupon: (state, action) => {
            state.idCupon = action.payload;
        },
    }


});

export const { addDatosCupon, addIdCupon } = CuponSlice.actions;
export default CuponSlice.reducer;