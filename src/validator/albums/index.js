const { AlbumPayloadSchema } = require("./schema");
const invariantError = require("../../exceptions/InvariantError");

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new invariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;
