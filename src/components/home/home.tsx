import React from 'react';
import { authenticate } from '../../api/authentication';
import './home.scss';

export class Home extends React.Component<{}, {}> {
  render() {
    return <div className="content">
      <header>
        <h1>Spotify Playlist Exporter</h1>
      </header>
      <section className="info">
        <p>This application requires permission to search the spotify library for tracks/artists/genres. For that we require your authorization.</p>
        <p>By clicking the button below, you will be redirected to Spotify, there you need to login and authorize the app for the mentioned permissions.</p>
      </section>
      <section className="authorization">
        <button onClick={() => authenticate()}>Click here to authenticate Spotify</button>
      </section>   
    </div>;
  }
}
