import {useState, useEffect} from 'react';
import {getLikedTracks} from './utils';
import Spinner from './Spinner';

//Same
const mergerArtistnames = (artistsArray = []) => {
  const artists = artistsArray.map(artist => artist.name);
  return artists.join(', ');
};

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleGetLikedSongs = async () => {
      setLoading(true);
      const res = await getLikedTracks();
      setLikedSongs(res);
      setLoading(false);
    };

    handleGetLikedSongs();
  }, []);

  return (
    <div className="overflow-auto h-[60vh]">
      {loading ? (
        <div className="w-full h-full flex flex-cols justify-center items-center">
          <Spinner />
        </div>
      ) : likedSongs ? (
        <ul>
          {likedSongs.map(playlistItem =>
            playlistItem.track ? (
              <li key={playlistItem?.track?.id}>
                <PlaylistItem
                  name={playlistItem.track?.name}
                  image={playlistItem.track?.album?.images[0]?.url}
                  artists={mergerArtistnames(playlistItem.track?.artists)}
                />
              </li>
            ) : null
          )}
        </ul>
      ) : null}
    </div>
  );
};

export default LikedSongs;

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
