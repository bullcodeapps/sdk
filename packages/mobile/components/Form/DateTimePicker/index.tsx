import React, { useState, useEffect, useCallback, useRef, useMemo, useContext, Ref } from 'react';

import {
  FieldType,
  ViewContainer,
  Input,
  ModalViewTop,
  ModalViewMiddle,
  ActionText,
  ModalViewBottom,
  ClockIcon,
  CalendarIcon,
} from './styles';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Platform, View, TouchableOpacity, Modal, ViewStyle } from 'react-native';
import { format, isAfter, isBefore, isEqual, isValid, isWithinInterval } from 'date-fns';
import { useField } from '@unform/core';
import { SvgProps } from 'react-native-svg';
import { useCombinedRefs } from '@bullcode/core/hooks';
import { InputProps, InputRef } from '../Input';
import { InputStyle } from '../Input/types';
import { DefaultStyles, InputContextType, InputContext } from '../Input/context';
import { getStyleByValidity } from '@bullcode/mobile/utils';

export type DateTimePickerProps = {
  ref?: Ref<InputRef>;
  outerRef?: Ref<InputRef>;
  name?: string;
  mode?: 'date' | 'time';
  theme?: string;
  placeholder?: string;
  displayFormat?: string;
  value?: Date;
  doneText?: string;
  clearText?: string;
  maxDate?: Date;
  minDate?: Date;
  minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;
  language?: string;
  inputProps?: InputProps;
  icon?: any;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  pickerStyle?: any;
  isDirty?: boolean;
  iconStart?: boolean;
  onFocus?: () => void;
  onChange?: (value: Date) => void;
};

export type DateTimePickerComponent = React.FC<DateTimePickerProps>;

const Component: DateTimePickerComponent = ({
  outerRef,
  name,
  mode = 'date',
  theme,
  placeholder = 'date',
  value,
  doneText = 'Done',
  clearText = 'Clear',
  displayFormat,
  inputProps,
  maxDate,
  minDate,
  language = 'pt-BR',
  style,
  contentContainerStyle,
  pickerStyle,
  icon: Icon,
  isDirty: propIsDirty,
  iconStart,
  onFocus,
  onChange,
  ...rest
}) => {
  const ctx = useContext<InputContextType>(InputContext);

  const animationType = 'slide';

  // States
  const [date, setDate] = useState<Date | null>(null);
  const [show, setShow] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const { fieldName, registerField, error } = useField(name);
  const [initialDate, setInitialDate] = useState(new Date());

  // Refs
  const inputRef = useRef<FieldType>(null);
  const combinedRef = useCombinedRefs<FieldType>(outerRef, inputRef);

  // Simple memo's
  const modeFormat = useMemo(() => (mode === 'time' ? 'HH:mm' : 'dd/MM/yyyy'), [mode]);
  const choosenFormat = useMemo(() => displayFormat || modeFormat, [displayFormat, modeFormat]);
  const usingValidity = useMemo(() => ![undefined, null].includes(inputProps?.validity), [inputProps?.validity]);

  const DefaultIcon = useCallback(
    (props: SvgProps) => {
      return mode === 'time' ? <ClockIcon {...props} /> : <CalendarIcon {...props} />;
    },
    [mode],
  );

  const parseStrToDate = useCallback((_date: string | Date): Date => {
    if (typeof _date === 'string') {
      return new Date(_date);
    }
    return _date;
  }, []);

  const pickerValue = useMemo(
    () => ([undefined, null].includes(parseStrToDate(date)) ? initialDate : parseStrToDate(date)),
    [date, initialDate, parseStrToDate],
  );

  useEffect(() => {
    if (![null, undefined].includes(propIsDirty)) {
      setIsDirty(propIsDirty);
    }
  }, [propIsDirty]);

  /*
   * Will always bring the formatted date
   */
  const dateFormatted = useMemo(() => {
    const newDate = parseStrToDate(date);
    if (!newDate || typeof newDate === 'string' || !isValid(newDate) || !choosenFormat) {
      return null;
    }
    return format(newDate, choosenFormat, {
      locale: (window as any).__dateLocale__,
    });
  }, [choosenFormat, date, parseStrToDate]);

  const doValueChange = useCallback(
    (_date: Date, _validate?: boolean) => {
      let newDate = parseStrToDate(_date);

      setDate((_oldDate) => {
        if (
          _oldDate &&
          newDate &&
          typeof _oldDate !== 'string' &&
          typeof newDate !== 'string' &&
          isValid(_oldDate) &&
          isValid(newDate)
        ) {
          // Keep the old values from the opposite mode
          if (mode === 'time') {
            newDate?.setFullYear(_oldDate?.getFullYear());
            newDate?.setMonth(_oldDate?.getMonth());
            newDate?.setDate(_oldDate?.getDate());
          } else {
            newDate?.setHours(_oldDate?.getHours());
            newDate?.setMinutes(_oldDate?.getMinutes());
            newDate?.setSeconds(_oldDate?.getSeconds());
            newDate?.setMilliseconds(_oldDate?.getMilliseconds());
          }
        }
        onChange && onChange(newDate);
        if (_validate) {
          combinedRef?.current?.validate && combinedRef.current.validate(newDate);
        }
        return newDate;
      });
      return newDate;
    },
    [combinedRef, mode, onChange, parseStrToDate],
  );

  /*
   * Whenever there are changes in the value, a treatment of that value must be made
   */
  const onChangeValue = useCallback(
    ({ currentDate, validate = true }: { currentDate: any; validate?: boolean }) => {
      const parsedMinDate = parseStrToDate(minDate);
      const parsedMaxDate = parseStrToDate(maxDate);
      const parsedDate = parseStrToDate(currentDate);

      let newDate: Date = parsedDate;

      if (
        parsedMinDate &&
        parsedMaxDate &&
        isWithinInterval(newDate, { start: parsedMinDate, end: parsedMaxDate })
      ) {
        return doValueChange(newDate, validate);
      }

      if (parsedMinDate && isBefore(parsedDate, parsedMinDate)) {
        return doValueChange(parsedMinDate, validate);
      }

      if (parsedMaxDate && isAfter(parsedDate, parsedMaxDate)) {
        return doValueChange(parsedMaxDate, validate);
      }

      return doValueChange(parsedDate, validate);
    },
    [doValueChange, maxDate, minDate, parseStrToDate],
  );

  /*
   * When the values are changed via prop we must do some things
   */
  useEffect(() => {
    const newDate = parseStrToDate(value);
    setDate(newDate);
    combinedRef?.current?.validate && combinedRef.current.validate(newDate);
    onChange && onChange(newDate);
  }, [combinedRef, isDirty, onChange, parseStrToDate, value]);

  /*
   * Rounds time to the suggested interval
   */
  const roundTime = (date: Date, minutesToRound: number) => {
    // Convert hours and minutes to minutes
    const time = date?.getHours() * 60 + date?.getMinutes();
    const rounded = Math.ceil(time / minutesToRound) * minutesToRound;

    const roundedHours = Math.floor(rounded / 60);
    const roundedMinutes = rounded % 60;

    const newDate = date;
    newDate?.setHours(roundedHours);
    newDate?.setMinutes(roundedMinutes);

    return newDate;
  };

  /*
   * If using a minute interval then round the time to the suggested interval
   */
  useEffect(() => {
    if (mode === 'time') {
      if (rest?.minuteInterval && typeof value === 'object') {
        setDate(roundTime(value, rest?.minuteInterval));
        return;
      }
      setDate(value);
    }
  }, [mode, rest?.minuteInterval, value]);

  const clear = useCallback(() => {
    setShow(false);
    setInitialDate(new Date());
    onChangeValue({ currentDate: null, validate: true });
  }, [onChangeValue]);

  useEffect(() => {
    registerField<Date>({
      name: fieldName,
      ref: combinedRef?.current,
      clearValue: clear,
      setValue: (ref: any, val: Date) => {
        // Transforms dates from the form as a string to the data object automatically
        const newDate = parseStrToDate(val);
        // if even after being converted into a date it is still not a valid date,
        // then we will ignore the change of state
        if ([null, undefined].includes(newDate) || typeof newDate === 'string' || !isValid(newDate)) {
          clear();
          return;
        }
        setDate(newDate);
        setInitialDate(newDate);
        combinedRef?.current?.validate && combinedRef.current.validate(newDate);
        onChange && onChange(newDate);
      },
      getValue: () => date,
    });
  }, [fieldName, registerField, date, clear, parseStrToDate, onChange, combinedRef]);

  useEffect(() => {
    if (!combinedRef?.current) {
      return;
    }
    combinedRef.current.markAsDirty = () => {
      if (isDirty) {
        return;
      }

      setIsDirty(true);
      onFocus && onFocus();
    };
  }, [combinedRef, fieldName, isDirty, onFocus]);

  const selectDate = useCallback(
    (event, newDate: Date) => {
      if (newDate === pickerValue || isEqual(pickerValue, newDate)) {
        return;
      }
      setShow(Platform.OS === 'ios');
      onChangeValue({ currentDate: newDate, validate: true });
    },
    [onChangeValue, pickerValue],
  );

  const togglePicker = useCallback(() => {
    setShow(!show);
    if (show) {
      onChangeValue({ currentDate: date, validate: true });
    }
  }, [date, onChangeValue, show]);

  useEffect(() => {
    // is first opening, then
    if (show && [null, undefined].includes(date)) {
      onChangeValue({ currentDate: initialDate, validate: true });
      onFocus && onFocus();
    }
  }, [date, initialDate, onChangeValue, onFocus, show]);

  const done = useCallback(() => {
    setShow(false);
    onChangeValue({ currentDate: date, validate: true });
  }, [date, onChangeValue]);

  const close = useCallback(() => {
    setShow(false);
    onChangeValue({ currentDate: date, validate: true });
  }, [date, onChangeValue]);

  const handleInputPress = useCallback(() => {
    togglePicker();

    if (!isDirty) {
      setIsDirty(true);
    }
  }, [isDirty, togglePicker]);

  const selectedStyle: InputStyle = useMemo(() => {
    const styles = ctx?.styles || DefaultStyles;
    const foundStyle = styles.find((_color) => _color.name === theme);
    if (!foundStyle) {
      console.log(
        `[DateTimePicker] The "${theme}" theme does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultStyles[0];
    }
    return foundStyle;
  }, [theme, ctx?.styles]);

  const currentValidationStyles = useMemo(() => {
    if (!isDirty) {
      return selectedStyle?.default;
    }

    const newDate = parseStrToDate(date);
    if (!newDate || typeof newDate === 'string' || !isValid(newDate) || !choosenFormat) {
      return getStyleByValidity(false, selectedStyle);
    }

    return getStyleByValidity(true, selectedStyle);

  }, [usingValidity, isDirty, error, selectedStyle, inputProps?.validity, date]);

  const isValidField = useMemo(() => {
    if (!isDirty) {
      return 'keepDefault';
    }

    const newDate = parseStrToDate(date);
    if (!newDate || typeof newDate === 'string' || !isValid(newDate) || !choosenFormat) {
      return false;
    }

    return true;
  }, [error, inputProps?.validity, isDirty, usingValidity, date]);

  const handleOnFocusInput = useCallback(() => {
    if (!isDirty) {
      setIsDirty(true);
    }
    onFocus && onFocus();
  }, [isDirty, onFocus]);

  type MaxAndMinDateProps = {
    maximumDate?: Date;
    minimumDate?: Date;
  };

  // Prevents undeclared values from causing the app to break.
  const maxAndMinDateProps = useMemo(() => {
    let response: MaxAndMinDateProps = {};

    if (![null, undefined].includes(maxDate) && typeof maxDate !== 'string' && isValid(maxDate)) {
      response.maximumDate = maxDate;
    }

    if (![null, undefined].includes(minDate) && typeof minDate !== 'string' && isValid(minDate)) {
      response.minimumDate = minDate;
    }

    return response;
  }, [maxDate, minDate]);

  return (
    <ViewContainer style={style}>
      <TouchableOpacity onPress={handleInputPress} activeOpacity={1}>
        <View pointerEvents="none">
          {!iconStart && <Input
            ref={inputRef}
            name={`textDateTimePicker-${mode}${name ? `-${name}` : ''}`}
            editable={false}
            validity={isValidField}
            placeholder={placeholder}
            value={dateFormatted}
            endAdornment={() => {
                if (Icon) {
                  return <Icon color={currentValidationStyles?.borderColor} />;
                }
                return <DefaultIcon color={currentValidationStyles?.borderColor} />;
            }}
            theme={theme}
            isDirty={isDirty}
            onFocus={handleOnFocusInput}
            {...inputProps}
          />}

          {!!iconStart && <Input
            ref={inputRef}
            name={`textDateTimePicker-${mode}${name ? `-${name}` : ''}`}
            editable={false}
            validity={isValidField}
            placeholder={placeholder}
            value={dateFormatted}
            startAdornment={() => {
                if (Icon) {
                  return <Icon color={currentValidationStyles?.borderColor} />;
                }
                return <DefaultIcon color={currentValidationStyles?.borderColor} />;
            }}
            theme={theme}
            isDirty={isDirty}
            onFocus={handleOnFocusInput}
            {...inputProps}
          />}

        </View>
      </TouchableOpacity>
      <Modal
        visible={show}
        transparent
        animationType={animationType}
        supportedOrientations={['portrait', 'landscape']}>
        <ModalViewTop onPress={close} />
        {Platform.OS === 'ios' && (
          <ModalViewMiddle>
            <TouchableOpacity onPress={clear} hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <View>
                <ActionText allowFontScaling={false}>{clearText || 'clear'}</ActionText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={done} hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <View>
                <ActionText allowFontScaling={false}>{doneText || 'done'}</ActionText>
              </View>
            </TouchableOpacity>
          </ModalViewMiddle>
        )}
        <ModalViewBottom>
          <RNDateTimePicker
            {...rest}
            style={pickerStyle}
            locale={language}
            value={pickerValue}
            mode={mode as 'date' | 'time' | 'datetime' | 'countdown'}
            onChange={selectDate}
            display="spinner"
            textColor="black"
            {...maxAndMinDateProps}
          />
        </ModalViewBottom>
      </Modal>
    </ViewContainer>
  );
};

const DateTimePicker: DateTimePickerComponent = React.forwardRef(
  (props: DateTimePickerProps, ref: Ref<InputRef>) => <Component outerRef={ref} {...props} />,
);

export default DateTimePicker;
