import React from 'react';
import { Dialog, IconButton, DialogContent, DialogTitle, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles(theme => ({
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  typographyRoot: {
    fontWeight: '700',
  },
  content: {
    width: 'clamp(250px, 80vw, 600px)',
    padding: theme.spacing(2),
  },
}));
export default function Popup({ title, children, openPopup, setOpenPopup }) {
  const styles = useStyles();
  return (
    <Dialog open={openPopup}>
      <DialogTitle className={styles.dialogTitle}>
        <Typography
          variant="h6"
          component="div"
          align="center"
          classes={{ root: styles.typographyRoot }}
        >
          {title}
        </Typography>
        <IconButton onClick={() => setOpenPopup(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className={styles.content}>
        {children}
      </DialogContent>
    </Dialog>
  );
}
