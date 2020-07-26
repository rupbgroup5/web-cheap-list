import React, { useContext,useState } from 'react'
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Badge from '@material-ui/core/Badge';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';

import { useHistory } from 'react-router-dom';

import '../Styles/NavBarStyle.css'

import Logo from '../Images/letter.jpg'

//ContextAPI
import { PageTitleContext } from "../Contexts/PageTitleContext";
import { UserIDContext } from '../Contexts/UserIDContext'


export default function MainNabar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory()

  //ContextAPI
  const { pageTitle } = useContext(PageTitleContext);
  const { userID, SetUserID } = useContext(UserIDContext)
  const [badge, setBagde] = useState(2) 



  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    console.log(event.currentTarget)
    setAnchorEl(event.currentTarget);
  };

  const ReturnToHomePage = () =>{
    if (userID === undefined ) {
      SetUserID(JSON.parse(localStorage.getItem('UserID')))
    }
    history.push(`/HomePage/${userID}`);
  }

  return (
    <nav className="nav">
      <div className="nav-Logo">
        <img src={Logo} alt="" onClick={ReturnToHomePage} />
      </div>
      <span className="nav-title">{pageTitle}</span>
      <div className="nav-Profile">
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>פרופיל</MenuItem>
          <MenuItem onClick={handleClose}>הגדרות</MenuItem>
        </Menu>
      
        
      </div>
     
     {pageTitle === 'סל קניות' && <span className="nav-not" >
          <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
         <Badge badgeContent={badge} color="secondary">
        <NotificationsNoneOutlinedIcon  className={badge === 0 ? ' ' : "ring"} />
          </Badge>
        </IconButton>
          </span>}
     
    </nav>
  );

}