import React, {
  useState,
  useEffect,
  useRef,
  FunctionComponent,
  Ref,
  useMemo,
  useContext,
  useCallback,
} from 'react';

import {
  Container,
  IconContainer,
  ChevronDownIcon,
  ChevronUpIcon,
  Loading,
  SelectStyles,
  DefaultColors,
  SelectStyle,
} from './styles';
import RNPickerSelect, { PickerSelectProps, PickerStyle } from 'react-native-picker-select';
import { StyleSheet, TextInput, ViewStyle, Platform, TextInputProps, Animated } from 'react-native';
import { useCombinedRefs } from '../../../../core/hooks';
import { useField } from '@unform/core';
import { FormFieldType } from '..';

export type SelectContextType = { colors: SelectStyles };

export const SelectContext = React.createContext<SelectContextType>({ colors: null });

export const setSelectColors = (colors: SelectStyles) => {
  const ctx = useContext<SelectContextType>(SelectContext);
  ctx.colors = colors;
};

export interface SelectItem {
  label: string;
  value: string | number | Object;
}

export interface NativeSelectStyle extends PickerStyle {
  selectContainer: ViewStyle;
}

type FieldType = FormFieldType<TextInput>;

export type SelectProps = {
  outerRef?: Ref<FieldType>;
  name?: string;
  color?: string;
  placeholder?: string;
  items: SelectItem[];
  style?: NativeSelectStyle;
  iconStyle?: any;
  hideIcon?: boolean;
  defaultValue?: number | string | boolean | object;
  value?: number | string | boolean | object;
  loading?: boolean;
  validity?: boolean | 'keepDefault';
  onChangeValidity?: (isValid: boolean) => void;
  onValueChange?: (value: string | number | Object) => void;
} & Omit<PickerSelectProps, 'onValueChange' | 'ref' | 'items'>;

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
  loading,
  disabled,
  value: propValue,
  validity: propValidity,
  onChangeValidity,
  onValueChange,
  ...rest
}: SelectProps) => {
  const ctx = useContext<SelectContextType>(SelectContext);

  // States
  const [value, setValue] = useState<any>(null);
  const [opened, setOpened] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState(false);
  const { fieldName, registerField, error, defaultValue: unformDefaultValue } = useField(name);

  // Refs
  const pickerRef = useRef<FieldType>(null);
  const combinedRef = useCombinedRefs<FieldType>(outerRef, pickerRef);
  const textInputProps = useRef<TextInputProps & { ref: Ref<FieldType> }>({
    ref: combinedRef,
  }).current;
  const iconRotateAnimation = useRef(new Animated.Value(0)).current;

  const usingValidity = useMemo(() => ![undefined, null].includes(propValidity), [propValidity]);

  useEffect(() => {
    if (unformDefaultValue) {
      setValue(unformDefaultValue);
    }
  }, [unformDefaultValue]);

  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (propValue) {
      setValue(propValue);
    }
  }, [propValue]);

  const selectedColor: SelectStyle = useMemo(() => {
    const colors = ctx?.colors || DefaultColors;
    const foundColor = colors.find((_color) => _color.name === color);
    if (!foundColor) {
      console.log(
        `The "${color}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultColors[0];
    }
    return foundColor;
  }, [color, ctx?.colors]);

  const getColorTypeByValidity = useCallback(
    (validity?: boolean) => {
      if (validity) {
        return selectedColor?.valid || selectedColor?.default;
      }
      return selectedColor?.invalid || selectedColor?.default;
    },
    [selectedColor?.invalid, selectedColor?.valid, selectedColor?.default],
  );

  const currentValidationStyles = useMemo(() => {
    if (!isDirty) {
      return selectedColor?.default;
    }

    if (usingValidity) {
      if (propValidity === 'keepDefault') {
        return selectedColor?.default;
      }
      return getColorTypeByValidity(propValidity);
    }

    return getColorTypeByValidity(isDirty && !error);
  }, [error, getColorTypeByValidity, propValidity, selectedColor.default, usingValidity, value, isDirty]);

  const defaultPickerSelectStyles = StyleSheet.create({
    placeholder: {
      color: currentValidationStyles?.placeholder,
    },
    inputIOS: {
      height: 55,
      paddingLeft: 20,
      paddingRight: 25 + 20, // IconContainer size + left space
      paddingTop: 10,
      paddingBottom: 10,
      borderWidth: 1,
      fontSize: 16,
      fontWeight: 'bold',
      borderRadius: currentValidationStyles?.borderRadius,
      backgroundColor: currentValidationStyles?.backgroundColor,
      borderColor: currentValidationStyles?.borderColor,
      color: currentValidationStyles?.color,
      opacity: loading ? 0.3 : 1,
    },
    inputAndroid: {
      height: 55,
      paddingLeft: 20,
      paddingRight: 25 + 20, // IconContainer size + left space
      paddingTop: 10,
      paddingBottom: 10,
      borderWidth: 1,
      fontSize: 16,
      fontWeight: 'bold',
      borderRadius: currentValidationStyles?.borderRadius,
      backgroundColor: currentValidationStyles?.backgroundColor,
      borderColor: currentValidationStyles?.borderColor,
      color: currentValidationStyles?.color,
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
    combinedRef.current.markAsDirty = () => {
      if (isDirty) {
        return;
      }

      setIsDirty(true);
    };
  }, [isDirty]);

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

  const chevronIconsStyle = useMemo(() => {
    if (iconStyle) {
      return iconStyle;
    }
    return {
      color: currentValidationStyles?.dropdownIconColor || selectedColor?.default?.dropdownIconColor,
    };
  }, [currentValidationStyles?.dropdownIconColor, iconStyle, selectedColor?.default?.dropdownIconColor]);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }
    Animated.timing(iconRotateAnimation, {
      toValue: +opened,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [iconRotateAnimation, opened]);

  const Icon = useCallback(
    () => (
      <IconContainer
        style={
          Platform.OS === 'ios'
            ? {
                transform: [
                  {
                    rotateZ: iconRotateAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0rad', `${Math.PI}rad`],
                    }),
                  },
                ],
              }
            : null
        }>
        {/* Unfortunately, we can't get the onClose event on Android devices, so we made it static */}
        {Platform.OS === 'ios' ? (
          <ChevronDownIcon style={chevronIconsStyle} />
        ) : (
          <ChevronDownIcon style={chevronIconsStyle} />
        )}
      </IconContainer>
    ),
    [chevronIconsStyle, iconRotateAnimation],
  );

  const handleDone = useCallback(() => {
    setOpened(false);
    rest?.onDonePress && rest?.onDonePress();
  }, [rest]);

  const handleOpen = useCallback(() => {
    setOpened(true);
    if (!isDirty) {
      setIsDirty(true);
    }
    combinedRef?.current?.validate && combinedRef.current.validate(value);
    rest?.onOpen && rest?.onOpen();
  }, [combinedRef, isDirty, rest, value]);

  const handleClose = useCallback(() => {
    setOpened(false);
    combinedRef?.current?.validate && combinedRef.current.validate(value);
    rest?.onClose && rest?.onClose();
  }, [combinedRef, rest, value]);

  const inputStyles = useMemo(
    () => ({
      borderRadius: currentValidationStyles?.borderRadius || selectedColor?.default?.borderRadius,
      backgroundColor: currentValidationStyles?.backgroundColor || selectedColor?.default?.backgroundColor,
      borderColor: currentValidationStyles?.borderColor || selectedColor?.default?.borderColor,
      color: currentValidationStyles?.color || selectedColor?.default?.color,
    }),
    [
      currentValidationStyles?.backgroundColor,
      currentValidationStyles?.borderColor,
      currentValidationStyles?.borderRadius,
      currentValidationStyles?.color,
      selectedColor?.default?.backgroundColor,
      selectedColor?.default?.borderColor,
      selectedColor?.default?.borderRadius,
      selectedColor?.default?.color,
    ],
  );

  const styles: NativeSelectStyle = useMemo(() => {
    return {
      ...defaultPickerSelectStyles,
      inputIOS: {
        ...defaultPickerSelectStyles?.inputIOS,
        ...inputStyles,
      },
      inputAndroid: {
        ...defaultPickerSelectStyles?.inputAndroid,
        ...inputStyles,
      },
      selectContainer: {
        color: currentValidationStyles?.selectionColor || selectedColor?.default?.selectionColor,
        ...rest?.style?.selectContainer,
      },
      ...rest?.style,
    };
  }, [
    currentValidationStyles?.selectionColor,
    defaultPickerSelectStyles,
    inputStyles,
    rest?.style,
    selectedColor?.default?.selectionColor,
  ]);

  useEffect(() => {
    onChangeValidity && onChangeValidity(!error);
  }, [error, onChangeValidity]);

  const handleValueChange = useCallback(
    (val) => {
      setValue(val);
      if (!isDirty) {
        setIsDirty(true);
      }
      combinedRef?.current?.validate && combinedRef.current.validate(val);
      onValueChange && onValueChange(val);
    },
    [combinedRef, isDirty, onValueChange],
  );

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
        onDonePress={handleDone}
      />
      {loading && <Loading />}
    </Container>
  );
};

const Select: SelectComponent = React.forwardRef((props: SelectProps, ref: Ref<FieldType>) => (
  <Component outerRef={ref} {...props} />
));

export default Select;
