const app = require("../api/app");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const supertest = require("supertest");
const NotificacionesPersonalizadas = require("../api/models/NotificacionesPersonalizadas");
const notificacionesPersonalizadasSeeds = require("./testSeeds/notificacionesPersonalizadasSeeds.json");
const ConfigApiNotificaciones = require("../api/models/ConfigApiNotificaciones");
const configSeed = require("./testSeeds/configSeed.json");
const { getMensajes } = require("../api/config");

const request = supertest(app);

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
  await NotificacionesPersonalizadas.create(notificacionesPersonalizadasSeeds);
  await ConfigApiNotificaciones.create(configSeed);
});

afterEach(async () => {
  await NotificacionesPersonalizadas.deleteMany();
  await ConfigApiNotificaciones.deleteMany();
  await mongoose.connection.close();
});

describe("Endpoints notificaciones personalizadas", () => {
  describe("GET /v1/notificaciones-personalizadas", () => {
    it("Intenta obtener notificaciones de un paciente sin token", async () => {
      const respuesta = await request.get("/v1/notificaciones-personalizadas");

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
    it("Intenta obtener notificaciones de un paciente sin notificaciones", async () => {
      const respuesta = await request
        .get("/v1/notificaciones-personalizadas")
        .set("Authorization", tokenUsuarioSinDatos);

      expect(respuesta.status).toBe(200);
      expect(respuesta.body).toEqual([]);
    });
    it("Intenta obtener notificaciones de un paciente", async () => {
      const respuesta = await request
        .get("/v1/notificaciones-personalizadas")
        .set("Authorization", token);

      const notificaciones = respuesta.body;

      expect(respuesta.status).toBe(200);
      expect(notificaciones.length).toBe(4);

      /* Se verifica que vengan ordenadas */
      expect(Date.parse(notificaciones[0].fechaCreacion)).toBe(
        Date.parse("2021-05-02T14:21:01.643Z")
      );
      expect(Date.parse(notificaciones[1].fechaCreacion)).toBe(
        Date.parse("2021-01-02T14:21:01.643Z")
      );
      expect(Date.parse(notificaciones[2].fechaCreacion)).toBe(
        Date.parse("2022-01-18T14:21:01.643Z")
      );
      expect(Date.parse(notificaciones[3].fechaCreacion)).toBe(
        Date.parse("2020-01-03T14:21:01.643Z")
      );

      expect(notificaciones[0]._id).toBeFalsy();
      expect(notificaciones[0].idOneSignal).toBe("22222222");
      expect(notificaciones[0].correlativo).toBeFalsy();
      expect(notificaciones[0].tituloEs).toBe("TITULO ES2");
      expect(notificaciones[0].mensajeEs).toBe("Mensaje ES2");
      expect(notificaciones[0].tituloEn).toBeFalsy();
      expect(notificaciones[0].mensajeEn).toBeFalsy();
      expect(notificaciones[0].rutPaciente).toBeFalsy();
      expect(notificaciones[0].estado).toBeFalsy();
      expect(notificaciones[0].leida).toBe(true);
      expect(notificaciones[0].fijada).toBe(true);
      expect(notificaciones[0].codigoEstablecimiento).toBe("HRA");
      expect(notificaciones[0].nombreEstablecimiento).toBe(
        "Hospital Regional Antofagasta Dr. Leonardo Guzmán"
      );
      expect(notificaciones[0].__v).toBeFalsy();
      expect(notificaciones[0].deletedAt).toBeFalsy();
    });
  });
});
