import React, { useRef, useEffect, useState } from 'react';
import { DatePicker as MUIDatePicker, DatePickerProps } from '@material-ui/pickers';

import { useField } from '@unform/core';
import { parse } from 'date-fns';
import { FormControl } from './styles';

type Props = {
  name: string;
  label?: string;
  helperText?: string;
  autoOk?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  nullable?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  value?: string | Date;
  onChange?: (value: Date) => void;
} & Omit<DatePickerProps, 'value' | 'onChange'>;

export default function DatePicker({
  name,
  label,
  helperText,
  autoOk = true,
  clearable = false,
  disabled = false,
  disableFuture = false,
  disablePast = false,
  nullable = false,
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
    if (value && nullable === false) {
      const newDate = typeof value === 'string' ? new Date(value) : value;
      setSelected(newDate);
    } else if (![null, undefined].includes(defaultValue) || ![null, undefined].includes(value)) {
      setSelected(defaultValue || (value as Date));
    }
  }, [defaultValue, nullable, value]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      clearValue: () => setSelected(defaultValue || null),
      getValue: (ref: any) => (ref.value ? parse(ref.value, 'dd/MM/yyyy', new Date()) : null),
      setValue: (ref: any, val: Date | string) => {
        const newDate = typeof val === 'string' ? new Date(val) : val;
        setSelected(newDate);
      },
    });
  }, [inputRef.current, fieldName, defaultValue]); // eslint-disable-line

  const onChangeDate = (date: any) => {
    setSelected(date as Date);

    if (onChange) {
      onChange(date as Date);
    }
  };

  return (
    <FormControl error={!!error}>
      {label && <label htmlFor={fieldName}>{label}</label>}

      <MUIDatePicker
        autoOk={autoOk}
        clearable={clearable}
        disabled={disabled}
        disableFuture={disableFuture}
        disablePast={disablePast}
        format="dd/MM/yyyy"
        name={fieldName}
        value={selected}
        inputRef={inputRef}
        onChange={onChangeDate}
        inputVariant="outlined"
        size="small"
        margin="dense"
        helperText={error || helperText}
        {...other}
      />
    </FormControl>
  );
}
