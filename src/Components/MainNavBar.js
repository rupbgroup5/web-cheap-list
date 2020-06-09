import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import '../Styles/NavBarStyle.css'

export default function MainNabar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);


    const handleClose = () => {
        setAnchorEl(null);
      };

      const handleMenu = (event) => {
          console.log(event.currentTarget)
        setAnchorEl(event.currentTarget);
      };

    return (
        <nav className="nav">
            <div className="nav-Logo">
                <IconButton>
                {/* <img src={logo} alt =" "/> */}
                </IconButton>
            </div>
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
        </nav>
    );

}