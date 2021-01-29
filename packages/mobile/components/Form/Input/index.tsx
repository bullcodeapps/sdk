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
} from './styles';
import { useField } from '@unform/core';
import { useCombinedRefs } from '../../../../core/hooks';
import ValidityMark from './ValidityMark';
import { FormFieldType } from '..';

import { InputContextType, InputContext, DefaultStyles } from './context';
import { InputStyle, ValidityMarkComponentType } from './types';
import { getStyleByValidity } from '@bullcode/mobile/utils';

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
  theme?: string;
  isDirty?: boolean;
  onChangeValidity?: (isValid: boolean) => void;
  onMarkPress?: (event: GestureResponderEvent) => void;
}

export type InputComponent<T = any> = FunctionComponent<InputProps<T>>;

const Component: InputComponent = ({
  theme = 'primary',
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
  onFocus: propOnFocus,
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
      setValue(text || '');
      !usingValidity && combinedRef?.current?.validate && combinedRef.current.validate(text || '');
      onChangeText && onChangeText(text || '');
    },
    [combinedRef, onChangeText, usingValidity, value],
  );

  useEffect(() => {
    inputRef.current.markAsDirty = () => {
      if (isDirty) {
        return;
      }

      setIsDirty(true);
    };
  }, [isDirty]);

  useEffect(() => {
    if (rest?.value !== undefined && !isDirty) {
      handleOnChangeText(rest?.value);
    }
  }, [handleOnChangeText, rest?.value]);

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: combinedRef.current,
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

  const selectedStyle: InputStyle = useMemo(() => {
    const styles = ctx?.styles || DefaultStyles;
    const foundStyle = styles.find((_style) => _style.name === theme);
    if (!foundStyle) {
      console.log(
        `The "${theme}" theme does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultStyles[0];
    }
    return foundStyle;
  }, [theme, ctx?.styles]);

  const currentValidationStyles = useMemo(() => {
    if (!isDirty && !value) {
      return selectedStyle?.default;
    }

    if (usingValidity) {
      if (propValidity === 'keepDefault') {
        return selectedStyle?.default;
      }
      return getStyleByValidity(propValidity, selectedStyle);
    }
    if (value?.length > 0) {
      return getStyleByValidity(!error, selectedStyle);
    }

    if (error) {
      return selectedStyle?.invalid || selectedStyle?.default;
    }

    return selectedStyle?.default;
  }, [
    error,
    getStyleByValidity,
    propValidity,
    selectedStyle?.default,
    selectedStyle?.invalid,
    usingValidity,
    value,
    isDirty,
  ]);

  useEffect(() => {
    onChangeValidity && onChangeValidity(!error);
  }, [error, onChangeValidity]);

  const ValidityMarkComponent: ValidityMarkComponentType = useMemo(() => {
    if (!selectedStyle?.validityMarkComponent) {
      return ValidityMark;
    }
    return selectedStyle?.validityMarkComponent;
  }, [selectedStyle.validityMarkComponent]);

  const IconComponent = useMemo(() => iconComponent, [iconComponent]);

  const onFocus = useCallback(
    (e) => {
      if (!isDirty) {
        !usingValidity && combinedRef?.current?.validate && combinedRef.current.validate(value || '');
        setIsDirty(true);
      }

      propOnFocus && propOnFocus(e);
    },
    [combinedRef, isDirty, propOnFocus, usingValidity, value],
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
            borderRadius: selectedStyle?.default?.borderRadius,
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
            colorName={selectedStyle.name}
            {...(selectedStyle?.validityMarkComponent ? {} : { colors: selectedStyle?.validityMark })}
            onPress={(e) => !!onMarkPress && onMarkPress(e)}
          />
        )}
        {!!iconComponent && (
          <IconComponent
            isValid={!error}
            colorName={selectedStyle.name}
            {...(selectedStyle?.validityMarkComponent ? {} : { colors: selectedStyle?.validityMark })}
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
