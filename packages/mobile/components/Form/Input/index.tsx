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
  color?: string;
  isDirty?: boolean;
  onChangeValidity?: (isValid: boolean) => void;
  onMarkPress?: (event: GestureResponderEvent) => void;
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
  style,
  validity: propValidity,
  isDirty: propIsDirty = false,
  onChangeValidity,
  onMarkPress,
  onChangeText,
  ...rest
}) => {
  const ctx = useContext<InputContextType>(InputContext);

  // States
  const [value, setValue] = useState<string>('');
  const [isDirty, setIsDirty] = useState(propIsDirty);
  const { fieldName, registerField, error } = useField(name);

  // Refs
  const inputRef = useRef<InputFieldType>(null);
  const combinedRef = useCombinedRefs<InputFieldType>(outerRef, inputRef);

  const usingValidity = useMemo(() => ![undefined, null].includes(propValidity), [propValidity]);

  const handleOnChangeText = useCallback(
    (text: string) => {
      if (value === text) {
        return;
      }
      const newText = text || '';
      setValue(newText);
      !usingValidity && inputRef?.current?.validate && inputRef.current.validate(newText);
      onChangeText && onChangeText(newText);
    },
    [inputRef, onChangeText, usingValidity, value],
  );

  useEffect(() => {
    inputRef.current.markAsDirty = () => {
      if (isDirty) {
        return;
      }

      setIsDirty(true);
    };
  }, [fieldName, isDirty]);

  useEffect(() => {
    if (rest?.value !== undefined && !isDirty) {
      handleOnChangeText(rest?.value);
    }
  }, [handleOnChangeText, isDirty, rest.value]);

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputRef.current,
      clearValue: () => {
        handleOnChangeText('');
      },
      setValue: (ref: TextInput, val: string) => {
        // Avoid from form auto-fill and mark as dirty
        if (val !== undefined && !isDirty) {
          handleOnChangeText(val);
        }
      },
      getValue: () => {
        return value;
      },
    });
  }, [combinedRef, fieldName, handleOnChangeText, isDirty, registerField, value]);

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

    if (!isDirty) {
      return selectedColor?.default;
    }

    return getColorTypeByValidity(!error);
  }, [
    error,
    getColorTypeByValidity,
    propValidity,
    selectedColor?.default,
    selectedColor?.invalid,
    usingValidity,
    value,
    isDirty,
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

  const IconComponent = useMemo(() => iconComponent, [iconComponent]);

  const onFocus = useCallback(
    (e) => {
      if (!isDirty) {
        !usingValidity && combinedRef?.current?.validate && combinedRef.current.validate(value || '');
        setIsDirty(true);
      }

      rest?.onFocus && rest?.onFocus(e);
    },
    [combinedRef, isDirty, rest, usingValidity, value],
  );

  const canShowValidityMark = useMemo(() => {
    if (!useValidityMark) {
      return false;
    }
    if (usingValidity) {
      return propValidity !== 'keepDefault';
    }
    return isDirty;
  }, [isDirty, propValidity, useValidityMark, usingValidity]);

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
            paddingRight: canShowValidityMark ? 45 : rest?.multiline ? 20 : 0,
          },
          style,
        ]}
        onChangeText={handleOnChangeText}
        onFocus={onFocus}
      />
      <IconContainer
        isMultiline={rest.multiline}
        hasIconComponent={!!iconComponent}
        canShowValidityMark={canShowValidityMark}>
        {canShowValidityMark && (
          <ValidityMarkComponent
            isValid={isDirty && (usingValidity && propValidity !== 'keepDefault' ? propValidity : !error)}
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
