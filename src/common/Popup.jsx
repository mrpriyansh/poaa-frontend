import React, { lazy } from 'react';
import { Dialog, IconButton, DialogContent, DialogTitle, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import {
  ADD_ACCOUNT,
  ADD_INSTALLMENT,
  EDIT_ACCOUNT,
  EDIT_INSTALLMENT,
  REQUEST_NOTIFICATION,
} from '../services/constants';
import RequestNotification from '../components/RequestNotification';

const AddInstallment = lazy(() => import('../components/AddInstallment'));
const AddAccount = lazy(() => import('../components/AddAccount'));

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
export default function Popup({ title, children, openPopup, setOpenPopup, disableClosing }) {
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
        {disableClosing && (
          <IconButton onClick={() => setOpenPopup({ type: '' })}>
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent dividers className={styles.content}>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export const GeneratePopupComponent = function(props) {
  switch (props.type) {
    case EDIT_ACCOUNT:
    case ADD_ACCOUNT:
      return <AddAccount {...props} />;
    case EDIT_INSTALLMENT:
    case ADD_INSTALLMENT:
      return <AddInstallment {...props} />;
    case REQUEST_NOTIFICATION:
      return <RequestNotification {...props} />;
    default:
      <div> Work in progress</div>;
  }
};
