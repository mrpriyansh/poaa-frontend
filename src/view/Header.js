import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { useAuth } from '../services/Auth';
import { headerStyles } from '../styles/view/header';
import Popup from '../components/Popup';
import AddAccount from './AddAccount';

function Header() {
  const classes = headerStyles();
  const { setAuthToken, authToken } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  const handleOpenMenu = e => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = event => {
    event.preventDefault();
    window.localStorage.removeItem('token');
    setAuthToken();
    handleClose();
  };

  const handleAddAccount = () => {
    setOpenPopup(true);
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" classes={{ root: classes.titleRoot }}>
          {/* {!authToken ? `Post Office Agent Assistant` : ''} */}
          Post Office Agent Assistant
        </Typography>
        {authToken && (
          <>
            <IconButton
              // aria-controls="menu"
              // aria-haspopup="true"
              onClick={handleOpenMenu}
              color="secondary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              // id="menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              getContentAnchorEl={null}
            >
              <MenuItem>
                <IconButton>
                  <NoteAddIcon />
                </IconButton>
                Add Installment
              </MenuItem>
              <MenuItem onClick={handleAddAccount}>
                <IconButton>
                  <PostAddIcon />
                </IconButton>{' '}
                Add account
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <IconButton>
                  <PowerSettingsNewIcon />
                </IconButton>
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
      <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} title="Add Account">
        <AddAccount setOpenPopup={setOpenPopup} />
      </Popup>
    </AppBar>
  );
}

export default Header;
