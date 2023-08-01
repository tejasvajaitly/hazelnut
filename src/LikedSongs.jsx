import {useState, useEffect, useRef, useCallback} from 'react';
import {getLikedTracks} from './utils';
import Spinner from './Spinner';
import spotifyLogo from '../public/spotify-icon.png';

//Same
const mergerArtistnames = (artistsArray = []) => {
  const artists = artistsArray.map(artist => artist.name);
  return artists.join(', ');
};

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastTrack = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          console.log('visible');
          setOffset(offset + 50);
        }
      });
      if (node) observer.current.observe(node);
      console.log(node, 'node');
    },
    [loading]
  );

  useEffect(() => {
    const handleGetLikedSongs = async () => {
      setLoading(true);
      const res = await getLikedTracks(offset);
      let likedSongsClone = structuredClone(likedSongs);
      likedSongsClone = likedSongsClone.concat(res.tracks);
      setLikedSongs(likedSongsClone);
      setLoading(false);
      if (res.next) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    };

    handleGetLikedSongs();
  }, [offset]);

  const loadMore = () => {
    setOffset(offset + 50);
  };

  return (
    <div className="overflow-auto h-[60vh]">
      {likedSongs?.length > 0 ? (
        <ul>
          {likedSongs.map((playlistItem, index) =>
            playlistItem.track ? (
              likedSongs.length === index + 1 ? (
                <li ref={lastTrack} key={playlistItem?.track?.id}>
                  <PlaylistItem
                    name={playlistItem.track?.name}
                    image={playlistItem.track?.album?.images[0]?.url}
                    artists={mergerArtistnames(playlistItem.track?.artists)}
                    link={playlistItem.track?.external_urls?.spotify}
                  />
                </li>
              ) : (
                <li key={playlistItem?.track?.id}>
                  <PlaylistItem
                    name={playlistItem.track?.name}
                    image={playlistItem.track?.album?.images[0]?.url}
                    artists={mergerArtistnames(playlistItem.track?.artists)}
                    link={playlistItem.track?.external_urls?.spotify}
                  />
                </li>
              )
            ) : null
          )}
        </ul>
      ) : null}
      {loading ? (
        <div className="flex flex-cols justify-center items-center">
          <Spinner />
        </div>
      ) : null}
    </div>
  );
};

export default LikedSongs;

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
