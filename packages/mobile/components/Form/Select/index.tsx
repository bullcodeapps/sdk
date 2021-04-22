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

import { Container, IconContainer, ChevronDownIcon, Loading } from './styles';
import RNPickerSelect, { PickerSelectProps, PickerStyle } from 'react-native-picker-select';
import { StyleSheet, TextInput, ViewStyle, Platform, TextInputProps, Animated } from 'react-native';
import { useCombinedRefs } from '../../../../core/hooks';
import { useField } from '@unform/core';
import { FormFieldType } from '..';

import { SelectContextType, SelectContext, DefaultStyles } from './context';
import { SelectStyle, SelectStateStyles } from './types';
import { getStyleByValidity } from '../../../utils';

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
  theme?: string;
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
  theme = 'primary',
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
  const { fieldName, registerField, error } = useField(name);

  // Refs
  const pickerRef = useRef<FieldType>(null);
  const combinedRef = useCombinedRefs<FieldType>(outerRef, pickerRef);
  const textInputProps = useRef<TextInputProps & { ref: Ref<FieldType> }>({
    ref: combinedRef,
  }).current;
  const iconRotateAnimation = useRef(new Animated.Value(0)).current;

  const usingValidity = useMemo(() => ![undefined, null].includes(propValidity), [propValidity]);

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

  const selectedStyle: SelectStyle = useMemo(() => {
    const styles = ctx?.styles || DefaultStyles;
    const foundStyle = styles.find((_style) => _style.name === theme);
    if (!foundStyle) {
      console.log(
        `[Select] The "${theme}" theme does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultStyles[0];
    }
    return foundStyle;
  }, [theme, ctx?.styles]);

  const currentValidationStyles = useMemo((): SelectStateStyles => {
    if (usingValidity) {
      if (propValidity === 'keepDefault') {
        return selectedStyle?.default;
      }
      return StyleSheet.flatten([selectedStyle?.default, getStyleByValidity(propValidity, selectedStyle)]);
    }

    if (!isDirty) {
      return selectedStyle?.default;
    }

    return StyleSheet.flatten([selectedStyle?.default, getStyleByValidity(!error, selectedStyle)]);
  }, [usingValidity, isDirty, error, selectedStyle, propValidity]);

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
  } as NativeSelectStyle);

  useEffect(() => {
    combinedRef.current.markAsDirty = () => {
      if (isDirty) {
        return;
      }

      setIsDirty(true);
    };
  }, [combinedRef, isDirty]);

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
      color: currentValidationStyles?.dropdownIconColor || selectedStyle?.default?.dropdownIconColor,
    };
  }, [currentValidationStyles?.dropdownIconColor, iconStyle, selectedStyle?.default?.dropdownIconColor]);

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

  const styles: NativeSelectStyle = useMemo(() => {
    const { selectionColor, placeholder, dropdownIconColor, ...inputStyles } = currentValidationStyles;
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
        color: selectionColor,
        ...rest?.style?.selectContainer,
      },
      placeholder: {
        color: placeholder,
      },
      ...rest?.style,
    };
  }, [currentValidationStyles, defaultPickerSelectStyles, rest.style]);

  useEffect(() => {
    onChangeValidity && onChangeValidity(!error);
  }, [error, onChangeValidity]);

  const handleValueChange = useCallback(
    (val) => {
      setValue(val);
      combinedRef?.current?.validate && combinedRef.current.validate(val);
      onValueChange && onValueChange(val);

      if (!isDirty && Platform.OS === 'android' && val) {
        setIsDirty(true);
      }
    },
    [combinedRef, onValueChange],
  );

  const newItems = useMemo(() => {
    if (!Array.isArray(items)) {
      return items;
    }

    return items?.map((_item, _itemIndex) => {
      if (typeof _item?.value !== 'object' || _item?.value?.hasOwnProperty('key')) {
        return _item;
      }
      return {
        ..._item,
        value: {
          ..._item?.value,
          key: _item?.value?.hasOwnProperty('id') ? (_item?.value as any)?.id : _itemIndex,
        },
      };
    });
  }, [items]);

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
        placeholder={{ key: '@@placeholder', label: placeholder, value: undefined }}
        items={newItems}
        onOpen={handleOpen}
        onClose={handleClose}
        onDonePress={handleDone}
        itemKey={rest?.itemKey || typeof value === 'object' ? value?.id : null}
      />
      {loading && <Loading />}
    </Container>
  );
};

const Select: SelectComponent = React.forwardRef((props: SelectProps, ref: Ref<FieldType>) => (
  <Component outerRef={ref} {...props} />
));

export default Select;
