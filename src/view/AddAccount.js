import React, { useState, useEffect } from 'react';
import {useForm, Form} from '../components/useForm';
import {Grid, makeStyles} from '@material-ui/core'
import Controls from '../components/controls/Controls';
import config from '../services/config';
import { triggerAlert } from '../services/getAlert/getAlert';
import handleError from '../services/handleError';
import { useAuth } from '../services/Auth';
import { mutate } from 'swr';
import accountTypeList from '../assets/data/accountType';

const date = new Date();
const y=date.getFullYear();
const m=date.getMonth()+1;
const d=date.getDate();
const initialValues= {
    name: '',
    accountno: '',
    accountType: 'RD',
    amount: '',
    openingDate: `${y}-${m<10? `0${m}`: m}-${d<10 ? `0${d}`: d}`,
    maturityDate: `${y+5}-${m<10? `0${m}`: m}-${d<10 ? `0${d}`: d}`,
    mobile: '',
}
const useStyles = makeStyles(theme=>({
    root: {
        '& .MuiGrid-item': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }, 
        '& .MuiTextField-root': {
            width: '80%',
            margin: theme.spacing(1),
        },
        '& .MuiButton-root':{
            width: '80%',
            height: '52px',
            margin: theme.spacing(1),
        },
        '& .MuiFormControl-root':{
            width: '80%',
        }
    },
    button_wrapper:{
            margin: theme.spacing(1),
            width: '100%',
            height: '56px',
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
    }
}))
const convertDate = date => (
    `${date.split('-')[0]}-${date.split('-')[1]}-${date.split('-')[2][0]}${date.split('-')[2][1]}`
)
function AddAccount ({setOpenPopup, recordForEdit}) {
    useEffect(()=>{
        console.log(recordForEdit);
        if(recordForEdit){
            setValues(prev=>({...recordForEdit, openingDate: convertDate(recordForEdit.openingDate), maturityDate: convertDate(recordForEdit.maturityDate) }));
        }
    }, [recordForEdit]);
    const validate = (fieldValues = values) => {
        let temp = {...errors}
        if('name' in fieldValues)
            temp.name = fieldValues.name ? "": "Name is required"
        if('accountno' in fieldValues)
            temp.accountno = fieldValues.accountno.length===10 ? "": "Incorrect Account Number"
        if('amount' in fieldValues)
            temp.amount = Number.isInteger(+fieldValues.amount) ? "": "Incorrect Amount"
        if ('mobile' in fieldValues)
            temp.mobile = Number.isInteger(+fieldValues.mobile) ? "" : "Confirm Mobile Number."
        
        setErrors({...temp});
    }
    const [loading, setLoading] = useState(false);
    const {authToken} = useAuth();
    const handleAddAccount = event => {
        event.preventDefault();
        const url = recordForEdit ? `${config.apiUrl}/api/editaccount`: `${config.apiUrl}/api/addaccount`;
        setLoading(true);
        console.log(values, url);
        fetch(url,{
            method: recordForEdit? 'PUT': 'POST',
            headers: { 'Content-Type': 'application/json', authorization: `Bearer ${authToken}` },
            body: JSON.stringify(values)
        })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(res => {
            if(res.status !== 200)
                throw res;
            triggerAlert({icon: 'success', title: res.body});
            setOpenPopup(false);
            mutate(`${config.apiUrl}/api/allaccounts`);
        })
        .catch(err=>handleError(err, triggerAlert))
        .finally(()=> setLoading(false));
    }
    const styles = useStyles();
    const {values, setValues, errors, setErrors, handleInputChange} = useForm(initialValues, true, validate);
    return(
        <Form onSubmit={handleAddAccount} className={styles.root}>
            <Grid container justify="center">
                <Grid item xs={6} justify="center">
                    <Controls.Input
                        label="Name"
                        name="name"
                        value={values.name}
                        onChange={handleInputChange}
                        error={errors.name}
                        required
                    />
                    <Controls.Input
                        label="Account Number"
                        name="accountno"
                        value={values.accountno}
                        onChange={handleInputChange}
                        required
                        error={errors.accountno}
                    />
                     <Controls.Input
                        label="Opening Date"
                        name="openingDate"
                        type="date"
                        value={values.openingDate}
                        onChange={handleInputChange}
                        required
                        error={errors.openingDate}
                    />  
                    <Controls.Select
                        label="Type"
                        name="accountType"
                        value={values.accountType}
                        onChange={handleInputChange}
                        options={accountTypeList}
                        required
                        error={errors.accountType}
                    />
                </Grid>
                <Grid item xs={6} justify="center">
                   
                    <Controls.Input
                        label="Amount"
                        name="amount"
                        value={values.amount}
                        onChange={handleInputChange}
                        required
                        error={errors.amount}
                    />
                    <Controls.Input
                        label="Phone"
                        name="phone"
                        value={values.phone}
                        onChange={handleInputChange}
                        error={errors.phone}
                    />
                    <Controls.Input
                        label="Maturity Date"
                        name="maturityDate"
                        type="date"
                        value={values.maturityDate}
                        onChange={handleInputChange}
                        required
                        error={errors.maturityDate}
                    />
                    {/* <div className={styles.button_wrapper}> */}
                    <Controls.Button
                        type="submit"
                        text={recordForEdit ? `Edit Account` : "Add Account"}
                        disabled={loading}
                    />
                    {/* </div> */}
                </Grid>
            </Grid>
        </Form>
    )
}

export default AddAccount;