import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom'; // ✅ AJOUT
import {
  FaMoon, FaSun, FaPlus, FaEdit, FaTrash, FaSave, FaDownload,
  FaSearch, FaUser, FaHome, FaSignOutAlt, FaArrowLeft, FaArrowRight, FaSpinner
} from 'react-icons/fa';

const icons = {
  moon: FaMoon,
  sun: FaSun,
  plus: FaPlus,
  edit: FaEdit,
  trash: FaTrash,
  save: FaSave,
  download: FaDownload,
  search: FaSearch,
  user: FaUser,
  home: FaHome,
  logout: FaSignOutAlt,
  back: FaArrowLeft,
  next: FaArrowRight,
  spinner: FaSpinner
};

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  block = false,
  outline = false,
  onClick,
  disabled = false,
  className = '',
  isThemeToggle = false,
  to, // ✅ AJOUT : pour les boutons-lien
  title, // ✅ AJOUT : accessibilité
  ...rest
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  React.useEffect(() => {
    const styleId = 'button-spin-animation';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (isThemeToggle) {
    const themeButtonStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      padding: '8px',
      borderRadius: '50%',
      border: `2px solid ${isDarkMode ? '#444' : '#ddd'}`,
      backgroundColor: isDarkMode ? '#333' : '#f0f0f0',
      color: isDarkMode ? '#ffd700' : '#333',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    };

    return (
      <button
        type="button"
        style={themeButtonStyle}
        onClick={toggleTheme}
        aria-label={isDarkMode ? 'Mode clair' : 'Mode sombre'}
        title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'rotate(180deg) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'rotate(0) scale(1)';
        }}
        {...rest}
      >
        {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button>
    );
  }

  let IconComponent = null;
  if (loading) {
    IconComponent = FaSpinner;
  } else if (icon && typeof icon === 'string') {
    IconComponent = icons[icon] || null; // ✅ fallback sécurisé
  }

  let buttonClass = 'btn';

  const buttonStyle = {
    backgroundColor: outline ? 'transparent' :
      variant === 'primary' ? 'var(--primary-color)' :
      variant === 'secondary' ? 'var(--secondary-color)' :
      variant === 'success' ? 'var(--success-color)' :
      variant === 'danger' ? 'var(--danger-color)' :
      variant === 'warning' ? 'var(--warning-color)' :
      variant === 'light' ? 'var(--light-color)' :
      variant === 'dark' ? 'var(--dark-color)' :
      'var(--primary-color)',
    color: outline ? (
      variant === 'primary' ? 'var(--primary-color)' :
      variant === 'secondary' ? 'var(--secondary-color)' :
      variant === 'success' ? 'var(--success-color)' :
      variant === 'danger' ? 'var(--danger-color)' :
      variant === 'warning' ? 'var(--warning-color)' :
      variant === 'light' ? 'var(--dark-color)' :
      variant === 'dark' ? 'var(--text-primary)' :
      'var(--primary-color)'
    ) : (
      variant === 'light' ? 'var(--dark-color)' : 'white'
    ),
    border: outline ? `2px solid` : '1px solid transparent',
    borderColor: outline ? (
      variant === 'primary' ? 'var(--primary-color)' :
      variant === 'secondary' ? 'var(--secondary-color)' :
      variant === 'success' ? 'var(--success-color)' :
      variant === 'danger' ? 'var(--danger-color)' :
      variant === 'warning' ? 'var(--warning-color)' :
      variant === 'light' ? 'var(--light-color)' :
      variant === 'dark' ? 'var(--dark-color)' :
      'var(--primary-color)'
    ) : 'transparent',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: block ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: size === 'sm' ? '0.25rem 0.75rem' :
             size === 'lg' ? '0.75rem 1.5rem' :
             '0.5rem 1rem',
    fontSize: size === 'sm' ? '0.875rem' :
              size === 'lg' ? '1.125rem' :
              '1rem',
    fontWeight: '500',
    borderRadius: 'var(--border-radius)',
    transition: 'all 0.3s ease'
  };

  if (className) buttonClass += ` ${className}`;

  const content = (
    <>
      {IconComponent && iconPosition === 'left' && (
        <span className={loading ? 'spinning' : ''}>
          <IconComponent />
        </span>
      )}
      {children}
      {IconComponent && iconPosition === 'right' && (
        <span className={loading ? 'spinning' : ''}>
          <IconComponent />
        </span>
      )}
    </>
  );

  // ✅ Si `to` est fourni, on rend un <Link> au lieu d’un <button>
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClass}
        style={buttonStyle}
        title={title}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClass}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button;
