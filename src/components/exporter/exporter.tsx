import React from 'react';
import { fetchAllPlaylists } from '../../api/playlists';
import { SimplifiedPlaylist } from '../../interfaces/spotify/playlists';
import { PlaylistCard } from '../playlist-card/playlist-card';
import './exporter.scss';

export class Exporter extends React.Component<{}, {}> {
  private playlists: Array<SimplifiedPlaylist> = [];

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    fetchAllPlaylists()
      .then(playlists => {
        this.playlists = playlists;
        this.setState({});
      })
      .catch(error => console.log(error));
  }

  render() {
    return <div className="exporter-content">
      <header>
        <h1>Export playlists</h1>
      </header>
      <section className="playlists">
        {this.playlists.map(playlist =>
          <div className="playlist-card-container" key={playlist.id}>
            <PlaylistCard playlist={playlist} />
          </div>)}
      </section>
      <footer>
        <a href="https://github.com/TSpierings/spotify-playlist-exporter">Github</a> | <a href="/" onClick={() => localStorage.clear()}>Logout</a>
      </footer>
    </div>;
  }
}
