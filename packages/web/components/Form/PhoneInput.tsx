import React, { useState, useEffect, useRef, forwardRef } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import pt from "react-phone-number-input/locale/pt.json";

import { useField } from "@unform/core";
import { TextField } from "@material-ui/core";

import { FormControl } from "./styles";

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
}

export default function InternationalPhoneMask({ name, label }: Props) {
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
      {label && <label htmlFor={fieldName}>{label}</label>}
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
      />
    </FormControl>
  );
}
