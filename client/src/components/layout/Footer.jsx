import React from 'react';
import { Link } from 'react-router-dom';

import './Footer.css';
import { Compass, ShieldCheck } from 'lucide-react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__grid">
        
        {/* BRAND COLUMN */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <div className="footer__logo-icon-wrapper">
              <Compass className="footer__logo-icon" size={22} />
            </div>
            <span className="footer__logo-text">Pathfinder</span>
          </Link>
          
          <p className="footer__description">
            A student decision-support platform. Explore real experiences, 
            understand complex trade-offs, and make informed academic and career choices.
          </p>

          <div className="footer__status-badge">
            <span>Beta · Actively developed</span>
          </div>
        </div>

        {/* EXPLORE NAVIGATION */}
        <div className="footer__col">
          <h4 className="footer__heading">EXPLORE</h4>
          <nav className="footer__nav">
            <Link to="/dilemmas">Dilemma Explorer</Link>
            <Link to="/experiences">
              Verified Experiences
              <ShieldCheck size={13} className="footer__verified-icon" />
            </Link>
            <Link to="/contributors">Contributors</Link>
          </nav>
        </div>

        {/* COMMUNITY NAVIGATION */}
        <div className="footer__col">
          <h4 className="footer__heading">COMMUNITY</h4>
          <nav className="footer__nav">
            <Link to="/share">Share Experience</Link>
            <Link to="/about">About Us</Link>
          </nav>
        </div>

        {/* CONNECT COLUMN */}
        <div className="footer__col">
          <h4 className="footer__heading">CONNECT</h4>
          <div className="footer__socials">
            <a 
              href="https://github.com/YOUR-USERNAME/pathfinder" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="GitHub"
              className="footer__social-link"
            >
              <FaGithub size={16} />
            </a>
            <a 
              href="https://twitter.com/YOUR-HANDLE" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="Twitter"
              className="footer__social-link"
            >
              <FaTwitter size={16} />
            </a>
            <a 
              href="https://linkedin.com/in/YOUR-PROFILE" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="LinkedIn"
              className="footer__social-link"
            >
              <FaLinkedin size={16} />
            </a>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="footer__bottom-wrapper">
        <div className="container footer__bottom">
          <div className="footer__copyright">
            <span>© {currentYear} Pathfinder. Built by students, for students.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}