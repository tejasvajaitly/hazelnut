import {useState, useEffect, useContext} from 'react';
import AuthContext from './context/AuthProvider';
import {NavLink} from 'react-router-dom';
import {getPlaylists, clonePlaylist} from './utils';
import Spinner from './Spinner';
import {toast} from 'react-hot-toast';
import {ReactComponent as PlaylistIcon} from '../public/playlist-icon.svg';

const Playlists = () => {
  const [playlists, setPlaylists] = useState(null);
  const [loading, setLoading] = useState('');
  const {user} = useContext(AuthContext);

  const handleGetPlaylists = async () => {
    const res = await getPlaylists();
    setPlaylists(res);
  };

  useEffect(() => {
    handleGetPlaylists();
  }, []);

  const handleClonePlaylist = async (userId, id, name, owner) => {
    setLoading(id);
    await clonePlaylist(userId, id, name, owner);
    toast.success('playlist cloned!');
    handleGetPlaylists();
    setLoading('');
  };

  return (
    <div className="overflow-auto h-[70vh]">
      {playlists ? (
        <ul>
          {playlists.map(playlist => (
            <li key={playlist.id}>
              <Playlist
                name={playlist.name}
                owner={playlist.owner?.display_name}
                type={playlist.type}
                image={playlist?.images[0]?.url}
                id={playlist.id}
                userId={user.id}
                ownerId={playlist.owner.id}
                handleClonePlaylist={handleClonePlaylist}
                loading={loading}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default Playlists;

const Playlist = ({
  name,
  owner,
  type,
  image,
  id,
  ownerId,
  userId,
  handleClonePlaylist,
  loading,
}) => {
  return (
    <div className="grid grid-cols-[auto,1fr,1fr] gap-4 p-2 hover:bg-[hsla(0,0%,100%,.07)] rounded">
      <div className="w-12 h-12 rounded">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover rounded" />
        ) : (
          <div className="h-full w-full flex flex-col justify-center items-center bg-[#282828] rounded">
            <PlaylistIcon />
          </div>
        )}
      </div>
      <div className="flex flex-row justify-start">
        <div className="flex flex-col">
          <NavLink to={`playlist/${id}`}>
            <p className="cursor-pointer hover:underline text-left text-base font-medium text-white">
              {name}
            </p>
          </NavLink>
          <p className="text-left text-sm text-gray-500">{`${type.charAt(0).toUpperCase() +
            type.slice(1)} . ${owner}`}</p>
        </div>
      </div>
      <div className="flex flex-col justify-evenly">
        <div>
          <button
            onClick={() => handleClonePlaylist(userId, id, name, owner)}
            className="rounded-full px-3 py-1 text-xs"
            disabled={loading === id}
          >
            {loading === id ? <Spinner /> : 'copy playlist'}
          </button>
        </div>

        {ownerId !== userId ? <p className="text-xs text-red-400">you dont own this</p> : null}
      </div>
    </div>
  );
};
