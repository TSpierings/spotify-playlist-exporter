import React from 'react';
import './exporter.scss';
import { fetchPlaylists, fetchAllPlaylists } from '../../api/playlists';

export class Exporter extends React.Component<{}, {}> {

  componentDidMount() {
    fetchAllPlaylists()
      .then(playlists => console.log(playlists))
      .catch(error => console.log(error));
  }

  render() {
    return <div className="exporter-content">
    <header>
      <h1>Export playlists</h1>
    </header>
  </div>;
  }
}
