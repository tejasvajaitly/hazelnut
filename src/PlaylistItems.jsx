import {useState} from 'react';
import {getPlaylistItems} from './utils';

const mergerArtistnames = (artistsArray = []) => {
  const artists = artistsArray.map(artist => artist.name);
  return artists.join(', ');
};

const PlaylistItems = () => {
  const [playlistItems, setPlaylistItems] = useState(null);
  const handleGetPlaylists = async () => {
    const res = await getPlaylistItems();
    setPlaylistItems(res);
  };
  return (
    <>
      <button onClick={handleGetPlaylists}>get playlist items</button>

      {playlistItems ? (
        <ul>
          {playlistItems.map(playlistItem => (
            <li key={playlistItem.track.id}>
              <PlaylistItem
                name={playlistItem.track?.name}
                image={playlistItem.track?.album?.images[0]?.url}
                artists={mergerArtistnames(playlistItem.track?.artists)}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

export default PlaylistItems;

const PlaylistItem = ({name, artists = '', image}) => {
  return (
    <div className="grid grid-cols-[auto,1fr] gap-4 p-2 hover:bg-[hsla(0,0%,100%,.07)] rounded cursor-pointer">
      <div className="w-12 h-12 rounded">
        <img src={image} alt={name} className="w-full h-full object-cover rounded" />
      </div>
      <div className="flex flex-row justify-start">
        <div className="flex flex-col">
          <p className="text-left text-base font-medium text-white">{name}</p>
          <p className="text-left text-sm text-gray-500">{`${artists}`}</p>
        </div>
      </div>
    </div>
  );
};
