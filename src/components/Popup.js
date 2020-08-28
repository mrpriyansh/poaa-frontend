import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';

export default function Popup(props){
    const {title, children, openPopup, setOpenPopUp} = props;
    return (
        <Dialog open={openPopup}>
            <DialogTitle>
                <div> title goes here.</div>
            </DialogTitle>
            <DialogContent>
               {children}
            </DialogContent>
        </Dialog>
    )
}