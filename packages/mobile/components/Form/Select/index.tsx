import React, { useState, useEffect, useRef, FunctionComponent, Ref, useMemo } from 'react';

import { Container, IconContainer, ChevronDownIcon, ChevronUpIcon, Loading } from './styles';
import RNPickerSelect, { PickerSelectProps, PickerStyle } from 'react-native-picker-select';
import { StyleSheet, TextInput, ViewStyle, Platform, TextInputProps, TextInputComponent } from 'react-native';
import { useCombinedRefs } from '../../../../core/hooks';
import { useField } from '@unform/core';
import { FormFieldType } from '..';

export interface SelectItem {
  label: string;
  value: string | number | Object;
}

export interface SelectStyle extends PickerStyle {
  selectContainer: ViewStyle;
}

type FieldType = FormFieldType<TextInput>;

export type SelectProps = {
  outerRef?: Ref<FieldType>;
  name?: string;
  color?: 'primary' | 'secondary';
  placeholder?: string;
  items: SelectItem[];
  style?: SelectStyle;
  iconStyle?: any;
  hideIcon?: boolean;
  defaultValue?: any;
  value?: any;
  loading?: boolean;
  onChangeValidity?: (isValid: boolean) => void;
  onValueChange?: (value: string | number | Object) => void;
} & Omit<PickerSelectProps, 'onValueChange' | 'ref'>;

export type SelectComponent = FunctionComponent<SelectProps>;

const Component: SelectComponent = ({
  outerRef,
  name,
  color = 'primary',
  items,
  placeholder = 'select an item...',
  hideIcon,
  iconStyle,
  defaultValue,
  value: propValue,
  loading,
  onChangeValidity,
  onValueChange,
  disabled,
  ...rest
}: SelectProps) => {
  // States
  const [value, setValue] = useState<any>(defaultValue);
  const [opened, setOpened] = useState<boolean>(false);
  const [validityColor, setValidityColor] = useState<string>('#ffffff');
  const { fieldName, registerField, error, defaultValue: unformDefaultValue } = useField(name);

  // Refs
  const pickerRef = useRef<FieldType>(null);
  const combinedRef = useCombinedRefs<FieldType>(outerRef, pickerRef);
  const textInputProps = useRef<TextInputProps & { ref: Ref<FieldType> }>({
    ref: combinedRef,
  }).current;

  useEffect(() => {
    if (unformDefaultValue) {
      setValue(unformDefaultValue);
    }
  }, [unformDefaultValue]);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (propValue) {
      setValue(propValue);
    }
  }, [propValue]);

  const defaultPickerSelectStyles = StyleSheet.create({
    placeholder: {
      color: color === 'primary' ? '#bbc8cf' : '#fff',
    },
    inputIOS: {
      height: 55,
      paddingLeft: 20,
      paddingRight: 25 + 20, // IconContainer size + left space
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 50,
      borderWidth: 1,
      fontSize: 16,
      fontWeight: 'bold',
      backgroundColor: disabled ? '#f3f3f3' : '#fff',
      borderColor: color === 'primary' || disabled ? '#bbc8cf' : '#ffffff',
      color: color === 'primary' ? '#2d2d30' : '#fff',
      fontFamily: 'Gotham Rounded',
      opacity: loading ? 0.3 : 1,
    },
    inputAndroid: {
      height: 55,
      paddingLeft: 20,
      paddingRight: 25 + 20, // IconContainer size + left space
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 50,
      borderWidth: 1,
      fontSize: 16,
      fontWeight: 'bold',
      backgroundColor: disabled ? '#f3f3f3' : '#fff',
      borderColor: color === 'primary' || disabled ? '#bbc8cf' : '#ffffff',
      color: color === 'primary' ? '#2d2d30' : '#fff',
      fontFamily: 'Gotham Rounded',
      opacity: loading ? 0.3 : 1,
    },
    iconContainer: {
      position: 'absolute',
      top: 0,
      right: 20,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  useEffect(() => {
    registerField<any>({
      name: fieldName,
      ref: combinedRef.current,
      clearValue: () => {
        setValue(null);
      },
      setValue: (ref: TextInput, val: any) => {
        setValue(val);
      },
      getValue: () => {
        return value;
      },
    });
  }, [combinedRef, fieldName, registerField, value]);

  useEffect(() => {
    const hasValue = value !== undefined && value !== null;

    if (disabled) {
      setValidityColor('#bbc8cf');
    } else if (color === 'primary') {
      setValidityColor(hasValue ? '#3a9def' : '#bbc8cf');
    } else {
      setValidityColor(hasValue ? '#00f2d5' : '#ffffff');
    }
  }, [color, disabled, value]);

  const Icon = () => (
    <IconContainer>
      {/* Unfortunately, we can't get the onClose event on Android devices, so we made it static */}
      {Platform.OS === 'ios' ? (
        opened ? (
          <ChevronUpIcon defaultColor={color} style={iconStyle} />
        ) : (
          <ChevronDownIcon defaultColor={color} style={iconStyle} />
        )
      ) : (
        <ChevronDownIcon defaultColor={color} style={iconStyle} />
      )}
    </IconContainer>
  );

  const handleOpen = () => {
    setOpened(true);
    rest?.onOpen && rest?.onOpen();
  };

  const handleClose = () => {
    setOpened(false);
    rest?.onClose && rest?.onClose();
    combinedRef?.current?.validate && combinedRef.current.validate(value);
  };

  const styles: SelectStyle = useMemo(
    () => ({
      ...defaultPickerSelectStyles,
      inputIOS: { ...defaultPickerSelectStyles?.inputIOS, borderColor: validityColor },
      inputAndroid: { ...defaultPickerSelectStyles?.inputAndroid, borderColor: validityColor },
      selectContainer: { ...rest?.style?.selectContainer },
      ...rest?.style,
    }),
    [defaultPickerSelectStyles, rest.style, validityColor],
  );

  useEffect(() => {
    onChangeValidity && onChangeValidity(!error);
  }, [error, onChangeValidity]);

  const handleValueChange = (val) => {
    onValueChange && onValueChange(val);
    setValue(val);
  };

  return (
    <Container style={styles?.selectContainer}>
      <RNPickerSelect
        {...rest}
        textInputProps={textInputProps}
        style={styles}
        disabled={loading || disabled}
        useNativeAndroidPickerStyle={false}
        Icon={!hideIcon ? Icon : null}
        onValueChange={handleValueChange}
        value={value}
        placeholder={{ label: placeholder, value: undefined }}
        items={items}
        onOpen={handleOpen}
        onClose={handleClose}
      />
      {loading && <Loading />}
    </Container>
  );
};

const Select: SelectComponent = React.forwardRef((props: SelectProps, ref: Ref<FieldType>) => (
  <Component outerRef={ref} {...props } />
));

export default Select;
