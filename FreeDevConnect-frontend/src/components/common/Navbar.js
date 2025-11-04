import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/components/navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  const themeButtonStyle = {
    width: '40px',
    height: '40px',
    padding: '0',
    borderRadius: '50%',
    border: '2px solid',
    borderColor: isDarkMode ? '#ffd700' : '#2563eb',
    backgroundColor: isDarkMode ? 'rgba(44, 62, 80, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    marginRight: user ? '10px' : '0',
    boxShadow: isDarkMode 
      ? '0 2px 8px rgba(255, 215, 0, 0.3)' 
      : '0 2px 8px rgba(37, 99, 235, 0.2)'
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo avec transparence */}
        <Link to="/" className="navbar-logo">
          <img 
            src="data:image/png;base64,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" 
            alt="FreeDevConnect Logo" 
            className="navbar-logo-img" 
            style={{ opacity: 0.9 }}
          />
          <div className="logo-text">
            <span className="logo-title">FreeDevConnect</span>
          </div>
        </Link>

        <button 
          className="navbar-mobile-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Accueil
            </Link>
            <button onClick={() => scrollToSection('how-it-works')} className="nav-link-btn">
              Comment ça marche
            </button>
            <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>
              Projets
            </Link>
            <Link to="/freelances" className={location.pathname === '/freelances' ? 'active' : ''}>
              Freelances
            </Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
              Contact
            </Link>
          </div>
          
          <div className="navbar-actions">
            {/* Bouton Theme */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              style={themeButtonStyle}
              aria-label={isDarkMode ? 'Mode clair' : 'Mode sombre'}
              title={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotate(180deg) scale(1.1)';
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? '0 4px 12px rgba(255, 215, 0, 0.4)' 
                  : '0 4px 12px rgba(37, 99, 235, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotate(0) scale(1)';
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? '0 2px 8px rgba(255, 215, 0, 0.3)' 
                  : '0 2px 8px rgba(37, 99, 235, 0.2)';
              }}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* SI CONNECTÉ */}
            {isAuthenticated && user ? (
              <div className="user-menu" ref={userMenuRef}>
                <button 
                  className="user-menu-toggle" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="user-avatar">
                    {user.firstName?.[0]?.toUpperCase() || 'U'}
                    {user.lastName?.[0]?.toUpperCase() || ''}
                  </div>
                  <span className="user-name">
                    {user.firstName} {user.lastName}
                  </span>
                  <i className={`fas fa-chevron-down ${isDropdownOpen ? 'rotate' : ''}`}></i>
                </button>
                
                {isDropdownOpen && (
                  <div className="user-dropdown">
                    {/* Dashboard selon rôle */}
                    {user.role === 'admin' && (
                      <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <i className="fas fa-tachometer-alt"></i>
                        Dashboard Admin
                      </Link>
                    )}
                    {user.role === 'client' && (
                      <>
                        <Link to="/client/dashboard" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                          <i className="fas fa-tachometer-alt"></i>
                          Dashboard Client
                        </Link>
                        <Link to="/client/projects/new" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                          <i className="fas fa-plus-circle"></i>
                          Créer un projet
                        </Link>
                      </>
                    )}
                    {user.role === 'freedev' && (
                      <Link to="/freelance/dashboard" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <i className="fas fa-tachometer-alt"></i>
                        Dashboard Freelance
                      </Link>
                    )}
                    
                    <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                      <i className="fas fa-user"></i>
                      Mon profil
                    </Link>
                    <Link to="/messages" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                      <i className="fas fa-envelope"></i>
                      Messages
                    </Link>
                    
                    <div className="dropdown-divider"></div>
                    
                    {/* ICÔNE DRIBBBLE POUR DÉCONNEXION */}
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm5.9 4.7c.8 1.2 1.3 2.6 1.3 4.2 0 .3 0 .5-.1.8-1.4-.3-2.9-.4-4.4-.4-.5 0-1 0-1.5.1-.1-.3-.2-.5-.3-.8-.1-.2-.2-.5-.3-.7 1.5-.6 2.8-1.5 3.8-2.6.5.4.9.9 1.3 1.4h.2zM8 1.3c1.5 0 2.8.5 3.9 1.4-.9 1-2.1 1.8-3.5 2.3-.9-1.7-1.9-3.1-3-4.2.5-.1 1-.2 1.6-.2v.7zM4.2 2.2c1.1 1.1 2.1 2.5 3 4.1-1.8.5-3.8.7-5.9.7H1c.4-1.9 1.5-3.5 3.2-4.8zM1.3 8c0-.1 0-.2 0-.3h.4c2.3 0 4.5-.3 6.5-.9.1.2.2.4.3.6.1.2.2.5.3.7-2 .6-3.8 1.7-5.2 3.1-.9-1-.1.5-2.3-3.2zm6.7 6.7c-1.4 0-2.7-.4-3.8-1.2 1.2-1.3 2.8-2.3 4.6-2.8.7 1.8 1.2 3.7 1.4 5.6-.7.3-1.5.4-2.2.4zm3.5-.7c-.2-1.8-.7-3.6-1.3-5.2.4 0 .9-.1 1.3-.1 1.4 0 2.8.1 4.1.4-.3 2.1-1.5 3.9-3.3 5h-.8z"/>
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* SI NON CONNECTÉ - ICÔNES DRIBBBLE */
              <div className="navbar-auth">
                <Link to="/login" className="btn btn-ghost">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '6px' }}>
                    <path d="M8 8c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/>
                  </svg>
                  Connexion
                </Link>
                <Link to="/register" className="btn btn-primary">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '6px' }}>
                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm4 9H9v3H7V9H4V7h3V4h2v3h3v2z"/>
                  </svg>
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;