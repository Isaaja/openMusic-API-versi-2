const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
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
      throw new InvariantError("Playlist tidak ditemukan");
    }
    return result.rows;
  }

  async addSongToPlaylist({}) {
    // const query = {
    //   text:
    // }
  }
}
module.exports = PlaylistsService;
