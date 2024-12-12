
import React from 'react';
import Link from 'next/link';
const NavBarComponent = ({ active }) => {
    return (
        <nav
          className="navbar bg-primary navbar-expand-lg bg-body-tertiary" data-bs-theme="dark"
        >
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              Narrativa Manager
            </a>
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
                <Link href="/" passHref style={{textDecoration: 'none'}}>
                <span className={`nav-link ${active === 'home' ? 'active' : ''}`} aria-current="page">
                  Home
                </span>
              </Link>
                </li>
                <li className="nav-item">
                <Link href="/Canais" passHref style={{textDecoration: 'none'}}>
                  <span className={`nav-link ` + (active=='canais' ? 'active' : '')}>
                    Canais
                  </span>
                </Link>
                </li>
                <li className="nav-item">
                <Link href="/Favoritos" passHref style={{textDecoration: 'none'}}>
                  <span className={`nav-link ` + (active=='favoritos' ? 'active' : '')}>
                    Favoritos
                  </span>
                </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
    )
}

export default NavBarComponent;