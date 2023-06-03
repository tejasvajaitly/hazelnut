import {ReactComponent as LeftNav} from '../public/left-nav.svg';
import {ReactComponent as RightNav} from '../public/right-nav.svg';
import {useNavigate} from 'react-router-dom';

const Navbar = ({profileUrl, displayName}) => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const goForward = () => {
    navigate(1);
  };
  return (
    <nav className="relative bg-[#121212] fixed w-full z-20 top-0 left-0 rounded-lg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <div className="flex flex-row justify-between w-[72px]">
          <NavButton onClick={goBack}>
            <LeftNav />
          </NavButton>
          <NavButton onClick={goForward}>
            <RightNav />
          </NavButton>
        </div>
        {/* <button className="rounded-full px-3 py-1 text-xs">logout</button>
        <div className="rounded-full bg-black p-1 w-8 h-8">
          <img
            className="rounded-full h-full w-full object-cover"
            src={profileUrl}
            alt={displayName}
          />
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;

const NavButton = ({children, ...rest}) => {
  return (
    <button
      {...rest}
      className="rounded-full bg-[rgba(0,0,0,.7)] w-8 h-8 p-0 flex justify-center items-center"
    >
      {children}
    </button>
  );
};
