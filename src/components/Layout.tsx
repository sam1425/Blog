import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS, SIDEBAR2_BUTTONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'c0mplex' }) => {
  const location = useLocation();

  return (
    <>
      <div className="navbar">
        <span id="c0mplex">{title}</span>
      </div>
      <div id="content">
        <div id="leftside">
          <div className="sidebar">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className={location.pathname === link.path ? 'active' : ''}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {children}
        <div className="sidebar2">
          {SIDEBAR2_BUTTONS.map((btn, idx) => (
            <a
              key={idx}
              className="hov"
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={btn.src} style={btn.style} />
            </a>
          ))}
        </div>
      </div>
      <footer>
        <span id="copy"> 🞜 c0mplex © 2025. </span>
      </footer>
    </>
  );
};

export default Layout;
