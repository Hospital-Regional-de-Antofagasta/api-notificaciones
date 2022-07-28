const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificacionesPersonalizadas = mongoose.model(
  "notificaciones_personalizadas",
  new Schema(
    {
      idOneSignal: {
        type: String,
        required: [true, "El idOneSignal es obligatorio."],
        unique: true,
        default: 1,
      },
      correlativo: {
        type: Number,
        required: [true, "El correlativo es obligatorio."],
      },
      tituloEs: {
        type: String,
        required: [true, "El tituloEs es obligatorio."],
      },
      mensajeEs: {
        type: String,
        required: [true, "El mensajeEs es obligatorio."],
      },
      tituloEn: { type: String },
      mensajeEn: { type: String },
      rutPaciente: {
        type: String,
        required: [true, "El rutPaciente es obligatorio."],
      },
      estado: {
        type: String,
        required: [true, "El estado es obligatorio."],
        default: "ENVIADA",
        enum: {
          values: ["ENVIADA", "RECIBIDA", "ABIERTA"],
          message: "El estado '{VALUE}' no es válido.",
        },
      },
      fechaCreacion: {
        type: Date,
        required: [true, "La fechaCreacion es obligatorio."],
      },
      leida: { type: Boolean, default: false },
      fijada: { type: Boolean, default: false },
      codigoEstablecimiento: {
        type: String,
        required: [true, "El codigoEstablecimiento es obligatorio."],
        enum: {
          values: ["HRA"],
          message: "El codigoEstablecimiento '{VALUE}' no es válido.",
        },
      },
      nombreEstablecimiento: {
        type: String,
        required: [true, "El nombreEstablecimiento es obligatorio."],
        enum: {
          values: ["Hospital Regional Antofagasta Dr. Leonardo Guzmán"],
          message: "El nombreEstablecimiento '{VALUE}' no es válido.",
        },
      },
      deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
  )
);

module.exports = NotificacionesPersonalizadas;
