import React, { useState, useEffect, useRef, forwardRef } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import pt from "react-phone-number-input/locale/pt.json";

import { useField } from "@unform/core";
import { TextField } from "@material-ui/core";

import { CustomLabel, FormControl, LabelContainer } from "./styles";

const Input: React.ForwardRefExoticComponent<
  React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<any>
> = forwardRef((props: any, ref: any) => {
  const { value, onChange, error } = props;

  return (
    <TextField
      value={value}
      onChange={onChange}
      size="small"
      margin="dense"
      fullWidth
      variant="outlined"
      inputRef={ref}
      error={!!error}
      helperText={error}
    />
  );
});

interface Props {
  name: string;
  label?: string;
  optionalText?: string;
  required?: boolean;
}

export default function InternationalPhoneMask({ name, label, required = false, optionalText = 'opcional', }: Props) {
  const inputRef: any = useRef(null);

  const { fieldName, registerField, defaultValue, error } = useField(name);

  const [selected, setSelected] = useState(defaultValue || "");

  useEffect(() => {
    setSelected(defaultValue || "");
  }, [defaultValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
      getValue: (ref: any) =>
        isValidPhoneNumber((ref.value as string).trim()) ? ref.value : null,
      clearValue: (ref: any) => setSelected(""),
      setValue: (ref: any, value: string) => setSelected(value),
    });
  }, [inputRef.current, fieldName]); // eslint-disable-line

  return (
    <FormControl error={!!error}>
      <LabelContainer>
        {label && <label htmlFor={fieldName}>{label}</label>}
        {!required && <CustomLabel>({optionalText})</CustomLabel>}
      </LabelContainer>
      <PhoneInput
        ref={inputRef}
        international
        limitMaxLength
        defaultCountry="BR"
        value={selected}
        onChange={setSelected}
        labels={pt}
        inputComponent={Input}
        error={error}
        required={required}
      />
    </FormControl>
  );
}
