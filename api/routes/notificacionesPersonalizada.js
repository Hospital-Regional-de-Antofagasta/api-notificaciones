const express = require("express");
const isAuthenticated = require("../middleware/auth");
const notificacionesPersonalizadaController = require("../controllers/notificacionesPersonalizadaController");
const router = express.Router();
const {
  validarBodyNoVacio,
  validarBodyNotificacion,
  validarNotificacionExiste,
} = require("../middleware/validarNotificacionPersonalizada");

router.get(
  "/",
  isAuthenticated,
  notificacionesPersonalizadaController.getNotificaciones
);

router.put(
  "/:idOneSignal",
  isAuthenticated,
  validarBodyNoVacio,
  validarBodyNotificacion,
  validarNotificacionExiste,
  notificacionesPersonalizadaController.updateNotificacion
);

module.exports = router;
