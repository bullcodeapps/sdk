import React, { useEffect, useRef, useState } from 'react';
import { useField } from '@unform/core';
import { FormControlLabel, Checkbox, CheckboxProps } from '@material-ui/core';
import { FormControl } from './styles';

interface Props {
  name: string;
  label?: string;
  helperText?: string;
  value?: boolean;
}

type InputProps = CheckboxProps & Props;

export default function Check({
  name, label, helperText, size = 'small', value, onChange, ...other
}: InputProps) {
  const [checked, setChecked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    fieldName, registerField, defaultValue, error,
  } = useField(name);

  useEffect(() => {
    setChecked(defaultValue || value);
  }, [defaultValue, value]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      getValue: (ref: any) => ref.value === 'true',
      clearValue: (ref: any) => setChecked(defaultValue || false),
    });
  }, [inputRef.current, fieldName, defaultValue]); // eslint-disable-line

  return (
    <FormControl error={!!error}>
      <FormControlLabel
        control={(
          <Checkbox
            checked={checked}
            value={checked}
            onChange={(e, val: boolean) => {
              setChecked(val);
              if (onChange) {
                onChange(e, val);
              }
            }}
            inputRef={inputRef}
            size={size}
          />
        )}
        label={label}
      />

      {error && <span className="error">{error}</span>}
    </FormControl>
  );
}
