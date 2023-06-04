import {useEffect, useContext} from 'react';
import AuthContext from './context/AuthProvider';
import {handleLogin, getAccessToken, fetchProfile} from './utils';
import {Outlet, useNavigate} from 'react-router-dom';
import Navbar from './Navbar';
import './App.css';
import {ReactComponent as AvatarIcon} from '../public/avatar-icon.svg';

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
          setUser(null);
          navigate('/');
          console.log(auth, profile, ' this was profile and i guess its null');
        } else {
          setAuth(true);
          setUser(profile);
        }
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
  console.log('render');
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto bg-[#121212] p-4 rounded-lg">
        <p>hazelnut</p>
        {!auth ? (
          <button onClick={handleLogin} className="rounded-full px-3 py-1 text-xs">
            {console.log(auth, 'auth in return ')}
            login with spotify
          </button>
        ) : (
          <div className="flex flex-row gap-4">
            {console.log(auth, 'auth in return ')}
            <button onClick={handleLogout} className="rounded-full px-3 py-1 text-xs">
              logout
            </button>
            <div className="rounded-full bg-black p-1 w-8 h-8">
              {user?.images[0]?.url ? (
                <img
                  className="rounded-full h-full w-full object-cover"
                  src={user?.images[0]?.url}
                  alt={user?.displayName}
                />
              ) : (
                <div className="rounded-full bg-[#282828] h-full w-full flex flex-col justify-center items-center">
                  <AvatarIcon />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="w-full max-w-2xl mx-auto bg-[#121212] p-4 rounded-lg">
        {!auth ? (
          <p className="text-left">
            Never lose your favorite Spotify playlists again! Clone any playlist with Hazelnut and
            enjoy the music you love on your terms. Don't let modifications or deletions by the
            original owner affect your experience. Start cloning now!
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
