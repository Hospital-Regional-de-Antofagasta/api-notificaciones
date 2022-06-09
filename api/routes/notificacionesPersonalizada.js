const express = require("express");
const isAuthenticated = require("../middleware/auth");
const notificacionesPersonalizadaController = require("../controllers/notificacionesPersonalizadaController");
const router = express.Router();

router.get(
  "/",
  isAuthenticated,
  notificacionesPersonalizadaController.getNotificaciones
);

module.exports = router;
