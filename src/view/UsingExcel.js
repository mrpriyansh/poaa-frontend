// eslint-disable no-shadow

import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import NewWindow from 'react-new-window';
import XLSX from 'xlsx';
import StatisticList from './StatisticList';
import Controls from '../components/controls/Controls'; // eslint-disable-line import/order
import accountTypeList from '../assets/data/accountType';
import config from '../services/config';
import { triggerAlert } from '../services/getAlert/getAlert';
import { useAuth } from '../services/Auth';
import { usingExcelStyles } from '../styles/view/usingExcel';

function UsingExcel() {
  const classes = usingExcelStyles();
  const [file, setFile] = useState();
  const [data, setData] = useState([]);
  const [failedCount, setFailedCount] = useState([]);
  const [addedCount, setAddedCount] = useState([]);
  const [matureCount, setMatureCount] = useState([]);
  const [alreadyCount, setAlreadyCount] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authToken } = useAuth();
  const [type, setType] = useState('RD');
  useEffect(() => {
    if (data.length) {
      data.forEach(account => {
        if (
          !account['Account No'] ||
          !account['Account Name'] ||
          !account['Denomination'] || // eslint-disable-line dot-notation
          !account['Month Paid Upto']
        )
          return setFailedCount(prev => [
            ...prev,
            {
              name: account['Account Name'],
              accountno: account['Account No'],
              accountType: 'RD',
            },
          ]);
        if (!account.Date)
          return setMatureCount(prev => [
            ...prev,
            {
              name: account['Account Name'],
              accountno: account['Account No'],
              accountType: 'RD',
              amount: account.Denomination.split('.')[0].replace(',', ''),
            },
          ]);
        const date = new Date(account.Date);
        const openingDate = new Date(date.setMonth(date.getMonth() - account['Month Paid Upto']));
        const maturityDate = new Date(
          date.setFullYear(date.getFullYear() + 5 * Math.ceil(account['Month Paid Upto'] / 60))
        );
        fetch(`${config.apiUrl}/api/addaccount`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', authorization: `Bearer ${authToken}` },
          body: JSON.stringify({
            name: account['Account Name'],
            accountno: account['Account No'],
            accountType: 'RD',
            amount: account.Denomination.split('.')[0].replace(',', ''),
            openingDate,
            maturityDate,
          }),
        })
          .then(response =>
            response.json().then(data => ({ status: response.status, body: data }))
          )
          .then(res => {
            if (res.status === 200) {
              setAddedCount(prev => [
                ...prev,
                {
                  name: account['Account Name'],
                  accountno: account['Account No'],
                  accountType: 'RD',
                  amount: account.Denomination.split('.')[0].replace(',', ''),
                  openingDate,
                  maturityDate,
                },
              ]);
            } else if (res.status === 409) {
              setAlreadyCount(prev => [
                ...prev,
                {
                  name: account['Account Name'],
                  accountno: account['Account No'],
                  accountType: 'RD',
                  amount: account.Denomination.split('.')[0].replace(',', ''),
                  openingDate,
                  maturityDate,
                },
              ]);
            } else throw res;
          })
          .catch(() => {
            setFailedCount(prev => [
              ...prev,
              {
                name: account['Account Name'],
                accountno: account['Account No'],
                accountType: 'RD',
                amount: account.Denomination.split('.')[0].replace(',', ''),
                openingDate,
                maturityDate,
              },
            ]);
          });
      });
    }
  }, [data, authToken]);
  useEffect(() => {
    if (
      data.length &&
      addedCount.length + alreadyCount.length + failedCount.length + matureCount.length ===
        data.length
    ) {
      triggerAlert({ icon: 'success', title: 'Completed' });
      setLoading(false);
    }
  }, [data.length, addedCount, alreadyCount, failedCount, matureCount]);
  const handleFileChange = event => {
    setFile(event.target.files[0]);
  };
  const handleConvert = () => {
    if (!file) return triggerAlert({ icon: 'error', title: 'Insert File' });
    if (!type.length) return triggerAlert({ icon: 'error', title: 'Select valid Type' });
    setLoading(true);
    setAddedCount([]);
    setAlreadyCount([]);
    setFailedCount([]);
    setMatureCount([]);
    setData([]);
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = e => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */
      setData(data);
    };

    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };
  const { setStatsData, statsData } = useAuth();
  const handleRoute = data => {
    setStatsData(data);
  };
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid items xs={6}>
          <Controls.Input
            type="file"
            accept=".xlsx, .xlx"
            onChange={handleFileChange}
            disabled={loading}
          />
          <Controls.Button text="Add All Accounts" onClick={handleConvert} disabled={loading} />
          <Controls.Button
            variant="outlined"
            text={`Failed - ${failedCount.length}`}
            color="secondary"
            disabled={loading || !failedCount.length}
            onClick={() => handleRoute(failedCount)}
          />
          <Controls.Button
            variant="outlined"
            text={`Full Paid Account - ${matureCount.length}`}
            color="default"
            disabled={loading || !matureCount.length}
            onClick={() => handleRoute(matureCount)}
          />
        </Grid>
        <Grid items xs={6}>
          <Controls.Select
            label="Type"
            name="accountType"
            value={type}
            onChange={e => setType(e.target.value)}
            options={accountTypeList}
            required
            error={!type.length}
          />
          <Controls.Button
            variant="outlined"
            text={`Already Added - ${alreadyCount.length}`}
            color="default"
            disabled={loading || !alreadyCount.length}
            onClick={() => handleRoute(alreadyCount)}
          />
          <Controls.Button
            variant="outlined"
            text={`Uploaded Successfully - ${addedCount.length}`}
            color="primary"
            disabled={loading || !addedCount.length}
            onClick={() => handleRoute(addedCount)}
          />
          <Controls.Button
            variant="outlined"
            text={`Total Account - ${data.length}`}
            disabled={!data.length}
            color="default"
          />
        </Grid>
      </Grid>
      {statsData.length ? (
        <NewWindow onUnload={() => setStatsData([])}>
          <StatisticList />
        </NewWindow>
      ) : null}
    </div>
  );
}

export default UsingExcel;
