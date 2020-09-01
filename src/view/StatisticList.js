import React, { useState, useEffect } from 'react';
import { Box, makeStyles, TableBody, TableRow, TableCell, Paper, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from '../components/useTable';
import { Search } from "@material-ui/icons";
import {useAuth} from '../services/Auth';
import Controls from '../components/controls/Controls';
import Popup from "../components/Popup";
import AddAccount from './AddAccount';

const useStyle = makeStyles(theme=>({
    root: {
        height: 'calc(100vh - 64px)',
        background: '#fafafa',
        display: 'flex',
        justifyContent: 'center',
        // height: '100%'
    }, 
    pageContent: {
        margin: theme.spacing(0,5),
        padding: theme.spacing(3),
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

function StatisticList () {
    const [accounts, setAccounts] = useState([]);
    const [searchValue, changeSearchValue] = useState('');
    const [openPopup, setOpenPopup] = useState(false);
    const styles = useStyle();
    const {statsData} = useAuth();
    useEffect(()=>{
        if(statsData){
            const filterAccounts = statsData.filter(account=>{
                return account.name && account.name.toLowerCase().includes(searchValue.toLowerCase());
            })
        setAccounts(filterAccounts);
        }
    },[statsData, searchValue]);
    
    const headCells = [
        {id:'index', label:'Sno'},
        {id:'name', label:'Name'},
        {id: 'accountno', label:'AccountNo'},
        {id: 'accountType', label:'Type'},
        {id: 'amount', label:'Amount'},
        {id: 'Opening', label:'Opening Date'},
        {id: 'maturityDate', label:'Maturity Date'},
        {id: 'mobile', label:'Mobile'},
    ]
    const {TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting} = useTable(accounts, headCells );
    if(!statsData) return <p> Loading</p>
    
    const convertDate = date => {
        return (
        date?.split('-')?.length>=2 ?`${date.split('-')[2][0]}${date.split('-')[2][1]}-${date.split('-')[1]}-${date.split('-')[0]}`: null
    )}
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
                                <TableCell> {convertDate(account.openingDate?.toString())}</TableCell>
                                <TableCell> {convertDate(account.maturityDate?.toString())}</TableCell>
                                <TableCell> {account.mobile}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} title="Add Account">
                    <AddAccount setOpenPopup={setOpenPopup}/>
            </Popup>
      </Box>
    )
}

export default StatisticList;