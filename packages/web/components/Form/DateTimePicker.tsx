import React, { useRef, useEffect, useState } from 'react';
import { DateTimePicker as MUIDateTimePicker } from '@material-ui/pickers';

import { useField } from '@unform/core';
import { parse } from 'date-fns';
import { FormControl } from './styles';

interface Props {
  name: string;
  label?: string;
  helperText?: string;
  autoOk?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  value?: any;
  onChange?: (date: Date) => void;
}

export default function DateTimePicker({
  name,
  label,
  helperText,
  autoOk = true,
  clearable = false,
  disabled = false,
  disableFuture = false,
  disablePast = false,
  value,
  onChange,
  ...other
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    fieldName, registerField, defaultValue, error,
  } = useField(name);
  const [selected, setSelected] = useState<Date | null>(new Date());

  useEffect(() => {
    setSelected(defaultValue || value as Date);
  }, [defaultValue, value]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      getValue: (ref: any) => (ref.value ? parse(ref.value, 'dd/MM/yyyy HH:mm', new Date()) : null),
      clearValue: () => setSelected(defaultValue || null),
      setValue: (ref: any, val: Date | string) => {
        const newDate = typeof val === 'string' ? new Date(val) : val;
        setSelected(newDate);
      }
    });
  }, [inputRef.current, fieldName, defaultValue]); // eslint-disable-line

  const onChangeDateTime = (date: Date) => {
    setSelected(date);

    onChange && onChange(date);
  };

  return (
    <FormControl error={!!error}>
      {label && <label htmlFor={fieldName}>{label}</label>}

      <MUIDateTimePicker
        autoOk={autoOk}
        clearable={clearable}
        disabled={disabled}
        disableFuture={disableFuture}
        disablePast={disablePast}
        ampm={false}
        format="dd/MM/yyyy HH:mm"
        name={fieldName}
        value={value || selected}
        inputRef={inputRef}
        onChange={onChangeDateTime}
        inputVariant="outlined"
        size="small"
        margin="dense"
        helperText={error || helperText}
        {...other}
      />
    </FormControl>
  );
}
