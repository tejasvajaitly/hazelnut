import './App.css';
import {useEffect, useState} from 'react';
import {
  handleLogin,
  getAccessToken,
  fetchProfile,
  getSaveddTracks,
  createNewPlaylist,
} from './utils';

function App() {
  const [currentUser, setCurrentuser] = useState(null);
  const [savedSongs, setSavedSongs] = useState(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const authFlow = async () => {
      if (localStorage.getItem('access_token')) {
        const profile = await fetchProfile(localStorage.getItem('access_token'));
        console.log(profile);
        if (!profile) {
          localStorage.removeItem('access_token');
        }
        setCurrentuser(profile);
      } else {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
          const accessToken = await getAccessToken(code);
          const profile = await fetchProfile(accessToken);
          setCurrentuser(profile);
        }
      }
    };
    authFlow();
  }, []);

  const handleGetSavedSongs = async () => {
    const res = await getSaveddTracks(offset);
    console.log(res, 'savedSongs');
    setSavedSongs(res);
  };

  const handleCreateNewPlaylist = async () => {
    const userId = currentUser.uri.split(':')[2];
    const res = await createNewPlaylist(userId, savedSongs);
  };

  return (
    <>
      {!currentUser ? (
        <button onClick={handleLogin}>login with spotify</button>
      ) : (
        <>
          <img src={currentUser.images[0].url} alt={currentUser.display_name} />
          <h1>{`Welcome ${currentUser?.display_name}`}</h1>
          <p>{currentUser?.email}</p>
          <button onClick={handleGetSavedSongs}>get your liked songs</button>
          <button onClick={handleCreateNewPlaylist}>get them in a new playlist</button>
          {savedSongs ? (
            <div>
              <div>
                {savedSongs.map(savedSong => {
                  return <p>{` ${savedSong.track.name}`}</p>;
                })}
              </div>
              <div></div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}

export default App;
