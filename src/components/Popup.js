import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

import UsingExcel from '../view/UsingExcel';
import Controls from './controls/Controls';

const useStyles = makeStyles(() => ({
  dialogTitle: {
    paddingRight: '0px',
  },
  content: {
    minHeight: '330px',
    minWidth: '550px',
  },
}));
export default function Popup(props) {
  const styles = useStyles();
  const { title, children, openPopup, setOpenPopup } = props;
  const [excelPopup, setExcelPopup] = useState(false);
  return (
    <Dialog open={openPopup}>
      <DialogTitle className={styles.dialogTitle}>
        <div style={{ display: 'flex' }}>
          <Typography
            variant="h6"
            component="div"
            style={{ flexGrow: 1, alignItems: 'center', display: 'flex' }}
          >
            {title}
          </Typography>
          <Controls.Button
            text={excelPopup ? `Add One Account` : `Add using excel`}
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setExcelPopup(prev => !prev)}
          />
          <Controls.ActionButton
            color="secondary"
            onClick={() => {
              setOpenPopup(false);
            }}
          >
            <CloseIcon />
          </Controls.ActionButton>
        </div>
      </DialogTitle>
      <DialogContent dividers className={styles.content}>
        {excelPopup ? <UsingExcel /> : children}
      </DialogContent>
    </Dialog>
  );
}
