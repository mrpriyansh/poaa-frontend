import React, { useState, useEffect } from 'react';
import { Box, makeStyles, TableBody, TableRow, TableCell, Paper, Toolbar, TextField, InputAdornment } from '@material-ui/core';
import useTable from '../components/useTable';
import fetcher from '../services/fetcher';
import useSWR from 'swr';
import config from '../services/config';
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Controls from '../components/controls/Controls';
import Popup from "../components/Popup";
import AddAccount from './AddAccount';
import { ReactComponent as LoaderSVG} from '../assets/icons/spinner.svg';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';
import { deleteTrigger } from '../services/getAlert/getAlert';


const useStyle = makeStyles(theme=>({
    root: {
        height: 'calc(100vh - 64px)',
        background: '#fafafa',
        display: 'flex',
        justifyContent: 'center',
        // height: '100%'
    }, 
    pageContent: {
        margin: theme.spacing(0.5,5),
        padding: theme.spacing(3),
        // minWidth: '990px',
        minHeight: '100%',
        overflow: 'auto',
        '&::-webkit-scrollbar:vertical': {
            display:'none',
        }
    },
    // pageContent::-webkit-scrollbar: {
    //     display: 'none'
    // },
    newButton: {
        position: 'absolute',
        right: '0px'
    }
}));

function AllAccounts () {
    const {data, error} = useSWR(`${config.apiUrl}/api/allaccounts`, fetcher);
    const [accounts, setAccounts] = useState([]);
    const [searchValue, changeSearchValue] = useState('');
    const [openPopup, setOpenPopup] = useState(false);
    const [searchType, changeSearchType] = useState('Name');
    const [recordForEdit, setRecordForEdit] = useState();
    
    const styles = useStyle();
    useEffect(()=>{
        console.log(searchType, searchValue);
        if(data){
            const filterAccounts = data.filter(account=>{
                // console.log(typeof(account.maturityDate), convertDate(account.maturityDate), account.maturityDate.toLowerCase().includes(searchValue.toLowerCase()));
                if(searchType==='Name')
                return account.name.toLowerCase().includes(searchValue.toLowerCase());
                if(searchType==='Account Number')
                return (''+account.accountno).includes(searchValue);
                if(searchType==='Account Type')
                return account.accountType.toLowerCase().includes(searchValue.toLowerCase());
                if(searchType==='Maturity Date')
                return convertDate(account.maturityDate).toLowerCase().includes(searchValue.toLowerCase());
            })
        setAccounts(filterAccounts);
        }
    },[data, searchValue, searchType]);
    
    const searchTypeList = [{title: 'Name'},
                            {title: 'Account Number'},
                            {title: 'Account Type'},
                            {title: 'Maturity Date'}];
    const headCells = [
        {id:'index', label:'Sno'},
        {id:'name', label:'Name'},
        {id: 'accountno', label:'AccountNo'},
        {id: 'accountType', label:'Type'},
        {id: 'amount', label:'Amount'},
        {id: 'Opening', label:'Opening Date'},
        {id: 'maturityDate', label:'Maturity Date'},
        {id: 'actions', label: 'Actions'},
        // {id: 'mobile', label:'Mobile'},
    ]
    const {TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting} = useTable(accounts, headCells );
    if(error) return <p styles={{color: 'red',}}> Error in Fetching</p>
    if(!data) return <LoaderSVG />
    
    const convertDate = date => (
        `${date.split('-')[2][0]}${date.split('-')[2][1]}-${date.split('-')[1]}-${date.split('-')[0]}`
    )
    const handleEdit = item =>{
        setRecordForEdit(item);
        setOpenPopup(true);
    }
    const handleDelete = item =>{
        deleteTrigger(item.accountno);
    }
    return (
        <Box className={styles.root}>
            <Paper className={styles.pageContent}>
                <Toolbar>
                    <Controls.Input
                        label="Search"
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={event=>changeSearchValue(event.target.value)}
                    />
                    <Controls.Select
                        label="Type"
                        name="accountType"
                        value={searchType}
                        onChange={event=>changeSearchType(event.target.value)}
                        options={searchTypeList}
                        required
                    />
                    <Controls.Button
                        text="Add Account"
                        variant = "outlined"
                        startIcon = {<AddIcon />}
                        className={styles.newButton}
                        onClick={()=>(setRecordForEdit(),   setOpenPopup(true)) }
                    />
                    {/* <TextField 
                        variant ="outlined"
                        label="Search"
                        name="search"
                        value={searchValue}
                        onChange={event=>changeSearchValue(event.target.value)}
                        InputProps={{
                            startAdorment:(<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                    /> */}
                </Toolbar>
                <TblContainer>
                    <TblHead /> 
                    <TableBody>
                        {recordsAfterPagingAndSorting().map((account, index) =>(
                            <TableRow key={index}>
                                <TableCell> {index+1}</TableCell>
                                <TableCell> {account.name}</TableCell>
                                <TableCell> {account.accountno}</TableCell>
                                <TableCell> {account.accountType}</TableCell>
                                <TableCell> {account.amount}</TableCell>
                                <TableCell> {convertDate(account.openingDate)}</TableCell>
                                <TableCell> {convertDate(account.maturityDate)}</TableCell>
                                <TableCell>
                                    <Controls.ActionButton
                                     color="primary"
                                     onClick={()=>handleEdit(account)}>
                                         <EditOutlinedIcon fontSize="small" />
                                     </Controls.ActionButton>
                                    <Controls.ActionButton
                                     color="secondary"
                                     onClick={()=>handleDelete(account)}>
                                         <CloseIcon fontSize="small" />
                                     </Controls.ActionButton>
                                </TableCell>
                                {/* <TableCell> {account.mobile}</TableCell> */}

                            </TableRow>
                        ))}
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} title="Add Account">
                    <AddAccount setOpenPopup={setOpenPopup} recordForEdit={recordForEdit} />
            </Popup>
      </Box>
    )
}

export default AllAccounts;