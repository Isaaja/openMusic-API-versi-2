const routes = (handler) => [
  {
    method: "GET",
    path: "/users",
    handler: handler.postUserHandler,
  },
];

module.exports = routes;
