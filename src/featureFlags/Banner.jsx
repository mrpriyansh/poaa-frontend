import React, { useState } from 'react';
import MuiAlert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { bannerStyles } from '../styles/components/banner';
import Button from '../common/controls/Button';

export default function Banner({ data }) {
  const classes = bannerStyles();
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(true);
  const { url: redirectionUrl } = data?.metaInfo || {};

  const handleClose = () => {
    if (redirectionUrl) {
      window.open(redirectionUrl);
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open && Boolean(data)}
      onClick={handleClose}
      action={<Button color="secondary" size="small" onClick={handleClose} text="Close" />}
      classes={{ root: `${classes.paperRoot} , ${redirectionUrl ? classes.cPointer : ''}` }}
    >
      <MuiAlert elevation={6} variant="filled" severity={data?.metaInfo?.severity}>
        {data?.metaInfo?.text[i18n.language] || data?.metaInfo?.text.fallBack}
      </MuiAlert>
    </Snackbar>
  );
}
