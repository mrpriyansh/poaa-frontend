import React, { useState, lazy } from 'react';
import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import PostAddIcon from '@material-ui/icons/PostAdd';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from 'react-router-dom';
import HistoryIcon from '@material-ui/icons/History';

import { useAuth } from '../services/Auth';
import { headerStyles } from '../styles/components/header';

const UsingExcel = lazy(() => import('./UsingExcel'));
const Popup = lazy(() => import('../common/Popup'));
const AddAccount = lazy(() => import('./AddAccount'));
const AddInstallment = lazy(() => import('./AddInstallment'));

const ADD_ACCOUNT = 'Add Account';
const ADD_BATCH = 'Add Using Excel';
const ADD_INSTALLMENT = 'Add Installment';

function Header({ isOnline }) {
  const classes = headerStyles();
  const { setAuthToken, authToken, setUser, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [popupType, setPopupType] = useState('');
  const history = useHistory();

  const popupComponent = () => {
    switch (popupType) {
      case ADD_ACCOUNT:
        return <AddAccount setOpenPopup={setPopupType} />;
      case ADD_BATCH:
        return <UsingExcel />;
      case ADD_INSTALLMENT:
        return <AddInstallment setOpenPopup={setPopupType} />;
      default:
        <> </>;
    }
  };
  const handleOpenMenu = e => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    // event.preventDefault();
    // window.localStorage.removeItem('token');
    // setAuthToken();
    await user.logOut();
    setUser(null);
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

  const handleAddInstallment = () => {
    setPopupType(ADD_INSTALLMENT);
    handleClose();
  };

  const redirectsTo = endpoint => {
    handleClose();
    history.push(endpoint);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          classes={{ root: classes.titleRoot }}
          onClick={() => redirectsTo('/')}
        >
          Post Office Agent Assistant
        </Typography>
        {user && (
          <>
            {isOnline ? (
              <IconButton
                aria-controls="menu"
                aria-haspopup="true"
                onClick={handleOpenMenu}
                color="secondary"
              >
                <MenuIcon />
              </IconButton>
            ) : null}
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
              <MenuItem onClick={handleAddInstallment}>
                <IconButton>
                  <PostAddIcon />
                </IconButton>
                Add Installment
              </MenuItem>
              <MenuItem onClick={() => redirectsTo('/generate-list')}>
                <IconButton>
                  {' '}
                  <SettingsIcon />
                </IconButton>
                Generate List
              </MenuItem>
              <MenuItem onClick={() => redirectsTo('/previous-lists')}>
                <IconButton>
                  <HistoryIcon />
                </IconButton>
                Previous Lists
              </MenuItem>
              <MenuItem onClick={handleAddAccount}>
                <IconButton>
                  <NoteAddIcon />
                </IconButton>{' '}
                Add Account
              </MenuItem>
              {/* <MenuItem onClick={handleAddBatchAccounts}>
                <IconButton>
                  <LibraryAddIcon />
                </IconButton>
                Add In Batch
              </MenuItem> */}
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
      <Popup openPopup={Boolean(popupType?.length)} setOpenPopup={setPopupType} title={popupType}>
        {popupComponent()}
      </Popup>
    </AppBar>
  );
}

export default Header;
