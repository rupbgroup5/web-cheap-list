import React from 'react';
import PropTypes from 'prop-types';
import '../Styles/ItemContentStyle.css';

const ItemConent = ({ icon, color, side, label }) => (
  <div  
    style={{ background: color }}
  >
    <div className="content">
      {icon}
      {label && <span>{label}</span>}
    </div>
  </div>
);

ItemConent.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
  side: PropTypes.oneOf(['left', 'right']).isRequired
};

export default ItemConent;
