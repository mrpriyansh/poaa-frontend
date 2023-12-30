import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonOutline from '@mui/icons-material/PersonOutline';
import MoneyOffCsredIcon from '@mui/icons-material/MoneyOffCsred';
import { useHistory } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import { useTranslation } from 'react-i18next';
import { List } from '@mui/icons-material';

import { useDispatch } from 'react-redux';
import { useAuth } from '../services/Auth';
import { headerStyles } from '../styles/components/header';
import ChangeLanguage from './ChangeLanguage';
import { setPopup } from '../redux/popup';
import { ADD_ACCOUNT, ADD_INSTALLMENT } from '../services/constants';

// const ADD_BATCH = 'Add Using Excel';

function Header() {
  const classes = headerStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user, setAuthToken } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  // const ADD_ACCOUNT = useMemo(() => t('account.add'), [t]);
  // const ADD_INSTALLMENT = useMemo(() => t('installment.add'), [t]);

  const handleOpenMenu = e => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    handleClose();
  };

  const handleAddAccount = () => {
    dispatch(setPopup({ type: ADD_ACCOUNT, title: t(ADD_ACCOUNT) }));
    handleClose();
  };

  // eslint-disable-next-line
  // const handleAddBatchAccounts = () => {
  //   setPopupType(ADD_BATCH);
  //   handleClose();
  // };

  const handleAddInstallment = () => {
    dispatch(setPopup({ type: ADD_INSTALLMENT, title: t(ADD_INSTALLMENT) }));
    handleClose();
  };

  const redirectsTo = endpoint => {
    handleClose();
    history.push(endpoint);
  };

  const isPortalDetails = user?.pPassword?.length;
  const menuOptions = [
    {
      id: 'add_installment',
      onClickFunc: handleAddInstallment,
      isDisabled: !isPortalDetails,
      icon: <PostAddIcon />,
      text: t('installment.add'),
    },
    {
      id: 'create_list',
      onClickFunc: () => redirectsTo('/create-list'),
      isDisabled: !isPortalDetails,
      icon: <SettingsIcon />,
      text: t('list.create'),
    },
    {
      id: 'previous_lists',
      onClickFunc: () => redirectsTo('/previous-lists'),
      isDisabled: !isPortalDetails,
      icon: <HistoryIcon />,
      text: t('list.previous'),
    },
    {
      id: 'unpaidInstallments',
      onClickFunc: () => redirectsTo('/unpaid-installments'),
      isDisabled: !isPortalDetails,
      icon: <MoneyOffCsredIcon />,
      text: t('account.unpaid'),
    },

    {
      id: 'accounts',
      onClickFunc: () => redirectsTo('/accounts'),
      isDisabled: !isPortalDetails,
      icon: <List />,
      text: t('account.all'),
    },

    {
      id: 'add_account',
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
            classes={{ paper: classes.menuPaper }}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            {user ? (
              [
                <MenuItem key="saluation">
                  <Typography variant="body1">Hi {user?.name || 'User'}!</Typography>
                </MenuItem>,
                menuOptions.map((optionDetails, index) => {
                  // only to render the logout button at last
                  if (index === menuOptions.length - 1)
                    return [
                      <ChangeLanguage handleCloseParent={handleClose} />,
                      <MenuItem
                        key={optionDetails.id}
                        onClick={optionDetails.onClickFunc}
                        disabled={optionDetails.isDisabled}
                      >
                        <IconButton>{optionDetails.icon}</IconButton>
                        &nbsp;{optionDetails.text}
                      </MenuItem>,
                    ];
                  return (
                    <MenuItem
                      key={optionDetails.id}
                      onClick={optionDetails.onClickFunc}
                      disabled={optionDetails.isDisabled}
                    >
                      <IconButton>{optionDetails.icon}</IconButton>
                      &nbsp;{optionDetails.text}
                    </MenuItem>
                  );
                }),
              ]
            ) : (
              <ChangeLanguage handleCloseParent={handleClose} />
            )}
          </Menu>
        </>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
