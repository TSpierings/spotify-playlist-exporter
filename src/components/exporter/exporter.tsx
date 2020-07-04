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
      {this.playlists.map(playlist => 
        <div className="playlist-card-container" key={playlist.id}>
          <div className="playlist-card" style={
          {
            backgroundImage: `url(${playlist.images[0].url})`
          }}>
            <span>{playlist.name}</span>
          </div>
        </div>
      )}
    </section>
  </div>;
  }
}
