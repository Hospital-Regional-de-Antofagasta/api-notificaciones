const NotificacionPersonalizadas = require("../models/NotificacionesPersonalizadas");
const { getMensajes } = require("../config");

exports.getNotificaciones = async (req, res) => {
  try {
    const rutPaciente = req.rutPaciente;
    const notificaciones = await NotificacionPersonalizadas.find({
      rutPaciente: rutPaciente,
      deletedAt: null,
    })
      .sort({ fijada: -1, fechaCreacion: -1 })
      .select(
        "-_id -rutPaciente -correlativo -tituloEn -mensajeEn -estado -deletedAt -__v"
      )
      .exec();
    return res.status(200).send(notificaciones);
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
