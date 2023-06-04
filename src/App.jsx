import {useEffect, useContext} from 'react';
import AuthContext from './context/AuthProvider';
import {handleLogin, getAccessToken, fetchProfile} from './utils';
import {Outlet, useNavigate} from 'react-router-dom';
import Navbar from './Navbar';
import './App.css';
import {ReactComponent as AvatarIcon} from '../public/avatar-icon.svg';
import {ReactComponent as Heart} from '../public/heart.svg';
import {ReactComponent as Spotify} from '../public/spotify-logo.svg';

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
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto bg-[#121212] p-4 rounded-lg">
        <p>hazelnut</p>
        {!auth ? (
          <button
            onClick={handleLogin}
            className="rounded-full px-3 py-1 text-xs flex flex-row justify-around items-center"
          >
            <Spotify className="h-3 w-3 mr-2" />
            login with spotify
          </button>
        ) : (
          <div className="flex flex-row gap-4">
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
      <>
        <Footer />
      </>
    </div>
  );
}

export default App;

const Footer = () => {
  return (
    <footer className="w-full max-w-2xl mx-auto  p-3 rounded-lg mt-auto">
      <hr class="w-full border-1 border-gray-200 dark:border-gray-800 mb-6" />
      <div className="flex flex-wrap flex-row justify-between gap-3">
        <div className="flex flex-row justify-center items-center">
          Made with <Heart className="mx-1" /> by Neil Jaitly
        </div>
        <div className="flex flex-rows justify-around items-center gap-3 text-gray-500">
          <SocialAnchor link="https://github.com/tejasvajaitly" name="Github" />|
          <SocialAnchor link="https://www.linkedin.com/in/tejasvajaitly/" name="Linked" />|
          <SocialAnchor link="https://twitter.com/neiljaitly7963" name="Twitter" />
        </div>
      </div>
    </footer>
  );
};

const SocialAnchor = ({link, name}) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={link}
      className="cursor-pointer text-gray-500 hover:text-gray-600 transition"
    >
      {name}
    </a>
  );
};
