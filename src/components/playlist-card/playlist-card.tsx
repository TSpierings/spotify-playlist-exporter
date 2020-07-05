import * as React from 'react';
import { isNullOrUndefined } from 'util';
import { fetchPlaylistItems } from '../../api/playlists';
import { Trackitem } from '../../interfaces/exporter/trackItem';
import { SimplifiedPlaylist } from '../../interfaces/spotify/playlists';
import { Wrapper } from '../../interfaces/spotify/wrapper';
import './playlist-card.scss';

enum ExportState {
  Initial,
  Exporting,
  Done
}

interface PlaylistCardProps {
  playlist: SimplifiedPlaylist;
}

interface PlaylistCardState {
  progress: number;
  exportState: ExportState;
}

export class PlaylistCard extends React.Component<PlaylistCardProps, PlaylistCardState> {
  private csvRef: React.RefObject<HTMLAnchorElement>;
  private jsoNRef: React.RefObject<HTMLAnchorElement>;

  constructor(props: PlaylistCardProps) {
    super(props);

    this.csvRef = React.createRef();
    this.jsoNRef = React.createRef();

    this.state = {
      progress: 0,
      exportState: ExportState.Initial
    }
  }

  export() {
    this.fetchAllPlaylistItems()
      .then(async response => {
        const tracks = response.map(item => item.track);

        this.createJsonLink(tracks);
        this.createCsvLink(tracks);
      })
      .catch(error => console.log(error));
  }

  async fetchAllPlaylistItems(): Promise<Array<any>> {
    try {
      const items: Array<any> = [];
      let response = await fetchPlaylistItems(this.props.playlist.id);
      let data = (await response.json() as Wrapper);
      items.push(...data.items);

      this.setState({
        progress: items.length,
        exportState: ExportState.Exporting
      });

      while (!isNullOrUndefined(data.next)) {
        response = await fetchPlaylistItems(this.props.playlist.id, data.offset + 100);
        data = (await response.json() as Wrapper);
        items.push(...data.items);

        this.setState({
          progress: items.length
        });
      }

      this.setState({
        exportState: ExportState.Done
      });

      return Promise.resolve(items);
    }
    catch (error) {
      return await Promise.reject(error);
    }
  }

  createJsonLink(data: Array<Trackitem>) {
    const formattedData = data.map(item => {
      return {
        track: item.name,
        album: item.album.name,
        artists: item.artists.map(artist => artist.name)
      }
    });

    const name = this.props.playlist.name.replace(/ /g, "_");
    const blob = new Blob([JSON.stringify(formattedData)], { type: 'text/json' });
    this.jsoNRef.current!.href = URL.createObjectURL(blob);
    this.jsoNRef.current!.download = `${name}.json`
  }

  createCsvLink(data: Array<Trackitem>) {
    let formattedData = data.map(item => {
      const track = item.name.replace(/,/g, "");
      const album = item.album.name.replace(/,/g, "");
      const artists = item.artists.map(artist => artist.name.replace(/,/g, ""));
      return `${track},${album},${artists.join(';')}`;
    });

    // Add headers
    formattedData = ['track,album,artists', ...formattedData];

    const name = this.props.playlist.name.replace(/ /g, "_");
    const blob = new Blob([formattedData.join('\n')], { type: 'text/csv' });
    this.csvRef.current!.href = URL.createObjectURL(blob);
    this.csvRef.current!.download = `${name}.csv`
  }

  render() {
    switch (this.state.exportState) {
      case ExportState.Initial:
        return <div className="playlist-card initial" style={
          {
            backgroundImage: `url(${this.props.playlist.images[0].url})`
          }}
          onClick={() => this.export()}>
          <span>{this.props.playlist.name}</span>
        </div>
      case ExportState.Exporting:
        return <div className="playlist-card exporting">
          <span>{this.state.progress} of {this.props.playlist.tracks.total}</span>
        </div>
      case ExportState.Done:
        return <div className="playlist-card done">
          <span>{this.props.playlist.name}</span>
          <div className="links">
            <a ref={this.csvRef}>CSV</a>
            <a ref={this.jsoNRef}>JSON</a>
          </div>
        </div>
    }
  }
}
