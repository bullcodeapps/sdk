/* eslint-disable react/jsx-no-duplicate-props */
import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import { TextField, InputAdornment } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import { FormControl } from './styles';

interface Props {
  name: string;
  label?: string;
  maxLength?: number;
  step?: string;
  startAdornment?: string | React.Component;
  endAdornment?: string | React.Component | JSX.Element;
  onChange?: (value: any) => void;
}

type InputProps = TextFieldProps & Props;

export default function Input({
  name,
  label,
  helperText,
  maxLength,
  type,
  step,
  size = 'small',
  margin = 'dense',
  fullWidth = true,
  startAdornment,
  endAdornment,
  onChange,
  ...other
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    fieldName, registerField, defaultValue, error,
  } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      getValue: (ref: any) => ref.value,
      clearValue: (ref: any) => {
        // eslint-disable-next-line no-param-reassign
        ref.value = '';
      },
    });
  }, [inputRef.current, fieldName]); // eslint-disable-line

  return (
    <FormControl error={!!error} fullWidth={fullWidth}>
      {label && type !== 'hidden' && <label htmlFor={fieldName}>{label}</label>}

      <TextField
        id={fieldName}
        type={type}
        defaultValue={defaultValue}
        size={size}
        margin={margin}
        fullWidth={fullWidth}
        error={!!error}
        helperText={type !== 'hidden' && (error || helperText)}
        inputProps={{ ref: inputRef, maxLength, step }}
        InputProps={{
          startAdornment: startAdornment && <InputAdornment position="start">{startAdornment}</InputAdornment>,
          endAdornment: endAdornment && <InputAdornment position="end">{endAdornment}</InputAdornment>,
        }}
        {...other}
        variant="outlined"
        onChange={(e: any) => onChange && onChange(e.target.value)}
      />
    </FormControl>
  );
}
