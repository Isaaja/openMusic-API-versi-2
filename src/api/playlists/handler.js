const autoBind = require("auto-bind");

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistsHandler(request, h) {
    this._validator.validatePostPlaylistsPayload(request.payload);
    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;
    console.log(request.auth.credentials);
    const playlistId = await this._service.addPlaylist({ name, owner: owner });
    const response = h.response({
      status: "success",
      data: {
        playlistId: playlistId,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = PlaylistsHandler;
