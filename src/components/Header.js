import React, { useState, lazy } from 'react';
import { Online } from 'react-detect-offline';
import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import PostAddIcon from '@material-ui/icons/PostAdd';
import SettingsIcon from '@material-ui/icons/Settings';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import PersonOutline from '@material-ui/icons/PersonOutline';
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

function Header() {
  const classes = headerStyles();
  const { setUser, user } = useAuth();
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
    await user?.logOut();
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

  const isPortalDetails = user?.customData?.pPassword?.length;
  const menuOptions = [
    {
      onClickFunc: handleAddInstallment,
      isDisabled: !isPortalDetails,
      icon: <PostAddIcon />,
      text: 'Add Installment',
    },
    {
      onClickFunc: () => redirectsTo('/generate-list'),
      isDisabled: !isPortalDetails,
      icon: <SettingsIcon />,
      text: 'Generate List',
    },
    {
      onClickFunc: () => redirectsTo('/previous-lists'),
      isDisabled: !isPortalDetails,
      icon: <HistoryIcon />,
      text: 'Previuos Lists',
    },

    {
      onClickFunc: handleAddAccount,
      isDisabled: !isPortalDetails,
      icon: <NoteAddIcon />,
      text: 'Add Account',
    },
    {
      onClickFunc: handleAddBatchAccounts,
      isDisabled: !isPortalDetails,
      icon: <LibraryAddIcon />,
      text: 'Add In Batch',
    },
    {
      onClickFunc: () => redirectsTo('/user-details'),
      icon: <PersonOutline />,
      text: 'Update Details',
    },
    { onClickFunc: handleLogout, icon: <PowerSettingsNewIcon />, text: 'Logout' },
  ];

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
        <Online>
          {user && (
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
                  <Typography variant="body1">Hi {user?.customData?.name}!</Typography>
                </MenuItem>
                {menuOptions.map(optionDetails => {
                  return (
                    <MenuItem
                      onClick={optionDetails.onClickFunc}
                      disabled={optionDetails.isDisabled}
                    >
                      <IconButton>{optionDetails.icon}</IconButton>
                      {optionDetails.text}
                    </MenuItem>
                  );
                })}
              </Menu>
            </>
          )}{' '}
        </Online>
      </Toolbar>
      <Popup openPopup={Boolean(popupType?.length)} setOpenPopup={setPopupType} title={popupType}>
        {popupComponent()}
      </Popup>
    </AppBar>
  );
}

export default Header;
