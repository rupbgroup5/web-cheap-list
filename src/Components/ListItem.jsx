import React from 'react';
import PropTypes from 'prop-types';
import  '../Styles/ListItemStyle.css';

const ListItem = ({ description, icon, name }) => (
  <div className="listItemComponent">
    <div className="label">
      {icon}
      <span className="name">{name}</span>
    </div>
    {description && <div className="desciption">{description}</div>}
  </div>
);

ListItem.propTypes = {
  description: PropTypes.string,
  icon: PropTypes.node,
  name: PropTypes.string
};

export default ListItem;
