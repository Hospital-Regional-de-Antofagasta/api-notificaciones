const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificacionesPersonalizadas = mongoose.model("notificaciones_personalizadas", new Schema({
    idOneSignal: { type: String, required: true, unique: true },
    tituloEs: { type: String, required: true },
    mensajeEs: { type: String, required: true },
    tituloEn: { type: String, required: true },
    mensajeEn: { type: String, required: true },
    rutPaciente: { type: String, required: true },
    //Estados posibles:
    //  ENVIADA: Enviada por OneSignal
    //  RECIBIDA: Recibida por el paciente
    //  ABIERTA: Abierta por el paciente
    estado: { type: String, required: true },
    deletedAt: { type: Date, required: false },
    fechaCreacion: { type: Date, required: true },
    leida: { type: Boolean, required: true },
}));

module.exports = NotificacionesPersonalizadas;