import React, { useState, useRef, useEffect, useCallback, memo, useContext, useMemo } from 'react';

import { Container, SwitchLine, SwitchLabel, SwitchButton, Content } from './styles';
import { Switch, SwitchProps, TextStyle, ViewStyle } from 'react-native';
import { useField } from '@unform/core';
import { FormFieldType } from '..';

import { SwitchContextType, SwitchContext } from './context';

type FormSwitchProps = {
  name?: string;
  theme?: string;
  label?: string | React.ReactNode;
  defaultValue?: boolean;
  value?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  switchButtonStyle?: TextStyle;
  onChange?: (value?: boolean) => void;
  clear?: () => void;
} & Omit<SwitchProps, 'trackColor' | 'thumbColor' | 'ios_backgroundColor'>;

type FieldType = FormFieldType<Switch>;

const FormSwitch = ({
  name,
  theme,
  label,
  onChange,
  value: propValue,
  defaultValue = false,
  clear: propClear,
  style,
  contentContainerStyle,
  switchButtonStyle,
  ...rest
}: FormSwitchProps) => {
  const ctx = useContext<SwitchContextType>(SwitchContext);

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

  const selectedStyle = useCallback(() => {
    const colors = ctx?.styles;
    if (!theme) {
      const foundColor = colors?.find((_color) => _color.name === 'default');
      if (foundColor) {
        return foundColor?.default;
      }
      return;
    }
    const foundColor = colors?.find((_color) => _color.name === theme);
    if (!foundColor) {
      console.log(
        `The "${theme}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return;
    }

    return foundColor?.default;
  }, [theme, ctx.styles])

  const trueColor = useMemo(() => {
    const style = selectedStyle();

    return style?.trueStyle?.backgroundColor;
  }, [theme, ctx.styles]);

  const falseColor = useMemo(() => {
    const style = selectedStyle();

    return style?.falseStyle?.backgroundColor;
  }, [theme, ctx.styles]);

  const thumbColor = useMemo(() => {
    const style = selectedStyle();

    return value ? style?.trueStyle?.thumbColor : style?.falseStyle?.thumbColor;
  }, [theme, ctx.styles, value]);

  return (
    <Container style={style}>
      <Content style={contentContainerStyle}>
        <SwitchLine>
          {typeof label === 'string' ? <SwitchLabel>{label}</SwitchLabel> : label}
          <SwitchButton
            ref={switchRef}
            value={value}
            onValueChange={handleChange}
            trackColor={falseColor && trueColor ? { false: falseColor, true: trueColor } : null}
            thumbColor={thumbColor}
            ios_backgroundColor={falseColor}
            style={switchButtonStyle}
            {...rest}
          />
        </SwitchLine>
      </Content>
    </Container>
  );
};

export default memo(FormSwitch);
