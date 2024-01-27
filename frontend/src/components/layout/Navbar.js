import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { TokenContext } from "../../App";

const Navbar = () => {
  const { token } = useContext(TokenContext);
  return (
    <nav className="navbar bg-dark">
      <h1>
        <NavLink to="/">
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
                <i class="fas fa-user"></i>
                <span class="hide-sm">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile/logout" title="Logout">
                <i class="fas fa-sign-out-alt"></i>
                <span class="hide-sm">Logout</span>
              </NavLink>
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
