const notificacionPersonalizadas = require("../models/NotificacionesPersonalizadas");
const { getMensajes } = require("../config");

exports.getNotificaciones = async (req, res) => {
    
      try {
            const rutPaciente = req.rutPaciente;
            const notificaciones =  await notificacionPersonalizadas.find({rutPaciente: rutPaciente,deletedAt: null }).sort({ fijada: -1, fechaCreacion: -1  }).select('-rutPaciente').exec();
            return res.status(200).send(notificaciones);
      } catch (error) {
      res.status(500).send({ respuesta: await getMensajes("serverError") });
      }

}; 