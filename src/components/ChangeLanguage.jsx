import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ReactComponent as ChangeLngSVG } from '../assets/icons/changeLanguage.svg';
import { ReactComponent as HindiSVG } from '../assets/icons/hindi.svg';
import { ReactComponent as EnglishSVG } from '../assets/icons/english.svg';
import locales from '../assets/data/locales';

// Not a good approach
const lngIcon = {
  enUS: <EnglishSVG width="1.5em" height="1.5em" />,
  hiIN: <HindiSVG width="1em" height="1em" />,
};
export default function ChangeLanguage({ handleCloseParent }) {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenMenu = e => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = e => {
    const { dataset } = e.currentTarget;
    i18n.changeLanguage(dataset?.lngCode);
    handleClose();
    handleCloseParent();
  };
  return (
    <>
      <MenuItem onClick={handleOpenMenu} aria-controls="menu" aria-haspopup="true">
        <ChangeLngSVG width="2.5em" height="2.5em" />
        &nbsp;Language
      </MenuItem>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {Object.keys(locales).map(lng => {
          return (
            <MenuItem onClick={handleMenuClick} data-lng-code={lng} key={lng}>
              <IconButton> {lngIcon[lng]}</IconButton>
              {locales[lng].nativeName}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
