import React, { useEffect } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
    fontWeight: 'bold',
    fontSize: 13,
    padding: '0px 8px 0px 8px',
  },
  body: {
    height: '20px',
    color: theme.palette.common.black,
    fontSize: 13,
    padding: '0px 8px 0px 8px',
  },
}))(TableCell);

const customTableStyles = makeStyles(() => ({
  paginationWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '4em',
  },
  paginationRoot: {
    marginLeft: 'auto',
  },
  emptyBlock: {
    width: '100%',
    textAlign: 'center',
  },
}));

export default function CustomTable({
  rows,
  columns,
  pagination,
  paginationStartElement,
  data,
  emptyMessage,
}) {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const classes = customTableStyles();

  useEffect(() => {
    if (!pagination) setRowsPerPage(rows.length);
    if (!data) setPage(0);
  }, [rows, data, pagination]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  if (!rows?.length) {
    return <div className={classes.emptyBlock}> {emptyMessage}</div>;
  }

  return (
    <div className={classes.root}>
      {pagination && (
        <div className={classes.paginationWrapper}>
          {paginationStartElement ? paginationStartElement : null}
          <TablePagination
            rowsPerPageOptions={[rowsPerPage]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            className="pagination"
            classes={{ root: classes.paginationRoot }}
          />
        </div>
      )}
      <TableContainer
        style={{
          marginTop: '5px',
          height: 'calc(100% - 4em)',
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow style={{ height: 40 }}>
              {columns.map(column => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    width: column.width,
                  }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              return (
                <TableRow key={'key_' + index} style={{ height: 40 }}>
                  {columns.map(column => {
                    const value = row[column.id];
                    return (
                      <StyledTableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          height: '20px',
                        }}
                      >
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

CustomTable.defaultProps = {
  emptyMessage: 'No Data Found',
};
