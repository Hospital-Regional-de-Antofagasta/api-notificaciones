const ConfigApiNotificaciones = require("./models/ConfigApiNotificaciones");

const mensajesPorDefecto = {
  forbiddenAccess: {
    titulo: "Acceso denegado",
    mensaje: "Su sesión ha expirado.",
    color: "",
    icono: "",
  },
  serverError: {
    titulo: "Error de servidor",
    mensaje: "Ocurrió un error inesperado.",
    color: "",
    icono: "",
  },
  badRequest: {
    titulo: "Datos no validos",
    mensaje: "La solicitud no está bien formada.",
    color: "",
    icono: "",
  },
};

exports.getMensajes = async (tipo) => {
  try {
    const { mensajes } = await ConfigApiNotificaciones.findOne({
      version: 1,
    }).exec();
    if (mensajes) {
      return mensajes[tipo];
    }
    return mensajesPorDefecto[tipo];
  } catch (error) {
    return mensajesPorDefecto[tipo];
  }
};
