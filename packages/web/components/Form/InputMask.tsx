import React, { useRef, useState, useEffect } from 'react';
import MaskInput, { Props } from 'react-input-mask';
import { useField } from '@unform/core';
import { TextField, FormHelperText } from '@material-ui/core';
import { FormControl, InputContainer, CustomLabel } from './styles';

export interface MaskInputProps extends Props {
  name: string;
  label?: string;
  mask: string;
  helperText?: string;
  optionalText?: string;
  required?: boolean;
}

export default function InputMask({
  label, name, mask, helperText, required = false, optionalText = 'opcional', ...other
}: MaskInputProps) {
  const inputRef: any = useRef(null);
  const {
    fieldName, registerField, defaultValue, error,
  } = useField(name);
  const [inputMask, setInputMask] = useState(defaultValue || null);

  useEffect(() => {
    setInputMask(defaultValue || null);
  }, [defaultValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'props.value',
      clearValue: (pickerRef: any) => setInputMask(''),
      setValue: (ref: any, value: string) => setInputMask(value),
    });
  }, [inputRef.current, fieldName]); // eslint-disable-line

  function handleMask(e: any) {
    const { value } = e.target;
    return setInputMask(value);
  }

  return (
    <FormControl error={!!error}>
      <InputContainer>
          {label && <label htmlFor={fieldName}>{label}</label>}
          {!required && <CustomLabel>({optionalText})</CustomLabel>}
      </InputContainer>

      <MaskInput
        name={fieldName}
        mask={mask}
        value={inputMask}
        onChange={(e) => handleMask(e)}
        ref={inputRef}
        {...other}
      >
        {(inputProps: any) => (
          <TextField
            {...inputProps}
            variant="outlined"
            size="small"
            margin="dense"
            fullWidth
          />
        )}
      </MaskInput>
      {(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
    </FormControl>
  );
}
