const client_id = import.meta.env.VITE_CLIENT_ID;
const redirect_uri = import.meta.env.VITE_REDIRECT_URL;
const scope =
  'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public user-library-read';

export function generateCodeVerifier(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const handleLogin = async () => {
  const verifier = generateCodeVerifier(128);
  localStorage.setItem('verifier', verifier);
  const challenge = await generateCodeChallenge(verifier);

  const params = new URLSearchParams();
  params.append('client_id', client_id);
  params.append('response_type', 'code');
  params.append('redirect_uri', redirect_uri);
  params.append('scope', scope);
  params.append('code_challenge_method', 'S256');
  params.append('code_challenge', challenge);
  params.append('show_dialog', true);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const getAccessToken = async code => {
  const verifier = localStorage.getItem('verifier');
  const params = new URLSearchParams();
  params.append('client_id', client_id);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirect_uri);
  params.append('code_verifier', verifier);

  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: params,
  });

  const {access_token} = await result.json();
  access_token ? localStorage.setItem('access_token', access_token) : null;
  return access_token;
};

export async function fetchProfile(token) {
  const result = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {Authorization: `Bearer ${token}`},
  });

  if (result.status === 200) {
    return await result.json();
  }
  if (result.status === 401) {
    return null;
  }
}

async function fetchWebApi(endpoint, method, body) {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body),
  });
  return await res.json();
}

export async function getLikedSongsCount() {
  const res = await fetchWebApi(`v1/me/tracks?limit=1&offset=0`, 'GET');
  if (res) {
    return res.total;
  }
}

// export async function getLikedTracks() {
//   let offset = 0;
//   const res = await fetchWebApi(`v1/me/tracks?limit=50&offset=${offset}`, 'GET');
//   const totalCount = Math.ceil(res.total / res.limit) - 1;
//   let savedSongs = res.items;
//   for (var i = 1; i <= totalCount; i++) {
//     offset = offset + 50;
//     const response = await fetchWebApi(`v1/me/tracks?limit=50&offset=${offset}`, 'GET');
//     let merged = savedSongs.concat(response.items);
//     savedSongs = merged;
//   }
//   return savedSongs;
// }

export async function getLikedTracks(offset) {
  const res = await fetchWebApi(`v1/me/tracks?limit=50&offset=${offset}`, 'GET');
  return {tracks: res.items, next: res.next};
  return res.items;
}

export async function cloneLikedSongs(userId) {
  let savedSongs = await getLikedTracks();
  const body = {
    name: 'liked songs(hazelnut)',
    description: 'playlist created using hazelnut',
    public: true,
  };
  const res = await fetchWebApi(`v1/users/${userId}/playlists`, 'POST', body);
  const playlistId = res.id;

  let songToBeAdded = [];
  for (var i = 0; i < savedSongs.length; i++) {
    songToBeAdded = songToBeAdded.concat(savedSongs[i].track.uri);
  }

  const batchOfArrays = [];
  for (let i = 0; i < songToBeAdded.length; i += 100) {
    const chunk = songToBeAdded.slice(i, i + 100);
    batchOfArrays.push(chunk);
  }

  for (var c = 0; c < batchOfArrays.length; c++) {
    const bodyy = {uris: batchOfArrays[c]};
    const response = await fetchWebApi(`v1/playlists/${playlistId}/tracks`, 'POST', bodyy);
  }
}

export async function getPlaylists() {
  let offset = 0;
  const res = await fetchWebApi(`v1/me/playlists?limit=50&offset=${offset}`, 'GET');
  const totalCount = Math.ceil(res.total / res.limit) - 1;
  let playlists = res.items;
  for (var i = 1; i <= totalCount; i++) {
    offset = offset + 50;
    const response = await fetchWebApi(`v1/me/playlists?limit=50&offset=${offset}`, 'GET');
    let merged = playlists.concat(response.items);
    playlists = merged;
  }
  return playlists;
}

export async function getPlaylistItems(playlistId) {
  let offset = 0;
  const res = await fetchWebApi(
    `v1/playlists/${playlistId}/tracks?limit=50&offset=${offset}`,
    'GET'
  );
  const totalCount = Math.ceil(res.total / res.limit) - 1;
  let playlists = res.items;
  for (var i = 1; i <= totalCount; i++) {
    offset = offset + 50;
    const response = await fetchWebApi(
      `v1/playlists/${playlistId}/tracks?limit=50&offset=${offset}`,
      'GET'
    );
    let merged = playlists.concat(response.items);
    playlists = merged;
  }
  return playlists;
}

export async function clonePlaylist(userId, playlistId, playlistName, ownerName) {
  const body = {
    name: `${playlistName} (hazelnut version)`,
    description: `playlist cloned from '${playlistName} by ${ownerName}'`,
    public: true,
  };
  const newPlaylist = await fetchWebApi(`v1/users/${userId}/playlists`, 'POST', body);
  if (newPlaylist.id) {
    let playlistItems = await getPlaylistItems(playlistId);
    let playlistItemsUri = playlistItems.map(playlistItem => playlistItem.track.uri);
    const bodyy = {
      uris: playlistItemsUri,
    };
    const updatedPlaylist = await fetchWebApi(
      `v1/playlists/${newPlaylist.id}/tracks`,
      'POST',
      bodyy
    );
  }
}
