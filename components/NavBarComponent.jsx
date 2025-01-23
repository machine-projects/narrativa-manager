import React from 'react';
import Link from 'next/link';

const NavBarComponent = ({ active }) => {
  return (
    <nav className="navbar bg-primary navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
      <div className="container-fluid">
        <Link href="/" passHref>
          <a className="navbar-brand" style={{textDecoration: 'none'}}>Narrativa Manager</a>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href="/" passHref>
                <a className={`nav-link ${active === 'home' ? 'active' : ''}`} aria-current="page" style={{textDecoration: 'none'}}>
                  Home
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/CanaisAdm" passHref>
                <a className={`nav-link ${active === 'canais-adm' ? 'active' : ''}`} style={{textDecoration: 'none'}}>
                  Canais Administrativos
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/Canais" passHref>
                <a className={`nav-link ${active === 'canais' ? 'active' : ''}`} style={{textDecoration: 'none'}}>
                  Canais
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/Favoritos" passHref>
                <a className={`nav-link ${active === 'favoritos' ? 'active' : ''}`} style={{textDecoration: 'none'}}>
                  Favoritos
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/Syncronize" passHref>
                <a className={`nav-link ${active === 'syncronize' ? 'active' : ''}`} style={{textDecoration: 'none'}}>
                  Sincronizar
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBarComponent;
