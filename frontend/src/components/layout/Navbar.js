import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { TokenContext } from "../../App";

const Navbar = (props) => {
  const { token } = useContext(TokenContext);
  const { profile } = props;
  let profilePicture = "";
  let name = "";
  profilePicture = profile?.profileInfo?.profilepicture?.path;
  name = profile?.basicInfo?.name;

  return (
    <nav className="navbar bg-dark">
      <h1>
        <NavLink to={token ? "/profile/dashboard" : "/"}>
          <i className="fas fa-code"></i> Profile Hub
        </NavLink>
      </h1>
      <ul>
        <li>
          <NavLink to="/developers">Developers</NavLink>
        </li>
        <li>
          <NavLink to="/blog">Blog</NavLink>
        </li>
        {token ? (
          <>
            <li>
              |
              <NavLink to="/profile/dashboard" title="Dashboard">
                <span className="hide-sm">Dashboard</span>
                <i className="fa-solid fa-caret-down"></i>
              </NavLink>
              <ul className="subnav">
                <li>
                  <NavLink
                    className={"nav-profile-pic"}
                    to="/profile/dp"
                    title="Change Profile Picture"
                  >
                    {profilePicture ? (
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/${profilePicture}`}
                        alt={name}
                      />
                    ) : (
                      <i className="fas fa-user"></i>
                    )}
                    <span className="hide-sm">Change Profile Picture</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profile/logout" title="Logout">
                    <i className="fas fa-sign-out-alt"></i>
                    <span className="hide-sm">Logout</span>
                  </NavLink>
                </li>
              </ul>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
