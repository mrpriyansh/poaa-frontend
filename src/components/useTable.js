import React, { useState } from 'react';
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  makeStyles,
  TablePagination,
  TableSortLabel,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  table: {
    marginTop: theme.spacing(3),
    '& thead th': {
      fontWeight: '600',
      color: "#fff",
      // background: theme.palette.primary.light,
      background: "#3454d1",
    },
    '& thead tr':{
      borderRadius: '5px',
    },
    '& tbody td': {
      fontWeight: '300',
    },
    '& tbody tr:hover': {
      backgroundColor: '#fffbf2',
    },
  },
}));

function useTable(accounts, headCells, filterFn) {
  const classes = useStyles();

  const pages = [10, 30, 50,100];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[0]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  const TblContainer = props => <Table className={classes.table}>{props.children}</Table>;
  const TblHead = props => {
    const handleSortRequest = cellId => {
      const isAsc = orderBy === cellId && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(cellId);
    };
    return (
      <TableHead>
        <TableRow>
          {headCells.map(headCell => (
            <TableCell key={headCell.id}>{headCell.label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const TblPagination = () => (
    <TablePagination
      component="div"
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={pages}
      count={accounts.length}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
  const recordsAfterPagingAndSorting = () => {
    return accounts.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };
  return {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  };
}

export default useTable;
