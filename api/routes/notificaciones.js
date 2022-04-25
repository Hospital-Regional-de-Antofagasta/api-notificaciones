const express = require("express");
const isAuthenticated = require("../middleware/auth");
const notificacionesController = require("../controllers/notificacionesController");
const router = express.Router();

 router.get(
    "/",
    //isAuthenticated,
    //validarSiPacienteExiste,
    notificacionesController.getNotificaciones
  );

  module.exports = router;