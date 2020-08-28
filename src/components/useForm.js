import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';


export function useForm(initialValues,validateOnChange = false, validate){
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const handleInputChange = e => {
        const {name, value} = e.target;
        setValues({...values, [name]: value});
        if(validateOnChange)
        validate({[name]: value});
    }


    return {
        values, setValues, errors, setErrors, handleInputChange
    }
}
const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: '80%',
            margin: theme.spacing(1)
        }
    }
}))

export function Form(props) {
    const styles = useStyles();
    const { children, ...other} = props;
    return (
        <form className={styles.root} {...other}>
            {children}
        </form>
    );
};
