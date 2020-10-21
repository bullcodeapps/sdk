import React, { useState, useRef, useEffect, useCallback, memo } from 'react';

import { Container, SwitchLine, SwitchLabel, SwitchButton } from './styles';
import { ViewProps, Switch } from 'react-native';
import { useField } from '@unform/core';
import { FormFieldType } from '..';

type FormSwitchProps = {
  name?: string;
  label?: string | React.ReactNode;
  defaultValue?: boolean;
  value?: boolean;
  onChange?: (value?: boolean) => void;
  rest?: ViewProps;
  clear?: () => void;
};

type FieldType = FormFieldType<Switch>;

const FormSwitch = ({
  name,
  label,
  onChange,
  value: propValue,
  defaultValue = false,
  clear: propClear,
  ...rest
}: FormSwitchProps) => {
  // States
  const [value, setValue] = useState<boolean>(defaultValue);
  const { fieldName, registerField } = useField(name);

  // Refs
  const switchRef = useRef<FieldType>(null);

  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  const clear = useCallback(() => {
    if (defaultValue !== undefined && defaultValue !== null) {
      setValue(defaultValue);
      return;
    }
    setValue(false);
  }, [defaultValue]);

  useEffect(() => {
    if (propClear) {
      propClear = clear;
    }
  }, []);

  const handleChange = useCallback(
    (res: boolean) => {
      setValue(res);
      onChange && onChange(res);
      switchRef?.current?.validate && switchRef.current.validate(res);
    },
    [onChange],
  );

  useEffect(() => {
    registerField<boolean>({
      name: fieldName,
      ref: switchRef.current,
      clearValue: clear,
      setValue: (ref: Switch, val: boolean) => handleChange(val),
      getValue: () => value,
    });
  }, [clear, fieldName, handleChange, registerField, value]);

  return (
    <Container {...rest}>
      <SwitchLine>
        {typeof label === 'string' ? <SwitchLabel>{label}</SwitchLabel> : label}
        <SwitchButton ref={switchRef} onValueChange={handleChange} value={value} />
      </SwitchLine>
    </Container>
  );
};

export default memo(FormSwitch);
