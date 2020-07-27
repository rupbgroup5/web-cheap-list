import React, { useContext, useState, useEffect } from 'react'
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
import { IsLocalContext } from '../Contexts/IsLocalContext';
import { NotificationsContext } from '../Contexts/NotificationsContext';



export default function MainNabar(props) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory()

  //ContextAPI
  const { pageTitle } = useContext(PageTitleContext);
  const { userID, SetUserID } = useContext(UserIDContext)
  const { isLocal } = useContext(IsLocalContext);
  const { notifications, SetNotifications } = useContext(NotificationsContext)



  let apiNotifications = `http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/Notifications/${userID}`
  if (isLocal) {
    apiNotifications = `http://localhost:56794/api/Notifications/1`
  }

  useEffect(() => {
    (async function fetchMyAPI() {
      console.log('use')
      const res = await fetch(apiNotifications, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
        }),
      })
      let data = await res.json();
      console.log(data)
      SetNotifications(data);
    }())

  }, []);



  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const ReturnToHomePage = () => {
    if (userID === undefined) {
      SetUserID(JSON.parse(localStorage.getItem('UserID')))
    }
    history.push(`/HomePage/${userID}`);
  }

  return (
    <nav className="nav">
      <div className="nav-Logo">
        <img src={Logo} alt="" onClick={ReturnToHomePage} />
      </div>
      <span className="nav-title" style={{ paddingLeft: 'סל קניות' === pageTitle ? 50 : 15 }}>{pageTitle}</span>
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
          onClick={() => history.push('/Notifications')}
          color="inherit"
        >
          <Badge badgeContent={notifications.length} color="secondary">
            <NotificationsNoneOutlinedIcon className={notifications.length === 0 ? ' ' : "ring"} />
          </Badge>
        </IconButton>
      </span>}

    </nav>
  );

}