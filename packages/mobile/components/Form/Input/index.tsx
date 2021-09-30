import { getStyleByValidity } from '@bullcode/mobile/utils';
import { useField } from '@unform/core';
import React, {
  ComponentType,
  FunctionComponent,
  ReactNode,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  GestureResponderEvent,
  LayoutChangeEvent,
  LayoutRectangle,
  NativeMethods,
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TimerMixin,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { useCombinedRefs } from '../../../../core/hooks';
import { FormFieldType } from '..';
import { DefaultStyles, InputContext, InputContextType } from './context';
import {
  Container,
  Content,
  COUNTER_BOX_BOTTOM,
  CounterBox,
  CounterText,
  IconContainer,
  InputField,
  LabelBox,
  StartAdornmentContainer,
  LabelText,
} from './styles';
import { InputStyle, AdornmentComponentType, CustomAdornmentComponentType } from './types';
import ValidityMark from './ValidityMark';

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
  startAdornment?: AdornmentComponentType;
  endAdornment?: AdornmentComponentType;
  validValidityMarkIcon?: AdornmentComponentType;
  invalidValidityMarkIcon?: AdornmentComponentType;
  label?: string;
  containerProps?: ViewProps;
  useValidityMark?: boolean;
  floatingLabel?: boolean;
  validity?: boolean | 'keepDefault';
  theme?: string;
  isDirty?: boolean;
  onChangeValidity?: (isValid: boolean) => void;
  onMarkPress?: (event: GestureResponderEvent) => void;
  contentContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  startAdornmentContainerStyle?: ViewStyle;
  endAdornmentContainerStyle?: ViewStyle;
}

export type InputComponent<T = any> = FunctionComponent<InputProps<T>>;

const Component: InputComponent = ({
  theme = 'primary',
  name,
  startAdornment,
  endAdornment,
  validValidityMarkIcon,
  invalidValidityMarkIcon,
  outerRef,
  label,
  containerProps,
  useValidityMark = false,
  validity: propValidity,
  isDirty: propIsDirty = false,
  floatingLabel = false,
  onChangeValidity,
  onMarkPress,
  onChangeText,
  style,
  contentContainerStyle,
  inputStyle,
  startAdornmentContainerStyle,
  endAdornmentContainerStyle,
  ...rest
}) => {
  const ctx = useContext<InputContextType>(InputContext);

  // States
  const [value, setValue] = useState<string>('');
  const [isDirty, setIsDirty] = useState(propIsDirty);
  const { fieldName, registerField, error } = useField(name);
  const [counterBoxLayout, setCounterBoxLayout] = useState<LayoutRectangle>();

  // Refs
  const inputRef = useRef<InputFieldType>(null);
  const combinedRef = useCombinedRefs<InputFieldType>(outerRef, inputRef);
  const EndAdornmentComponent = useMemo(() => endAdornment, [endAdornment]);
  const StartAdornmentComponent = useMemo(() => startAdornment, [startAdornment]);

  const usingValidity = useMemo(() => ![undefined, null].includes(propValidity), [propValidity]);
  const shouldShowLabel = useMemo(() => !!((label && !floatingLabel || (label && floatingLabel && value?.length > 0))), [label, value, floatingLabel]);
  const shouldShowStartAdornment = useMemo(() => ![null, undefined].includes(startAdornment) && !rest.multiline ,[startAdornment, rest])
  const shouldShowEndAdornment = useMemo(() => useValidityMark || ![null, undefined].includes(endAdornment) ,[endAdornment, useValidityMark])
  const defaultPaddingLeft = useMemo(() => shouldShowStartAdornment ? 55 : 20, [shouldShowStartAdornment]);


  const handleOnChangeText = useCallback(
    (text: string, ignoreDebounce: boolean = true) => {
      if (value === text) {
        return;
      }
      const newText = text || '';
      setValue(newText);
      if (!isDirty) {
        setIsDirty(true);
        !usingValidity && combinedRef?.current?.validate && combinedRef.current.validate(newText || '', ignoreDebounce);
      }
      combinedRef?.current?.validate && combinedRef.current.validate(newText || '', ignoreDebounce);
      // !usingValidity && inputRef?.current?.validate && inputRef.current.validate(newText, ignoreDebounce);
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
    combinedRef?.current?.validate && combinedRef.current.validate(value || '', true);
  }, [value]);

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
          setValue(val);
          // handleOnChangeText(val || '', false);
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
        `[Input] The "${theme}" theme does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultStyles[0];
    }
    return foundStyle;
  }, [theme, ctx?.styles]);

  const currentValidationStyles = useMemo(() => {
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
  }, [usingValidity, isDirty, error, selectedStyle, propValidity, value]);

  useEffect(() => {
    onChangeValidity && onChangeValidity(!error);
  }, [error, onChangeValidity]);

  const ValidityMarkComponent: CustomAdornmentComponentType = useMemo(() => {
    if (!selectedStyle?.validityMarkComponent) {
      return ValidityMark;
    }
    return selectedStyle?.validityMarkComponent;
  }, [selectedStyle.validityMarkComponent, value]);

  const onFocus = useCallback(
    (e) => {
      if (!isDirty) {
        setIsDirty(true);
        !usingValidity && combinedRef?.current?.validate && combinedRef.current.validate(value || '', true);
      }

      rest?.onFocus && rest?.onFocus(e);
      combinedRef?.current?.validate && combinedRef.current.validate(value || '', true);
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

  const handleOnLayoutCounterBox = (e: LayoutChangeEvent) => {
    setCounterBoxLayout(e?.nativeEvent?.layout);
  };

  return (
    <Container style={style} {...containerProps}>
      {shouldShowLabel && (
        <LabelBox floating={floatingLabel} paddingLeft={defaultPaddingLeft}>
          <LabelText>{label}</LabelText>
        </LabelBox>
      )}
      <Content style={contentContainerStyle}>
        {shouldShowStartAdornment && (
          <StartAdornmentContainer style={startAdornmentContainerStyle}>
            <StartAdornmentComponent isValid={!error}
              colorName={selectedStyle.name}
              {...(selectedStyle?.validityMarkComponent ? {} : { colors: selectedStyle?.validityMark })}
            />
          </StartAdornmentContainer>
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
              flexGrow: 1,
              backgroundColor: currentValidationStyles?.backgroundColor || 'transparent',
              borderColor: currentValidationStyles?.borderColor,
              color: currentValidationStyles?.color,
              borderRadius: selectedStyle?.default?.borderRadius,
              paddingRight: canShowValidityMark ? 45 : rest?.multiline ? 20 : 0,
              paddingTop: (floatingLabel && value?.length > 0) ? 20 : 10,
              paddingLeft: shouldShowStartAdornment ? 55 : 20,
              paddingBottom: Platform.OS === 'ios' ? (counterBoxLayout?.height || 0) + COUNTER_BOX_BOTTOM : 'auto',
            },
            inputStyle,
          ]}
          onChangeText={handleOnChangeText}
          onFocus={onFocus}
        />
        {shouldShowEndAdornment && (
          <IconContainer
            isMultiline={rest.multiline}
            usingIconComponent={![null, undefined].includes(endAdornment)}
            usingValidityMark={canShowValidityMark}
            style={endAdornmentContainerStyle}>
            {canShowValidityMark && <ValidityMarkComponent
              invalidValidityMarkIcon={invalidValidityMarkIcon}
              validValidityMarkIcon={validValidityMarkIcon}
              isValid={isDirty && (usingValidity && propValidity !== 'keepDefault' ? propValidity : !error)}
              colorName={selectedStyle.name}
              {...(selectedStyle?.validityMarkComponent ? {} : { colors: selectedStyle?.validityMark })}
              onPress={(e) => !!onMarkPress && onMarkPress(e)}
            />}

            {![null, undefined].includes(endAdornment) && !useValidityMark && <EndAdornmentComponent
              isValid={!error}
              colorName={selectedStyle.name}
              {...(selectedStyle?.validityMarkComponent ? {} : { colors: selectedStyle?.validityMark })}
              onPress={(e) => !!onMarkPress && onMarkPress(e)}
            />}
          </IconContainer>
        )}
        {rest?.multiline && (
          <CounterBox onLayout={handleOnLayoutCounterBox}>
            <CounterText maxLength={rest?.maxLength} length={value?.length}>
              {`${value ? value?.length : 0}/${rest?.maxLength}`}
            </CounterText>
          </CounterBox>
        )}
      </Content>
    </Container>
  );
};

const Input: InputComponent = React.forwardRef((props: InputProps, ref: Ref<InputRef>) => (
  <Component outerRef={ref} {...props} />
));

export default Input;
