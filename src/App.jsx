import {useEffect, useContext} from 'react';
import AuthContext from './context/AuthProvider';
import {handleLogin, getAccessToken, fetchProfile} from './utils';
import {Outlet, useNavigate} from 'react-router-dom';
import Navbar from './Navbar';

import './App.css';

function App() {
  const {auth, user, setAuth, setUser} = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const authFlow = async () => {
      if (localStorage.getItem('access_token')) {
        const profile = await fetchProfile(localStorage.getItem('access_token'));
        if (!profile) {
          localStorage.removeItem('access_token');
          setAuth(false);
        }

        setAuth(true);
        setUser(profile);
      } else {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
          const accessToken = await getAccessToken(code);
          const profile = await fetchProfile(accessToken);
          if (profile) {
            setAuth(true);
            setUser(profile);
          } else {
            navigate('/');
          }
        }
      }
    };
    authFlow();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setAuth(false);
    setUser(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto bg-[#121212] p-4 rounded-lg">
        <p>hazelnut</p>
        {!auth ? (
          <button onClick={handleLogin} className="rounded-full px-3 py-1 text-xs">
            login
          </button>
        ) : (
          <div className="flex flex-row gap-4">
            <button onClick={handleLogout} className="rounded-full px-3 py-1 text-xs">
              logout
            </button>
            <div className="rounded-full bg-black p-1 w-8 h-8">
              <img
                className="rounded-full h-full w-full object-cover"
                src={user?.images[0]?.url}
                alt={user?.displayName}
              />
            </div>
          </div>
        )}
      </div>
      <div className="w-full max-w-2xl mx-auto bg-[#121212] p-4 rounded-lg">
        {!auth ? (
          <p className="text-left">
            Don't lose your favorite Spotify playlists ever again! hazelnut lets you clone any
            playlist and make it your own. Preserve the music you love and enjoy it on your terms.
            Simple, user-friendly, and hassle-free. Start cloning now!
          </p>
        ) : (
          <div>
            <Navbar />
            <div>
              <Outlet />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
