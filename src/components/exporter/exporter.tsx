import React, { useState } from 'react';
import { fetchAllPlaylists, fetchPlaylistItems } from '../../api/playlists';
import { SimplifiedPlaylist } from '../../interfaces/spotify/playlists';
import './exporter.scss';
import { isNullOrUndefined } from 'util';
import { Wrapper } from '../../interfaces/spotify/wrapper';

interface ExporterState {
  currentlyExporting: string | null;
  progress: number;
  total: number;
}

export class Exporter extends React.Component<{}, ExporterState> {
  private playlists: Array<SimplifiedPlaylist> = [];

  constructor(props: any) {
    super(props);

    this.state = {
      currentlyExporting: null,
      progress: 0,
      total: 0
    }
  }

  componentDidMount() {
    fetchAllPlaylists()
      .then(playlists => {
        this.playlists = playlists;
        this.setState({}); 
      })
      .catch(error => console.log(error));    
  }

  export(playlistId: string) {
    // fetchAllPlaylistItems(playlistId)
    //   .then(response => console.log(response))
    //   .catch(error => console.log(error))

    this.fetchAllPlaylistItems(playlistId)
      .then(response => console.log(response))
      .catch(error => console.log(error))
  }

  /**
   * Repeatedly call the playlist item API to get all items of the given playlist.
   */
  async fetchAllPlaylistItems(playlistId: string): Promise<Array<any>> {
    try {
      const items: Array<any> = [];
      let response = await fetchPlaylistItems(playlistId);    
      let data = (await response.json() as Wrapper);
      items.push(...data.items);

      this.setState({
        currentlyExporting: playlistId,
        progress: items.length,
        total: data.total
      });

      while (!isNullOrUndefined(data.next)) {
        // await new Promise(resolve => setTimeout(resolve, 1000));
        response = await fetchPlaylistItems(playlistId, data.offset + 100);
        data = (await response.json() as Wrapper);
        items.push(...data.items);

        this.setState({
          progress: items.length,
        });
      }

      this.setState({
        currentlyExporting: null
      });

      return Promise.resolve(items);
    }
    catch (error) {
      return await Promise.reject(error);
    }
  }

  private calculateBarWidth(): number {
    return this.state.progress / this.state.total * 100;
  }

  render() {
    return <div className="exporter-content">
    <header>
      <h1>Export playlists</h1>
    </header>
    <section className="exporter-bar">
      <p>Currently exporting: {this.state.currentlyExporting ? this.state.currentlyExporting : 'Nothing'}</p>
      <div className="bar-border">
        <div className="bar" style={{width: `${this.calculateBarWidth()}%`}}>
          {this.state.progress} of {this.state.total}
        </div>
      </div>
    </section>
    <section className="playlists">
      {this.playlists.map(playlist => 
        <div className="playlist-card-container" key={playlist.id}>
          <div className="playlist-card" style={
          {
            backgroundImage: `url(${playlist.images[0].url})`
          }}
          onClick={() => this.export(playlist.id)}>
            <span>{playlist.name}</span>
          </div>
        </div>
      )}
    </section>
  </div>;
  }
}
