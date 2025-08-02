const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapSongsInPlaylistDBToModel } = require("../../utils/index");
class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = "playlist-" + nanoid(16);
    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Tidak dapat menambah Playlist");
    }
    return result.rows[0].id;
  }

  async getPlaylist(id) {
    const query = {
      text: `
      SELECT playlists.id, playlists.name, users.username
      FROM playlists
      INNER JOIN users ON playlists.owner = users.id
      WHERE playlists.owner = $1
    `,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Anda belum memiliki Playlists");
    }
    return result.rows;
  }

  async deletePlaylist(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
    return result.rows;
  }

  async addSongToPlaylist({ playlistId, songId }) {
    const id = "song-" + nanoid(16);
    const query = {
      text: `INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id`,
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Lagu tidak dapat ditambahkan ke Playlist");
    }
    return result.rows;
  }

  async getSongInPlaylist(id) {
    const query = {
      text: `
     SELECT 
  playlists.id AS playlist_id,
  playlists.name AS playlist_name,
  users.username AS owner_username,
  songs.id AS song_id,
  songs.title,
  songs.performer
FROM playlists
JOIN users ON playlists.owner = users.id
JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
JOIN songs ON playlist_songs.song_id = songs.id
WHERE playlists.id = $1;

    `,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = mapSongsInPlaylistDBToModel(result.rows);
    return playlist;
  }
}
module.exports = PlaylistsService;
