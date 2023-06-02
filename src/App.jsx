import './App.css';
import {useEffect, useState} from 'react';
import {
  handleLogin,
  getAccessToken,
  fetchProfile,
  getSaveddTracks,
  createNewPlaylist,
  getPlaylistItems,
} from './utils';
import {useNavigate} from 'react-router-dom';
import {ReactComponent as LeftNav} from '../public/left-nav.svg';
import {ReactComponent as RightNav} from '../public/right-nav.svg';

function App() {
  const [currentUser, setCurrentuser] = useState(null);
  const [savedSongs, setSavedSongs] = useState(null);
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const authFlow = async () => {
      if (localStorage.getItem('access_token')) {
        const profile = await fetchProfile(localStorage.getItem('access_token'));
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
          if (profile) {
            setCurrentuser(profile);
            console.log('lol');
            navigate('/');
          }
        }
      }
    };
    authFlow();
  }, []);

  const handleGetSavedSongs = async () => {
    const res = await getSaveddTracks(offset);
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
        <div className="">
          <nav className="relative bg-[#121212] fixed w-full z-20 top-0 left-0 rounded-lg">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
              <div className="flex flex-row justify-between w-[72px]">
                <NavButton>
                  <LeftNav />
                </NavButton>
                <NavButton>
                  <RightNav />
                </NavButton>
              </div>
              <button className="rounded-full px-3 py-1 text-xs">logout</button>
              <div className="rounded-full bg-black p-1 w-8 h-8">
                <img
                  className="rounded-full h-full w-full object-cover"
                  src={currentUser?.images[0]?.url}
                  alt={currentUser.display_name}
                />
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

export default App;

const NavButton = ({children}) => {
  return (
    <button className="rounded-full bg-[rgba(0,0,0,.7)] w-8 h-8 p-0 flex justify-center items-center">
      {children}
    </button>
  );
};
