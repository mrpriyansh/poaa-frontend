import React from 'react';
import { TextField } from '@mui/material';

export default function Input(props) {
  const { name, label, variant, value, error = null, onChange, ...other } = props;
  return (
    <TextField
      variant={variant ? variant : 'outlined'} // eslint-disable-line no-unneeded-ternary
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  );
}
