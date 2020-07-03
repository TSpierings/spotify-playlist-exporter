/**
 * All authentication constants necessary for Spotify's authentication API.
 */
export const AuthenticationDetails = {
  uri: 'https://accounts.spotify.com/authorize',
  clientId: '77d8475d33b74e52880600e79e98691d',
  responseType: 'token',
  redirectUri: 'http://localhost:3000/authenticate',
  scopes: 'playlist-read-private playlist-read-collaborative'
}

/**
 * A redirect to Spotify's authenticate URI with the necessary authentication details.
 */
export function authenticate() {
  window.location.href = `${AuthenticationDetails.uri}?client_id=${AuthenticationDetails.clientId}&response_type=${AuthenticationDetails.responseType}&redirect_uri=${AuthenticationDetails.redirectUri}&scope=${AuthenticationDetails.scopes}`;
}
