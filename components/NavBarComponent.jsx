import React from 'react';
import Link from 'next/link';

const NavBarComponent = ({ active }) => {
  return (
    <nav className="navbar bg-primary navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
          Narrativa Manager
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
              <Link href="/" className={`nav-link ${active === 'home' ? 'active' : ''}`} aria-current="page">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/CanaisAdm" className={`nav-link ${active === 'canais-adm' ? 'active' : ''}`}>
                Canais Administrativos
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/Canais" className={`nav-link ${active === 'canais' ? 'active' : ''}`}>
                Canais
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/Favoritos" className={`nav-link ${active === 'favoritos' ? 'active' : ''}`}>
                Favoritos
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/Syncronize" className={`nav-link ${active === 'syncronize' ? 'active' : ''}`}>
                Sincronizar
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBarComponent;
