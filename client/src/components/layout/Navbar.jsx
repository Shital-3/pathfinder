import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll detection to update navbar styling
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu drawer is active
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Automatically close mobile menu on page transition
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/dilemmas", label: "Dilemmas" },
    { path: "/experiences", label: "Experiences" },
    { path: "/contributors", label: "Contributors" },
   
    { path: "/about", label: "About" },
  ];

  return (
    <>
      <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__container">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-mark" aria-hidden="true">
              PF
            </span>
            <span className="navbar__logo-text">Pathfinder</span>
          </Link>

          {/* Navigation Links */}
          <nav className="navbar__nav" aria-label="Main navigation">
            <ul className="navbar__links">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `navbar__link ${isActive ? "navbar__link--active" : ""}`
                    }
                    end={link.path === "/"}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Action */}
          <div className="navbar__actions">
            {!user ? (
              <>
                <Link to="/signin" className="navbar__cta-btn">
                  Sign in
                </Link>
                <Link to="/register" className="navbar__cta-btn">
                  Register
                </Link>
              </>
            ) : (
              <div className="navbar__account">
                <span className="navbar__account-name" title={user.name || user.email}>
                  {user.name || user.email}
                </span>
                {user.role === "ADMIN" && (
                  <Link to="/admin" className="navbar__admin-link">Admin</Link>
                )}
                <button type="button" className="navbar__logout" onClick={onLogout}>
                  Sign out
                </button>
              </div>
            )}
            <Link to="/experiences" className="navbar__cta-btn">
              Explore Experiences
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className={`navbar__hamburger ${menuOpen ? "is-active" : ""}`}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="navbar__hamburger-bar" />
              <span className="navbar__hamburger-bar" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`navbar__drawer ${menuOpen ? "navbar__drawer--open" : ""}`}
        inert={!menuOpen ? "" : undefined}
      >
        <div className="navbar__drawer-content">
          <nav className="navbar__drawer-nav" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `navbar__drawer-link ${isActive ? "navbar__drawer-link--active" : ""}`
                }
                end={link.path === "/"}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar__drawer-footer">
            {!user ? (
              <>
                <Link to="/signin" className="navbar__cta-btn navbar__cta-btn--full">
                  Sign in
                </Link>
                <Link to="/register" className="navbar__cta-btn navbar__cta-btn--full">
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="navbar__drawer-user">Signed in as {user.name || user.email}</div>
                {user.role === "ADMIN" && (
                  <Link to="/admin" className="navbar__cta-btn navbar__cta-btn--full">
                    Admin dashboard
                  </Link>
                )}
                <button type="button" className="navbar__cta-btn navbar__cta-btn--full" onClick={onLogout}>
                  Sign out
                </button>
              </>
            )}
            <Link to="/experiences" className="navbar__cta-btn navbar__cta-btn--full">
              Explore Experiences
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}