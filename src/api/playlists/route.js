const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    handler: handler.postPlaylistsHandler,
  },
  {
    method: "GET",
    path: "/playlists",
    handler: handler.getPlaylistsHandler,
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: handler.deletePlaylistsByIdHandler,
  },
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: handler.postPlaylistsByIdHandler,
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: handler.getPlaylistsByIdHandler,
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: handler.deleteSongfromPlaylistsByIdHandler,
  },
];

module.exports = routes;
