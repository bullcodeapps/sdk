import React, { useState, useRef, useEffect, useCallback, memo, useContext, useMemo } from 'react';

import { Container, SwitchLine, SwitchLabel, SwitchButton, SwitchColors, Content } from './styles';
import { Switch, SwitchProps, TextStyle, ViewStyle } from 'react-native';
import { useField } from '@unform/core';
import { FormFieldType } from '..';

export type SwitchContextType = { colors: SwitchColors };

export const SwitchContext = React.createContext<SwitchContextType>({ colors: null });

export const setSwitchColors = (colors: SwitchColors) => {
  const ctx = useContext<SwitchContextType>(SwitchContext);
  ctx.colors = colors;
};

type FormSwitchProps = {
  name?: string;
  color?: string;
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
  color,
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

  const trueColor = useMemo(() => {
    const colors = ctx?.colors;
    if (!color) {
      const foundColor = colors?.find((_color) => _color.name === 'default');
      if (foundColor) {
        return foundColor?.default?.trueStyle?.backgroundColor;
      }
      return;
    }
    const foundColor = colors?.find((_color) => _color.name === color);
    if (!foundColor) {
      console.log(
        `The "${color}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return;
    }

    return foundColor?.default?.trueStyle?.backgroundColor;
  }, [color, ctx.colors]);

  const falseColor = useMemo(() => {
    const colors = ctx?.colors;
    if (!color) {
      const foundColor = colors?.find((_color) => _color.name === 'default');
      if (foundColor) {
        return foundColor?.default?.falseStyle?.backgroundColor;
      }
      return;
    }
    const foundColor = colors?.find((_color) => _color.name === color);
    if (!foundColor) {
      console.log(
        `The "${color}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return;
    }

    return foundColor?.default?.falseStyle?.backgroundColor;
  }, [color, ctx.colors]);

  const thumbColor = useMemo(() => {
    const colors = ctx?.colors;
    if (!color) {
      const foundColor = colors?.find((_color) => _color.name === 'default');
      if (foundColor) {
        return value ? foundColor?.default?.trueStyle?.thumbColor : foundColor?.default?.falseStyle?.thumbColor;
      }
      return;
    }
    const foundColor = colors?.find((_color) => _color.name === color);
    if (!foundColor) {
      console.log(
        `The "${color}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return;
    }

    if (value) {
      return foundColor?.default?.trueStyle?.thumbColor;
    }
    return foundColor?.default?.falseStyle?.thumbColor;
  }, [color, ctx.colors, value]);

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
