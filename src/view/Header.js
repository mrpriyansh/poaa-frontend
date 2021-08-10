import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import PostAddIcon from '@material-ui/icons/PostAdd';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';

import UsingExcel from './UsingExcel';
import { useAuth } from '../services/Auth';
import { headerStyles } from '../styles/view/header';
import Popup from '../common/Popup';
import AddAccount from './AddAccount';

const ADD_ACCOUNT = 'Add Account';
const ADD_BATCH = 'Add Using Excel';

function Header() {
  const classes = headerStyles();
  const { setAuthToken, authToken } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [popupType, setPopupType] = useState('');

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
    setPopupType(ADD_ACCOUNT);
    handleClose();
  };

  const handleAddBatchAccounts = () => {
    setPopupType(ADD_BATCH);
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" classes={{ root: classes.titleRoot }}>
          Post Office Agent Assistant
        </Typography>
        {authToken && (
          <>
            <IconButton
              aria-controls="menu"
              aria-haspopup="true"
              onClick={handleOpenMenu}
              color="secondary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu"
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
                  <PostAddIcon />
                </IconButton>
                Add Installment
              </MenuItem>
              <MenuItem onClick={handleAddAccount}>
                <IconButton>
                  <NoteAddIcon />
                </IconButton>{' '}
                Add Account
              </MenuItem>
              <MenuItem onClick={handleAddBatchAccounts}>
                <IconButton>
                  <LibraryAddIcon />
                </IconButton>
                Add In Batch
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
      <Popup openPopup={popupType?.length} setOpenPopup={setPopupType} title={popupType}>
        {popupType === ADD_BATCH ? <UsingExcel /> : <AddAccount setOpenPopup={setPopupType} />}
      </Popup>
    </AppBar>
  );
}

export default Header;
