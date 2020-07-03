import { isNullOrUndefined } from "util";

/**
 * Fetch the current user's playlists.
 * Uses a 50 playlist limit.
 * https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-get-a-list-of-current-users-playlists
 * @offset An offset to get the user's playlist after the initial 50.
 */
export function fetchAllPlaylists(offset: number = 0): Promise<Response> {
  const accessToken = localStorage.getItem('access_token');

  if (isNullOrUndefined(accessToken)) {
    return Promise.reject('Access token not found')
  }
  
  const apiUri = 'https://api.spotify.com/v1/me/playlists';
  const request = new Request(`${apiUri}?limit=50&offset=${offset}`);
  request.headers.set('Authorization', 'Bearer ' + accessToken);

  return fetch(request);
}
