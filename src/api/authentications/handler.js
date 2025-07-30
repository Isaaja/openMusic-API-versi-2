const autoBind = require("auto-bind");

class AuthenticationsHandler {
  constructor(usersService, tokenManager, authenticationsService, validator) {
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._authenticationsService = authenticationsService;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);
    const { username, password } = request.payload;
    const userId = await this._usersService.verifyUserCredential(
      username,
      password
    );
    const accessToken = this._tokenManager.generateAccessToken({ userId });
    const refreshToken = this._tokenManager.generateRefreshToken({ userId });
    await this._authenticationsService.addRefreshToken(refreshToken);
    const response = h.response({
      status: "success",
      message: "Authentication berhasil ditambahkan",
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = AuthenticationsHandler;
