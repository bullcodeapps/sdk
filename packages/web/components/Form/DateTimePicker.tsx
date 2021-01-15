import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DateTimePicker as MUIDateTimePicker } from '@material-ui/pickers';

import { useField } from '@unform/core';
import { parse, isWithinInterval, isBefore, isAfter } from 'date-fns';
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
  maxDate?: Date;
  minDate?: Date;
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
  maxDate,
  minDate,
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
    if (value) {
      const newDate = typeof value === 'string' ? new Date(value) : value;
      setSelected(newDate);
    } else {
      setSelected(defaultValue || value as Date);
    }
  }, [defaultValue, value]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      clearValue: () => setSelected(defaultValue || null),
      getValue: (ref: any) => (ref.value ? parse(ref.value, 'dd/MM/yyyy', new Date()) : null),
      setValue: (ref: any, val: Date | string) => (val ? setSelected(new Date(val)) : null),
    });
  }, [inputRef.current, fieldName, defaultValue]); // eslint-disable-line

  const onChangeDateTime = (date: any) => {
    setSelected(date as Date);

    if (onChange) {
      onChange(date as Date);
    }
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
        minDate={minDate}
        maxDate={maxDate}
        inputVariant="outlined"
        size="small"
        margin="dense"
        helperText={error || helperText}
        {...other}
      />
    </FormControl>
  );
}
