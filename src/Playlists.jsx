import {useState, useEffect, useContext} from 'react';
import AuthContext from './context/AuthProvider';
import {NavLink} from 'react-router-dom';
import {getPlaylists, clonePlaylist, getLikedSongsCount, cloneLikedSongs} from './utils';
import Spinner from './Spinner';
import {toast} from 'react-hot-toast';
import {ReactComponent as PlaylistIcon} from '../public/playlist-icon.svg';
import likedSongs from '../public/liked-songs.png';
import spotifyLogo from '../public/spotify-icon.png';

const Playlists = () => {
  const [playlists, setPlaylists] = useState(null);
  const [totalLikedSongs, setTotalLikedSongs] = useState(null);
  const [cloneLikedSongsLoading, setCloneLikedSongsLoading] = useState('');
  const [clonePlaylistLoading, setClonePlaylistLoading] = useState('');
  const [getPlaylistsLoading, setGetPlaylistsLoading] = useState(false);
  const {user} = useContext(AuthContext);

  const handleGetPlaylists = async () => {
    const res = await getPlaylists();
    console.log(res);
    setPlaylists(res);
  };

  const handleGetTotalLikedSongs = async () => {
    const total = await getLikedSongsCount();
    setTotalLikedSongs(total);
  };

  useEffect(() => {
    setGetPlaylistsLoading(true);
    handleGetPlaylists();
    handleGetTotalLikedSongs();
    setGetPlaylistsLoading(false);
  }, []);

  const handleClonePlaylist = async (userId, id, name, owner) => {
    setClonePlaylistLoading(id);
    await clonePlaylist(userId, id, name, owner);
    toast.success('playlist cloned!');
    handleGetPlaylists();
    setClonePlaylistLoading('');
  };

  const handleCloneLikedSongs = async () => {
    setCloneLikedSongsLoading('yourlikedsongs');
    await cloneLikedSongs(user.id);
    toast.success('liked songs cloned!');
    handleGetPlaylists();
    setCloneLikedSongsLoading('');
  };

  return (
    <div className="overflow-auto h-[60vh]">
      {getPlaylistsLoading ? (
        <div className="w-full h-full flex flex-cols justify-center items-center">
          <Spinner />
        </div>
      ) : playlists ? (
        <ul>
          <li>
            <Playlist
              name="Liked Songs"
              propertyTwo={`${totalLikedSongs} Songs`}
              type="playlist"
              image={null}
              id="yourlikedsongs"
              userId={user.id}
              ownerId={user.id}
              handleClonePlaylist={handleCloneLikedSongs}
              clonePlaylistLoading={cloneLikedSongsLoading}
              link="https://open.spotify.com/collection/tracks"
            />
          </li>
          {playlists.map(playlist => (
            <li key={playlist.id}>
              <Playlist
                name={playlist.name}
                propertyTwo={playlist.owner?.display_name}
                type={playlist.type}
                image={playlist?.images[0]?.url}
                id={playlist.id}
                userId={user.id}
                ownerId={playlist.owner.id}
                handleClonePlaylist={handleClonePlaylist}
                clonePlaylistLoading={clonePlaylistLoading}
                link={playlist?.external_urls?.spotify}
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
  propertyTwo,
  type,
  image,
  id,
  ownerId,
  userId,
  handleClonePlaylist,
  clonePlaylistLoading,
  link,
}) => {
  return (
    <div className="grid grid-cols-[auto,1fr,1fr] gap-4 p-2 hover:bg-[hsla(0,0%,100%,.07)] rounded">
      <div className="flex flex-row items-center gap-4">
        <img className="h-4 w-4" src={spotifyLogo} />
        <div className="w-12 h-12 ">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover " />
          ) : id === 'yourlikedsongs' ? (
            <img className="" src={likedSongs} />
          ) : (
            <div className="h-full w-full flex flex-col justify-center items-center bg-[#282828] ">
              <PlaylistIcon />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row justify-start">
        <div className="flex flex-col">
          <NavLink to={id === 'yourlikedsongs' ? `likedsongs` : `playlist/${id}`}>
            <p className="cursor-pointer hover:underline text-left text-base font-medium text-white">
              {name}
            </p>
          </NavLink>
          <p className="text-left text-sm text-gray-500">{`${type.charAt(0).toUpperCase() +
            type.slice(1)} . ${propertyTwo}`}</p>
        </div>
      </div>

      <div className="flex flex-row items-start gap-3">
        <div className="flex flex-col justify-evenly">
          <div>
            <button
              onClick={() => handleClonePlaylist(userId, id, name, propertyTwo)}
              className="rounded-full px-3 py-1 text-xs"
              disabled={clonePlaylistLoading === id}
            >
              {clonePlaylistLoading === id ? <Spinner /> : 'copy playlist'}
            </button>
          </div>

          {ownerId !== userId ? <p className="text-xs text-red-400">you dont own this</p> : null}
        </div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={link}
          className="rounded-full px-3 py-1 text-xs flex flex-row justify-around items-center"
        >
          <img className="h-3 w-3 mr-2" src={spotifyLogo} />
          Listen on Spotify
        </a>
      </div>
    </div>
  );
};
