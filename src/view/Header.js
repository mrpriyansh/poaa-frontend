import React from 'react';
import { makeStyles, CssBaseline, Typography} from '@material-ui/core';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import { useAuth } from '../services/Auth';
const useStyles = makeStyles({
    root:{
        background: '#3454d1'
    },
    title:{
        color: '#000',
    },
    grow: {
        flexGrow: 1,
    },
    button: {
    },
    '& .MuiButton-label':{
        color: '#fff'
    }
  })

function Header() {
    const classes = useStyles();
    const {setAuthToken, authToken} = useAuth();
    const handleLogout = event => {
        event.preventDefault();
        window.localStorage.removeItem('token');
        setAuthToken();
    }
    return (
        <AppBar position="static" className={classes.root}>
            <Toolbar>
                <Typography variant='h4' className={classes.title}>
                    POAA
                </Typography>
                <div className={classes.grow} />
                {authToken && <>
                    
                <Button onClick={handleLogout}>Logout</Button>
                </>}
            </Toolbar>
        </AppBar>
    )
}

export default Header;