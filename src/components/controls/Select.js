import React from 'react';
import { MenuItem, TextField } from '@material-ui/core';

export default function Select(props) {
  const { name, label, variant, value, error = null, onChange, options, ...other } = props;

  return (
    <TextField
      select
      variant={variant ? variant : 'outlined'} // eslint-disable-line no-unneeded-ternary
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...other}
      {...(error && { error: true, helperText: error })}
    >
      {options.map(item => (
        <MenuItem key={item.title} value={item.title}>
          {item.title}
        </MenuItem>
      ))}
    </TextField>
  );
}
