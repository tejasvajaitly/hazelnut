import {useState} from 'react';
import {getPlaylists} from './utils';

const Playlists = () => {
  const [playlists, setPlaylists] = useState(null);
  const handleGetPlaylists = async () => {
    const res = await getPlaylists();
    setPlaylists(res);
    console.log(res, 'playlists');
  };
  return (
    <>
      <button onClick={handleGetPlaylists}>get all your playlists</button>
      <div className="overflow-auto	bg-yellow-300 h-[75vh]">
        {playlists ? (
          <ul>
            {playlists.map(playlist => (
              <li key={playlist.id}>
                <Playlist
                  name={playlist.name}
                  owner={playlist.owner?.display_name}
                  type={playlist.type}
                  image={playlist.images[0]?.url}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );
};

export default Playlists;

const Playlist = ({name, owner, type, image}) => {
  return (
    <div className="grid grid-cols-[auto,1fr] gap-4 p-2 hover:bg-[hsla(0,0%,100%,.07)] rounded cursor-pointer">
      <div className="w-12 h-12 rounded">
        <img src={image} alt={name} className="w-full h-full object-cover rounded" />
      </div>
      <div className="flex flex-row justify-start">
        <div className="flex flex-col">
          <p className="text-left text-base font-medium text-white">{name}</p>
          <p className="text-left text-sm text-gray-500">{`${type.charAt(0).toUpperCase() +
            type.slice(1)} . ${owner}`}</p>
        </div>
      </div>
    </div>
  );
};
