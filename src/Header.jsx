import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Header = ({ user, toggleMenu, isMenuOpen, closeMenu }) => {
  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        <div className="header-center">
          <Link to="/" className="header-title-link">
            <img src="/images/logo.jpeg" alt="Los Tres Macarons" className="logo" />
            <h1 className="header-title-text">Los Tres Macarons</h1>
          </Link>
        </div>
        <div className="header-right"></div>
      </header>
      <div className={`nav-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}></div>
      <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
          {user ? (
            <li><Link to="/my-account" onClick={closeMenu}>My Account</Link></li>
          ) : (
            <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Header;
