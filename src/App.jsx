import './App.css';
import {useEffect, useState} from 'react';
import {handleLogin, getAccessToken, fetchProfile} from './utils';

function App() {
  const [currentUser, setCurrentuser] = useState(null);
  useEffect(() => {
    const authFlow = async () => {
      if (localStorage.getItem('access_token')) {
        const profile = await fetchProfile(localStorage.getItem('access_token'));
        if (!profile) {
          localStorage.removeItem('access_token');
        }
        console.log(profile, 'profile');
        setCurrentuser(profile);
      } else {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
          const accessToken = await getAccessToken(code);
          console.log(accessToken, 'accessToken');
          const profile = await fetchProfile(accessToken);
          console.log(profile, 'profile');
          setCurrentuser(profile);
        }
      }
    };
    authFlow();
  }, []);

  return (
    <>
      {!currentUser ? (
        <button onClick={handleLogin}>login with spotify</button>
      ) : (
        <>
          <img src={currentUser.images[0].url} alt={currentUser.display_name} />
          <h1>{`Welcome ${currentUser?.display_name}`}</h1>
        </>
      )}
    </>
  );
}

export default App;
