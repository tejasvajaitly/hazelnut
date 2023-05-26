const client_id = import.meta.env.VITE_CLIENT_ID;
const redirect_uri = import.meta.env.VITE_REDIRECT_URL;
const scope = 'user-read-private user-read-email';

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
