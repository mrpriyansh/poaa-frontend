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

  const { data: response } = useSWR('feature-flags', axiosUtil.get);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open && Boolean(response?.data)}
      onClick={handleClose}
      action={<Button color="secondary" size="small" onClick={handleClose} text="Close" />}
      classes={{ root: classes.paperRoot }}
    >
      <MuiAlert elevation={6} variant="filled" severity={response?.data?.metaInfo?.severity}>
        {response?.data?.metaInfo?.text[i18n.language] || response?.data?.metaInfo?.text.fallBack}
      </MuiAlert>
    </Snackbar>
  );
}
