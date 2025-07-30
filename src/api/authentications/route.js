const routes = (handler) => [
  {
    method: "POST",
    path: "/authentications",
    handler: handler.postAuthenticationHandler,
  },
  {
    method: "PUT",
    path: "/authentications",
    handler: handler,
  },
  {
    method: "DELETE",
    path: "/authentications",
    handler: handler,
  },
];

module.exports = routes;
