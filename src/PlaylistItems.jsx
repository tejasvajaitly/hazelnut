import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getPlaylistItems} from './utils';
import Spinner from './Spinner';
import spotifyLogo from '../public/spotify-icon.png';

const mergerArtistnames = (artistsArray = []) => {
  const artists = artistsArray.map(artist => artist.name);
  return artists.join(', ');
};

const PlaylistItems = () => {
  const [playlistItems, setPlaylistItems] = useState(null);
  const [loading, setLoading] = useState(false);
  let {playlistId} = useParams();

  useEffect(() => {
    const handleGetPlaylists = async () => {
      setLoading(true);
      const res = await getPlaylistItems(playlistId);
      setPlaylistItems(res);
      setLoading(false);
    };

    handleGetPlaylists();
  }, []);

  return (
    <div className="overflow-auto h-[60vh]">
      {loading ? (
        <div className="w-full h-full flex flex-cols justify-center items-center">
          <Spinner />
        </div>
      ) : playlistItems ? (
        <ul>
          {playlistItems.map(playlistItem =>
            playlistItem.track ? (
              <li key={playlistItem?.track?.id}>
                <PlaylistItem
                  name={playlistItem.track?.name}
                  image={playlistItem.track?.album?.images[0]?.url}
                  artists={mergerArtistnames(playlistItem.track?.artists)}
                  link={playlistItem.track?.external_urls?.spotify}
                />
              </li>
            ) : null
          )}
        </ul>
      ) : null}
    </div>
  );
};

export default PlaylistItems;

const PlaylistItem = ({name, artists = '', image, link}) => {
  return (
    <div className="grid grid-cols-[auto,1fr,auto] gap-4 p-2 hover:bg-[hsla(0,0%,100%,.07)] rounded cursor-pointer">
      <div>
        <div className="w-12 h-12 ">
          <img src={image} alt={name} className="w-full h-full object-cover " />
        </div>
      </div>
      <div>
        <div className="flex flex-row justify-start">
          <div className="flex flex-col">
            <p className="text-left text-base font-medium text-white">{name}</p>
            <p className="text-left text-sm text-gray-500">{`${artists}`}</p>
          </div>
        </div>
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
  );
};
