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
  useContext,
} from 'react';

import {
  Text,
  TextInputProps,
  ViewProps,
  GestureResponderEvent,
  Animated,
  TextInput,
  TimerMixin,
  NativeMethods,
} from 'react-native';

import {
  Container,
  LabelBox,
  InputField,
  IconContainer,
  CounterBox,
  CounterText,
  DefaultColors,
  InputStyles,
  InputStyle,
  ValidityMarkComponentType,
} from './styles';
import { useField } from '@unform/core';
import { useCombinedRefs } from '../../../../core/hooks';
import ValidityMark from './ValidityMark';
import { FormFieldType } from '..';

export type InputContextType = { colors: InputStyles };

export const InputContext = React.createContext<InputContextType>({ colors: null });

export const setInputColors = (colors: InputStyles) => {
  const ctx = useContext<InputContextType>(InputContext);
  ctx.colors = colors;
};

export type InputRef<T = any> = T & (Animated.AnimatedComponent<ComponentType<TextInput>> | TextInput);
export type InputFieldType<T = any> = FormFieldType<InputRef<T>>;

export interface InputProps<T = any>
  extends Omit<TextInputProps, 'ref'>,
    Readonly<{ children?: ReactNode }>,
    Partial<NativeMethods>,
    Partial<TimerMixin> {
  ref?: Ref<InputRef<T>>;
  outerRef?: Ref<InputRef<T>>;
  name?: any;
  iconComponent?: ValidityMarkComponentType;
  containerStyle?: any;
  label?: string;
  containerProps?: ViewProps;
  useValidityMark?: boolean;
  validity?: boolean | 'keepDefault';
  onChangeValidity?: (isValid: boolean) => void;
  onMarkPress?: (event: GestureResponderEvent) => void;
  color?: string;
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
  style,
  ...rest
}) => {
  const ctx = useContext<InputContextType>(InputContext);

  // States
  const [value, setValue] = useState<string>('');
  const { fieldName, registerField, error } = useField(name);

  // Refs
  const inputRef = useRef<InputFieldType>(null);
  const combinedRef = useCombinedRefs<InputFieldType>(outerRef, inputRef);

  const usingValidity = useMemo(() => ![undefined, null].includes(propValidity), [propValidity]);

  const handleOnChangeText = useCallback(
    (text: string) => {
      setValue(text || '');
      !usingValidity && combinedRef?.current?.validate && combinedRef.current.validate(text || '');
      onChangeText && onChangeText(text || '');
    },
    [combinedRef, onChangeText, usingValidity],
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

  const selectedColor: InputStyle = useMemo(() => {
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
    if (usingValidity) {
      if (propValidity === 'keepDefault') {
        return selectedColor?.default;
      }
      return getColorTypeByValidity(propValidity);
    }
    if (value?.length > 0) {
      return getColorTypeByValidity(!error);
    }

    if (!!error && !!value) {
      return selectedColor?.invalid || selectedColor?.default;
    }

    return selectedColor?.default;
  }, [
    error,
    getColorTypeByValidity,
    propValidity,
    selectedColor?.default,
    selectedColor?.invalid,
    usingValidity,
    value,
  ]);

  useEffect(() => {
    onChangeValidity && onChangeValidity(!error);
  }, [error, onChangeValidity]);

  const ValidityMarkComponent: ValidityMarkComponentType = useMemo(() => {
    if (!selectedColor?.validityMarkComponent) {
      return ValidityMark;
    }
    return selectedColor?.validityMarkComponent;
  }, [selectedColor.validityMarkComponent]);

  const IconComponent = iconComponent;

  return (
    <Container style={containerStyle} {...containerProps}>
      {label && (
        <LabelBox>
          <Text>{label}</Text>
        </LabelBox>
      )}
      <InputField
        ref={combinedRef}
        value={value}
        textAlignVertical={rest.multiline ? 'top' : 'center'}
        selectionColor={currentValidationStyles?.selectionColor}
        placeholderTextColor={currentValidationStyles?.placeholder}
        {...rest}
        style={[
          {
            backgroundColor: currentValidationStyles?.backgroundColor || 'transparent',
            borderColor: currentValidationStyles?.borderColor,
            color: currentValidationStyles?.color,
            borderRadius: selectedColor?.default?.borderRadius,
            paddingRight: iconComponent ? 45 : 0,
          },
          style,
        ]}
        onChangeText={handleOnChangeText}
      />
      <IconContainer
        isMultiline={rest.multiline}
        usingValidityMark={
          iconComponent &&
          useValidityMark &&
          (usingValidity ? propValidity !== 'keepDefault' && propValidity : value?.length > 0)
        }>
        {!iconComponent &&
          useValidityMark &&
          (usingValidity ? propValidity !== 'keepDefault' && propValidity : value?.length > 0) && (
            <ValidityMarkComponent
              isValid={!error}
              colorName={selectedColor.name}
              {...(selectedColor?.validityMarkComponent ? {} : { colors: selectedColor?.validityMark })}
              onPress={(e) => !!onMarkPress && onMarkPress(e)}
            />
          )}
        {!!iconComponent && (
          <IconComponent
            isValid={!error}
            colorName={selectedColor.name}
            {...(selectedColor?.validityMarkComponent ? {} : { colors: selectedColor?.validityMark })}
            onPress={(e) => !!onMarkPress && onMarkPress(e)}
          />
        )}
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

const Input: InputComponent = React.forwardRef((props: InputProps, ref: Ref<InputRef>) => (
  <Component outerRef={ref} {...props} />
));

export default memo(Input);
