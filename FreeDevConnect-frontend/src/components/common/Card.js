import React from 'react';
import PropTypes from 'prop-types'; 
import '../../styles/components/cards.css';

const Card = ({ children, title, footer, className = '', ...rest }) => {
  return (
    <div className={`card ${className}`} {...rest}>
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

// Ajout de PropTypes pour validation des props
Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  footer: PropTypes.node,
  className: PropTypes.string,
};

export default Card;
