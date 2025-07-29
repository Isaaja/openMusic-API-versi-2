"use strict";

const Hapi = require("@hapi/hapi");
require("dotenv").config();
const albums = require("./api/albums");
const AlbumService = require("./service/postgres/AlbumsService");
const songs = require("./api/songs");
const SongsService = require("./service/postgres/SongsService");
const ClientError = require("./exceptions/ClientError");
const AlbumValidator = require("./validator/albums");
const SongsValidator = require("./validator/songs");

const init = async () => {
  const albumsService = new AlbumService();
  const songsService = new SongsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumValidator,
    },
  });

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  });

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (!response.isBoom) {
      return h.continue;
    }

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (response.output?.statusCode === 404) {
      return h
        .response({
          status: "fail",
          message: "Halaman tidak ditemukan",
        })
        .code(404);
    }

    const newResponse = h.response({
      status: "error",
      message: "Terjadi kegagalan pada server kami.",
    });
    newResponse.code(500);
    console.error(response);
    return newResponse;
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
