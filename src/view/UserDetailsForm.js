import { Grid, Paper, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';
import { useHistory } from 'react-router-dom';

import Controls from '../common/controls/Controls';
import { Form, useForm } from '../common/useForm';
import { loginStyles } from '../styles/view/login';
import { useAuth } from '../services/Auth';
import handleError from '../services/handleError';
import { triggerAlert } from '../services/getAlert/getAlert';

const initialValues = {
  name: '',
};

export default function UserDetailsForm() {
  const classes = loginStyles();
  const { client, user } = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState();
  const validate = (fieldValues = values) => {
    const temp = { ...errors };
    if ('name' in fieldValues) temp.name = fieldValues.name.length > 0 ? '' : 'Enter your name';
    setErrors({ ...temp });
  };
  const { values, errors, setErrors, handleInputChange } = useForm(initialValues, true, validate);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const collection = await client.db('poaa').collection('users');
      await collection.insertOne({
        ...values,
        ...user.profile,
        userId: user.id,
      });
      await user.refreshCustomData();
      history.push('/');
    } catch (error) {
      handleError(error, triggerAlert);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper className={classes.pageContent}>
      <Form onSubmit={handleSubmit}>
        <Grid container justifyContent="center">
          <Typography variant="h5" classes={{ root: classes.titleRoot }}>
            Your Name
          </Typography>
          <Grid container item xs={12} justifyContent="center">
            <Controls.Input
              variant="outlined"
              label="Name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
              error={errors.name}
              classes={{ root: classes.inputRoot }}
            />

            <Controls.Button
              type="submit"
              text={<KeyboardArrowRightRoundedIcon />}
              disabled={loading}
              classes={{ root: classes.buttonRoot }}
            />
          </Grid>
        </Grid>
      </Form>
    </Paper>
  );
}
