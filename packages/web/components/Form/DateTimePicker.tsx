import React, { useRef, useEffect, useState, useCallback } from "react";
import { KeyboardDatePicker as MUIDateTimePicker } from "@material-ui/pickers";

import { useField } from "@unform/core";
import { parse, isWithinInterval, isBefore, isAfter } from "date-fns";
import { CustomLabel, FormControl, InputContainer } from "./styles";

interface Props {
  name: string;
  label?: string;
  helperText?: string;
  autoOk?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  optionalText?: string;
  isRequiredField?: boolean;
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
  isRequiredField = false,
  optionalText = 'opcional',
  value,
  maxDate,
  minDate,
  onChange,
  ...other
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [selected, setSelected] = useState<Date | null>(null);

  useEffect(() => {
    if (!defaultValue && !value) {
      return;
    }

    setSelected(defaultValue || (value as Date));
  }, [defaultValue, value]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
      getValue: (ref: any) =>
        ref.value ? parse(ref.value, "dd/MM/yyyy HH:mm", new Date()) : null,
      clearValue: () => setSelected(defaultValue || null),
      setValue: (ref: any, val: Date | string) =>
        val ? setSelected(new Date(val)) : null,
    });
  }, [inputRef.current, fieldName, defaultValue]); // eslint-disable-line

  const onChangeDateTime = (date: Date) => {
    const newMinDate =
      typeof minDate === "string" ? new Date(minDate) : minDate;
    const newMaxDate =
      typeof maxDate === "string" ? new Date(maxDate) : maxDate;
    const newDate = date as Date;

    if (
      minDate &&
      maxDate &&
      isWithinInterval(newDate, { start: newMinDate, end: newMaxDate })
    ) {
      setSelected(newDate);
      onChange && onChange(newDate);
      return newDate;
    }

    if (minDate && isBefore(newDate, newMinDate)) {
      setSelected(newMinDate);
      onChange && onChange(newMinDate);
      return newMinDate;
    }

    if (maxDate && isAfter(newDate, newMaxDate)) {
      setSelected(newMaxDate);
      onChange && onChange(newMaxDate);
      return newMaxDate;
    }
    setSelected(newDate);
    onChange && onChange(newDate);
  };

  return (
    <FormControl error={!!error}>
      <InputContainer>
        {label && <label htmlFor={fieldName}>{label}</label>}
        {!isRequiredField && <CustomLabel>({optionalText})</CustomLabel>}
      </InputContainer>

      <MUIDateTimePicker
        autoOk={autoOk}
        clearable={clearable}
        disabled={disabled}
        disableFuture={disableFuture}
        disablePast={disablePast}
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
