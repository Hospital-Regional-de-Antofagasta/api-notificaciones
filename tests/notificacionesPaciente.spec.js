const app = require("../api/app");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const supertest = require("supertest");
const notificacionesPersonalizadas = require("../api/models/NotificacionesPersonalizadas");
const notificacionesSeeds = require("./testSeeds/notificacionesSeeds.json");
const configSeed = require("./testSeeds/configSeed.json");
const { getMensajes } = require("../api/config");
const request = supertest(app);
const ConfigApiNotificaciones = require("../api/models/ConfigApiNotificaciones");

const secreto = process.env.JWT_SECRET;

const token = jwt.sign(
  {
    _id: "000000000000",
    rut: "88888888-8",
  },
  secreto
);

const tokenUsuarioSinDatos = jwt.sign(
  {
    _id: "000000000000",
    rut: "33333333-3",
  },
  secreto
);

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI}/notificaciones_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await notificacionesPersonalizadas.create(notificacionesSeeds);
  await ConfigApiNotificaciones.create(configSeed);
});

afterEach(async () => {
  await notificacionesPersonalizadas.deleteMany();
  await ConfigApiNotificaciones.deleteMany();
  await mongoose.connection.close();
});

describe("Endpoints", () => {
  describe("GET /v1/notificaciones/", () => {
    it("Intenta obtener notificaciones de un sin token", async () => {
      const respuesta = await request.get("/v1/notificaciones");

      const mensaje = await getMensajes("forbiddenAccess");

      expect(respuesta.status).toBe(401);
      expect(respuesta.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });

    it("Intenta obtener notificaciones de un paciente con token y sin notificaciones", async () => {
      const respuesta = await request
        .get("/v1/notificaciones")
        .set("Authorization", tokenUsuarioSinDatos);

      const notificaciones = respuesta.body;

      expect(respuesta.status).toBe(200);
      expect(notificaciones).toEqual([]);
    });

    it("Intenta obtener notificaciones de un paciente con token y notificaciones", async () => {
      const respuesta = await request
        .get("/v1/notificaciones")
        .set("Authorization", token);

      const notificaciones = respuesta.body;

      expect(respuesta.status).toBe(200);
      expect(notificaciones.length).toBe(4);

      /* Se verifica que vengan ordenadas */
      expect(Date.parse(notificaciones[0].fechaCreacion)).toBe(
        Date.parse("2021-01-02T14:21:01.643Z")
      );
      expect(Date.parse(notificaciones[1].fechaCreacion)).toBe(
        Date.parse("2003-05-02T14:21:01.643Z")
      );

      expect(notificaciones[0].idOneSignal).toBe("5555555");
      expect(notificaciones[0].tituloEs).toBe("TITULO ES5");
      expect(notificaciones[0].mensajeEs).toBe("Mensaje ES5");
      expect(notificaciones[0].tituloEn).toBe("TITULO EN5");
      expect(notificaciones[0].mensajeEn).toBe("Mensaje EN5");
      expect(notificaciones[0].estado).toBe("ENVIADA");
      expect(notificaciones[0].deletedAt).toBe(null);
      expect(notificaciones[0].leida).toBe(true);
      expect(notificaciones[0].fijada).toBe(true);
      expect(notificaciones[0].codigoEstablecimiento).toBe("HRA");
      expect(notificaciones[0].nombreEstablecimiento).toBe(
        "Hospital Regional Antofagasta Dr. Leonardo Guzmán"
      );

      expect(notificaciones.rutPaciente).toBeFalsy();
    });
  });
});
