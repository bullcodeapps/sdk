import React, { useRef, useEffect, useState } from 'react';

import { useField } from '@unform/core';
import {
  Select as MUISelect, MenuItem, FormHelperText,
} from '@material-ui/core';
import { SelectProps as MUISelectProps } from '@material-ui/core/Select';
import _ from 'lodash';
import { CustomLabel, FormControl, InputContainer } from "./styles";

export interface SelectOption {
  id: string;
  title: string;
  disabled?: boolean;
}

interface SelectProps extends MUISelectProps {
  name: string;
  label?: string;
  helperText?: string;
  options: SelectOption[];
  optionalText?: string;
  required?: boolean;
  value?: any;
  onChange?: (value?: any) => any;
}

export default function Select({
  name,
  label,
  helperText,
  options,
  native = false,
  multiple,
  margin = 'dense',
  fullWidth = true,
  required = false,
  optionalText = 'opcional',
  onChange,
  value: originalValue,
  ...other
}: SelectProps) {
  function getDefaultValue(value: string | string[]) {
    /** for multiple select */
    if (multiple) {
      return _.isEmpty(value) && !_.isArray(value) ? [] : value;
    }

    return value;
  }

  const inputRef = useRef<HTMLSelectElement>(null);
  const {
    fieldName, registerField, defaultValue = '', error,
  } = useField(name);
  const [value, setValue] = useState(getDefaultValue(defaultValue));

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (originalValue !== undefined) {
      setValue(originalValue);
    }
  }, [originalValue]);

  useEffect(() => {
    if (inputRef.current) {
      registerField({
        name: fieldName,
        ref: inputRef.current,
        path: 'value',
        setValue: (ref: any, val: string) => setValue(getDefaultValue(val)),
      });
    }
  }, [inputRef.current, fieldName, value]); // eslint-disable-line

  function handleChange(event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) {
    if (event.target) {
      const elmValue: any = event.target.value;

      /** update state only if controlled component */
      if (!native) {
        setValue(elmValue);
        if (onChange) {
          onChange(elmValue);
        }
      }
    }
  }

  const props = {
    ...other,
    native,
    multiple,
    value: native === false ? value : undefined,
    name: fieldName,
    inputProps: {
      ref: inputRef,
      name: fieldName,
      id: fieldName,
      'aria-label': fieldName,
    },
    onChange: handleChange,
  };

  return (
    <FormControl error={!!error}>
      <InputContainer>
        {label && <label htmlFor={fieldName}>{label}</label>}
        {!required && <CustomLabel>({optionalText})</CustomLabel>}
      </InputContainer>
      <MUISelect
        {...props}
        variant="outlined"
        margin={margin}
        fullWidth={fullWidth}
        error={!!error}
        value={value}
        required={required}
      >
        {options.map(({ id, title, disabled = false }) => {
          if (native) {
            return (
              <option
                key={id}
                value={id}
                disabled={disabled}
              >
                {title}
              </option>
            );
          }

          return (
            <MenuItem
              key={id}
              value={id}
              disabled={disabled}
            >
              {title}
            </MenuItem>
          );
        })}
      </MUISelect>
      {(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
    </FormControl>
  );
}
