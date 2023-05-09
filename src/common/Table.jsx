import React, { useEffect } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import makeStyles from '@mui/styles/makeStyles';

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

const customTableStyles = makeStyles(theme => ({
  paginationWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '4em',
  },
  paginationRoot: {
    marginLeft: 'auto',
    // minWidth: '16em',
  },
  emptyBlock: {
    width: '100%',
    marginTop: theme.spacing(1),
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
  defaultPageSize,
}) {
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultPageSize || 10);
  const [page, setPage] = React.useState(0);
  const classes = customTableStyles();

  useEffect(() => {
    if (!pagination) setRowsPerPage(rows?.length);
    if (!data) setPage(0);
  }, [rows, data, pagination]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className={classes.root}>
      {pagination && (
        <div className={classes.paginationWrapper}>
          <div className={classes.flexGrow} />
          {paginationStartElement ? paginationStartElement : null}
          <TablePagination
            rowsPerPageOptions={[rowsPerPage]}
            component="div"
            count={rows?.length ?? 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="pagination"
            classes={{ root: classes.paginationRoot }}
          />
        </div>
      )}

      {!rows?.length ? (
        <div className={classes.emptyBlock}> {emptyMessage}</div>
      ) : (
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
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
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
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </StyledTableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

CustomTable.defaultProps = {
  emptyMessage: 'No Data Found',
};
