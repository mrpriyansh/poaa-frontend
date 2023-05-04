import React, { useState } from 'react';
import MuiAlert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';

import { bannerStyles } from '../styles/components/banner';
import Button from '../common/controls/Button';
import { axiosUtil } from '../services/axiosinstance';

export default function Banner({ data }) {
  const classes = bannerStyles();
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open && Boolean(data)}
      onClick={handleClose}
      action={<Button color="secondary" size="small" onClick={handleClose} text="Close" />}
      classes={{ root: classes.paperRoot }}
    >
      <MuiAlert elevation={6} variant="filled" severity={data?.metaInfo?.severity}>
        {data?.metaInfo?.text[i18n.language] || data?.metaInfo?.text.fallBack}
      </MuiAlert>
    </Snackbar>
  );
}
