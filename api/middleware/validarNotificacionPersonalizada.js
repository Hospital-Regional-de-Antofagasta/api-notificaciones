const NotificacionPersonalizadas = require("../models/NotificacionesPersonalizadas");
const { getMensajes } = require("../config");
const { handleError, sendCustomError } = require("../utils/errorHandler");
const { isObjectEmpty } = require("../utils/utils");

exports.validarBodyNoVacio = async (req, res, next) => {
  try {
    if (isObjectEmpty(req.body))
      return res
        .status(400)
        .send({ respuesta: await getMensajes("badRequest") });

    next();
  } catch (error) {
    await handleError(res, error);
  }
};

exports.validarBodyNotificacion = async (req, res, next) => {
  try {
    const { estado, leida, fijada } = req.body;

    if (!["undefined", "boolean"].includes(typeof leida))
      return await sendCustomError(res, 400, "badRequest", {
        leida: `El valor de leida '${leida}' no es válido.`,
      });

    if (!["undefined", "boolean"].includes(typeof fijada))
      return await sendCustomError(res, 400, "badRequest", {
        fijada: `El valor de fijada '${fijada}' no es válido.`,
      });

    next();
  } catch (error) {
    await handleError(res, error);
  }
};

exports.validarNotificacionExiste = async (req, res, next) => {
  try {
    const rutPaciente = req.rutPaciente;
    const { idOneSignal } = req.params;

    const notificacion = await NotificacionPersonalizadas.findOne({
      rutPaciente,
      idOneSignal,
    }).exec();

    if (!notificacion)
      return res
        .status(400)
        .send({ respuesta: await getMensajes("badRequest") });

    next();
  } catch (error) {
    await handleError(res, error);
  }
};
