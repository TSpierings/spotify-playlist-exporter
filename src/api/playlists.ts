import { isNullOrUndefined } from "util";
import { Wrapper } from "../interfaces/spotify/wrapper";
import { SimplifiedPlaylist } from "../interfaces/spotify/playlists";

/**
 * Fetch the current user's playlists.
 * Uses a 50 playlist limit.
 * https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-get-a-list-of-current-users-playlists
 * @offset An offset to get the user's playlist after the initial 50.
 */
export function fetchPlaylists(offset: number = 0): Promise<Response> {
  const accessToken = localStorage.getItem('access_token');

  if (isNullOrUndefined(accessToken)) {
    return Promise.reject('Access token not found')
  }
  
  const apiUri = 'https://api.spotify.com/v1/me/playlists';
  const request = new Request(`${apiUri}?limit=50&offset=${offset}`);
  request.headers.set('Authorization', 'Bearer ' + accessToken);

  return fetch(request);
}

/**
 * Repeatedly call the playlist API to get all playlists of the current user.
 */
export async function fetchAllPlaylists(): Promise<Array<SimplifiedPlaylist>> {
  try {
    const items: Array<SimplifiedPlaylist> = [];
    let response = await fetchPlaylists();    
    let data = (await response.json() as Wrapper);
    items.push(...data.items);

    while (!isNullOrUndefined(data.next)) {
      // await new Promise(resolve => setTimeout(resolve, 1000));
      response = await fetchPlaylists(data.offset + 50);
      data = (await response.json() as Wrapper);
      items.push(...data.items);
    }

    return Promise.resolve(items);
  }
  catch (error) {
    return await Promise.reject(error);
  }
}
