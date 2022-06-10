const NotificacionPersonalizadas = require("../models/NotificacionesPersonalizadas");
const { getMensajes } = require("../config");
const { handleError } = require("../utils/errorHandler");

exports.getNotificaciones = async (req, res) => {
  try {
    const rutPaciente = req.rutPaciente;
    const notificaciones = await NotificacionPersonalizadas.find({
      rutPaciente,
      deletedAt: null,
    })
      .sort({ fijada: -1, fechaCreacion: -1 })
      .select(
        "-_id -rutPaciente -correlativo -tituloEn -mensajeEn -estado -deletedAt -__v"
      )
      .exec();
    return res.status(200).send(notificaciones);
  } catch (error) {
    await handleError(res, error);
  }
};

exports.updateNotificacion = async (req, res) => {
  try {
    const rutPaciente = req.rutPaciente;
    const { idOneSignal } = req.params;
    const { estado, leida, fijada } = req.body;

    await NotificacionPersonalizadas.updateOne(
      {
        rutPaciente,
        idOneSignal,
      },
      { estado, leida, fijada },
      { runValidators: true }
    ).exec();

    return res.status(200).send({ respuesta: await getMensajes("success") });
  } catch (error) {
    await handleError(res, error);
  }
};
