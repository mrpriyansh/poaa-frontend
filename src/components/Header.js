import React, { useState, lazy, useMemo } from 'react';
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
import { useTranslation } from 'react-i18next';

import { useAuth } from '../services/Auth';
import { headerStyles } from '../styles/components/header';
import locales from '../assets/data/locales';

const UsingExcel = lazy(() => import('./UsingExcel'));
const Popup = lazy(() => import('../common/Popup'));
const AddAccount = lazy(() => import('./AddAccount'));
const AddInstallment = lazy(() => import('./AddInstallment'));

const ADD_BATCH = 'Add Using Excel';

function Header() {
  const classes = headerStyles();
  const { t, i18n } = useTranslation();
  const { setUser, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [popupType, setPopupType] = useState('');
  const history = useHistory();

  const ADD_ACCOUNT = useMemo(() => t('account.add'), [t]);
  const ADD_INSTALLMENT = useMemo(() => t('installment.add'));

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
      text: t('installment.add'),
    },
    {
      onClickFunc: () => redirectsTo('/create-list'),
      isDisabled: !isPortalDetails,
      icon: <SettingsIcon />,
      text: t('list.create'),
    },
    {
      onClickFunc: () => redirectsTo('/previous-lists'),
      isDisabled: !isPortalDetails,
      icon: <HistoryIcon />,
      text: t('list.previous'),
    },

    {
      onClickFunc: handleAddAccount,
      isDisabled: !isPortalDetails,
      icon: <NoteAddIcon />,
      text: t('account.add'),
    },
    // {
    //   onClickFunc: handleAddBatchAccounts,
    //   isDisabled: !isPortalDetails,
    //   icon: <LibraryAddIcon />,
    //   text: 'Add In Batch',
    // },
    {
      onClickFunc: () => redirectsTo('/user-details'),
      icon: <PersonOutline />,
      text: t('operation.updateDetails'),
    },
    { onClickFunc: handleLogout, icon: <PowerSettingsNewIcon />, text: t('operation.logout') },
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
        {Object.keys(locales).map(lng => (
          <button key={lng} onClick={() => i18n.changeLanguage(lng)} type="submit">
            {locales[lng].nativeName}
          </button>
        ))}
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
                      &nbsp;{optionDetails.text}
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
