import React, { useState } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';

import { bannerStyles } from '../styles/components/banner';
import Button from '../common/controls/Button';
import { axiosUtil } from '../services/axiosinstance';

export default function Banner() {
  const classes = bannerStyles();
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(true);

  const { data: response } = useSWR('feature-flags', axiosUtil.swr);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open && Boolean(response)}
      onClick={handleClose}
      action={<Button color="secondary" size="small" onClick={handleClose} text="Close" />}
      classes={{ root: classes.paperRoot }}
    >
      <MuiAlert elevation={6} variant="filled" severity={response?.metaInfo?.severity}>
        {response?.metaInfo?.text[i18n.language] || response?.metaInfo?.text.fallBack}
      </MuiAlert>
    </Snackbar>
  );
}
