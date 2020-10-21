import React, { useRef, useEffect, useState } from 'react';
import { KeyboardTimePicker as MUITimePicker } from '@material-ui/pickers';

import { useField } from '@unform/core';
import { FormControl } from './styles';


interface Props {
  name: string;
  label?: string;
  helperText?: string;
  autoOk?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  disablePast?: boolean;
}

export default function Picker({
  name,
  label,
  helperText,
  autoOk = true,
  clearable = false,
  disabled = false,
  ...other
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    fieldName, registerField, defaultValue, error,
  } = useField(name);
  const [selected, setSelected] = useState<Date | null>(new Date());

  useEffect(() => {
    setSelected(defaultValue as Date);
  }, [defaultValue, setSelected]);

  function setValueToState(value: string) {
    const [hour, minute] = value.split(':');

    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));

    setSelected(date);
  }

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      getValue: (ref: any) => ref.value,
      clearValue: () => setSelected(defaultValue || null),
      setValue: (ref: any, value: Date | string) => setValueToState(String(value)),
    });
  }, [inputRef.current, fieldName, defaultValue]); // eslint-disable-line

  return (
    <FormControl error={!!error}>
      {label && <label htmlFor={fieldName}>{label}</label>}

      <MUITimePicker
        autoOk={autoOk}
        clearable={clearable}
        disabled={disabled}
        name={fieldName}
        value={selected}
        inputRef={inputRef}
        onChange={(date: any) => setSelected(date as Date)}
        inputVariant="outlined"
        size="small"
        margin="dense"
        helperText={error || helperText}
        cancelLabel="Cancelar"
        okLabel="Confirmar"
        ampm={false}
        {...other}
      />
    </FormControl>
  );
}
