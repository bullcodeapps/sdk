import React, {
  ReactNode,
  Ref,
  FunctionComponent,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
  ComponentType,
} from 'react';

import {
  Text,
  TextInputProps,
  ViewProps,
  GestureResponderEvent,
  Animated,
  TextInput,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Platform,
  Constructor,
  TimerMixin,
  NativeMethods,
} from 'react-native';

import { Container, LabelBox, InputField, IconContainer, CounterBox, CounterText } from './styles';
import { useField } from '@unform/core';
import { useCombinedRefs } from '../../../../core/hooks';
import ValidityMark from './ValidityMark';
import { FormFieldType } from '..';

export type InputRef<T = any> = T & (Animated.AnimatedComponent<ComponentType<TextInput>> | TextInput);
export type InputFieldType<T = any> = FormFieldType<InputRef<T>>;

export interface InputProps<T = any> extends Omit<TextInputProps, 'ref'>, Readonly<{ children?: ReactNode }>, Partial<NativeMethods>, Partial<TimerMixin> {
  ref?: Ref<InputRef<T>>;
  outerRef?: Ref<InputRef<T>>;
  name?: any;
  iconComponent?: any;
  containerStyle?: any;
  label?: string;
  containerProps?: ViewProps;
  useValidityMark?: boolean;
  validity?: boolean;
  onChangeValidity?: (isValid: boolean) => void;
  onMarkPress?: (event: GestureResponderEvent) => void;
  onChangeText?: (text: string) => void;
  color?: 'primary' | 'secondary' | 'group';
}

export type InputComponent<T = any> = FunctionComponent<InputProps<T>>;

const Component: InputComponent = ({
  color = 'primary',
  name,
  iconComponent,
  outerRef,
  label,
  containerStyle,
  containerProps,
  useValidityMark = false,
  validity: propValidity,
  onChangeValidity,
  onMarkPress,
  onChangeText,
  ...rest
}) => {
  // States
  const [value, setValue] = useState<string>('');
  const { fieldName, registerField, error } = useField(name);
  const [isFocused, setIsFocused] = useState<boolean>();
  const [selection, setSelection] = useState<any>();

  // Refs
  const inputRef = useRef<InputFieldType>(null);
  const combinedRef = useCombinedRefs<InputFieldType>(outerRef, inputRef);

  const handleOnChangeText = useCallback(
    (text: string) => {
      setValue(text || '');
      onChangeText && onChangeText(text || '');
      combinedRef?.current?.validate && combinedRef.current.validate(text || '');
    },
    [combinedRef, onChangeText],
  );

  useEffect(() => {
    handleOnChangeText(rest?.value);
  }, [handleOnChangeText, rest?.value]);

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: combinedRef.current,
      clearValue: () => {
        handleOnChangeText('');
      },
      setValue: (ref: TextInput, val: string) => {
        handleOnChangeText(val);
      },
      getValue: () => {
        return value;
      },
    });
  }, [combinedRef, fieldName, handleOnChangeText, registerField, value]);

  const usingValidity = useMemo(() => ![undefined, null].includes(propValidity), [propValidity]);

  const getColorByValidity = useCallback(
    (validity?: boolean) => {
      if (validity) {
        return color === 'primary' ? '#3a9def' : color === 'group' ? '#144DDE' : '#00f2d5';
      }
      return '#ffc962';
    },
    [color],
  );

  const formattedColor = useMemo(() => {
    if (usingValidity) {
      return getColorByValidity(propValidity);
    }
    if (value?.length > 0) {
      return getColorByValidity(!error);
    }

    if (!!error && !!value) {
      return '#ffc962';
    }

    return color === 'primary' || color === 'group' ? '#bbc8cf' : '#ffffff';
  }, [color, error, getColorByValidity, propValidity, usingValidity, value]);

  useEffect(() => {
    onChangeValidity && onChangeValidity(!error);
  }, [error, onChangeValidity]);

  const handleInputFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      rest?.onFocus && rest.onFocus(e);
      setIsFocused(true);
    },
    [rest],
  );

  const handleInputBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      rest?.onBlur && rest.onBlur(e);
      setIsFocused(false);
    },
    [rest],
  );

  /*
   * ensures that fields, on Android, with many characters show the beginning of the content
   * and not the end, expected behavior for UX already used on iOS!
   */
  useEffect(() => {
    if (Platform.OS === 'ios') {
      return;
    }
    const length = !isNaN(value?.length) ? value?.length : 0;
    setSelection(isFocused ? { start: length, end: length } : { start: 0, end: 0 });
    const timeout = setTimeout(() => setSelection(null), 0);
    return () => {
      clearTimeout(timeout);
    };
  }, [isFocused]); // eslint-disable-line

  return (
    <Container style={containerStyle} {...containerProps}>
      {label && (
        <LabelBox>
          <Text>{label}</Text>
        </LabelBox>
      )}
      <InputField
        ref={combinedRef}
        selection={selection}
        onChangeText={handleOnChangeText}
        useValidityMark={useValidityMark}
        borderColor={formattedColor}
        color={color}
        value={value}
        textAlignVertical={rest.multiline ? 'top' : 'center'}
        {...rest}
        name={undefined}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        hasIcon={!!iconComponent}
      />
      <IconContainer
        isMultiline={rest.multiline}
        usingValidityMark={iconComponent && useValidityMark && value?.length > 0}>
        {!iconComponent && useValidityMark && value?.length > 0 && !error && (
          <ValidityMark isValid={!error} color={formattedColor} onPress={(e) => !!onMarkPress && onMarkPress(e)} />
        )}
        {!iconComponent && !!error && !!value && (
          <ValidityMark isValid={!error} color={formattedColor} onPress={(e) => !!onMarkPress && onMarkPress(e)} />
        )}
        {iconComponent}
      </IconContainer>
      {rest?.multiline && (
        <CounterBox>
          <CounterText maxLength={rest?.maxLength} length={value?.length}>
            {`${value ? value?.length : 0}/${rest?.maxLength}`}
          </CounterText>
        </CounterBox>
      )}
    </Container>
  );
};

const Input: InputComponent = React.forwardRef(
  (props: InputProps, ref: Ref<InputRef>) => (
    <Component outerRef={ref} {...props} />
  ),
);

export default memo(Input);
