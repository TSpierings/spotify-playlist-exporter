import React from 'react';
import { fetchAllPlaylists } from '../../api/playlists';
import { SimplifiedPlaylist } from '../../interfaces/spotify/playlists';
import './exporter.scss';

export class Exporter extends React.Component<{}, {}> {
  private playlists: Array<SimplifiedPlaylist> = [];

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
      {this.playlists.map(playlist => <div className="playlist-card" key={playlist.id}>{playlist.name}</div>)}
    </section>
  </div>;
  }
}
