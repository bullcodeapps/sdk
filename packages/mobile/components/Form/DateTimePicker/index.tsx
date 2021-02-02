import React, { useState, useEffect, useCallback, useRef, useMemo, useContext } from 'react';

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
import { InputProps, InputContextType, InputContext } from '../Input';
import { format, isAfter, isBefore, isEqual, isValid, isWithinInterval } from 'date-fns';
import { useField } from '@unform/core';
import { InputStyle, DefaultColors } from '@bullcode/mobile/components/Form/Input/styles';
import { SvgProps } from 'react-native-svg';

export type DateTimePickerProps = {
  name?: string;
  mode?: 'date' | 'time';
  color?: string;
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
  pickerStyle?: any;
  isDirty?: boolean;
  onFocus?: () => void;
  onChange?: (value: Date) => void;
};

export type DateTimePickerComponent = React.FC<DateTimePickerProps>;

const DateTimePicker: DateTimePickerComponent = ({
  name,
  mode = 'date',
  color,
  placeholder = 'date',
  value,
  doneText = 'Done',
  clearText = 'Clear',
  displayFormat,
  inputProps,
  maxDate,
  minDate,
  language = 'pt-BR',
  icon: Icon,
  style,
  pickerStyle,
  isDirty: propIsDirty,
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

  // Simple memo's
  const modeFormat = useMemo(() => (mode === 'time' ? 'HH:mm' : 'dd/MM/yyyy'), [mode]);
  const choosenFormat = useMemo(() => displayFormat || modeFormat, [displayFormat, modeFormat]);
  const usingValidity = useMemo(() => ![undefined, null].includes(inputProps?.validity), [inputProps?.validity]);

  const DefaultIcon = useCallback(
    (props: SvgProps) => (mode === 'time' ? <ClockIcon {...props} /> : <CalendarIcon {...props} />),
    [mode],
  );

  const parseStrToDate = useCallback((_date: string | Date): Date => {
    if (typeof _date === 'string') {
      return new Date(_date);
    }
    return _date;
  }, []);

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
    if (!newDate || !isValid(newDate) || !choosenFormat) {
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
        if (_oldDate && newDate && isValid(_oldDate) && isValid(newDate)) {
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
          inputRef?.current?.validate && inputRef.current.validate(newDate);
        }
        return newDate;
      });
      return newDate;
    },
    [mode, onChange, parseStrToDate],
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
        return doValueChange(newDate);
      }

      if (parsedMinDate && isBefore(parsedDate, parsedMinDate)) {
        return doValueChange(parsedMinDate);
      }

      if (parsedMaxDate && isAfter(parsedDate, parsedMaxDate)) {
        return doValueChange(parsedMaxDate);
      }

      return doValueChange(parsedDate);
    },
    [doValueChange, maxDate, minDate, parseStrToDate],
  );

  /*
   * When the values are changed via prop we must do some things
   */
  useEffect(() => {
    const newDate = parseStrToDate(value);
    setDate(newDate);
    inputRef?.current?.validate && inputRef.current.validate(newDate);
    onChange && onChange(newDate);
  }, [isDirty, onChange, parseStrToDate, value]);

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
      ref: inputRef.current,
      clearValue: clear,
      setValue: (ref: any, val: Date) => {
        // Transforms dates from the form as a string to the data object automatically
        const newDate = parseStrToDate(val);
        setDate(newDate);
        setInitialDate(newDate);
        inputRef?.current?.validate && inputRef.current.validate(newDate);
        onChange && onChange(newDate);
      },
      getValue: () => date,
    });
  }, [fieldName, registerField, date]); // eslint-disable-line

  const selectDate = useCallback(
    (event, newDate: Date) => {
      if (newDate === date || isEqual(date, newDate)) {
        return;
      }
      setShow(Platform.OS === 'ios');
      onChangeValue({ currentDate: newDate, validate: true });
    },
    [date, onChangeValue],
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

  const handleInputPress = useCallback(() => {
    togglePicker();

    if (!isDirty) {
      setIsDirty(true);
    }
  }, [isDirty, togglePicker]);

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
      if (inputProps?.validity === 'keepDefault') {
        return selectedColor?.default;
      }
      return getColorTypeByValidity(inputProps?.validity);
    }

    if (!isDirty) {
      return selectedColor?.default;
    }

    return getColorTypeByValidity(!error);
  }, [usingValidity, isDirty, getColorTypeByValidity, error, inputProps?.validity, selectedColor?.default]);

  const isValidField = useMemo(() => {
    if (usingValidity) {
      return inputProps?.validity;
    }

    if (!isDirty) {
      return 'keepDefault';
    }

    return [null, undefined].includes(error);
  }, [error, inputProps?.validity, isDirty, usingValidity]);

  const handleOnFocusInput = useCallback(() => {
    if (!isDirty) {
      setIsDirty(true);
    }
    onFocus && onFocus();
  }, [isDirty, onFocus]);

  const pickerValue = useMemo(
    () => ([undefined, null].includes(parseStrToDate(date)) ? initialDate : parseStrToDate(date)),
    [date, initialDate, parseStrToDate],
  );

  return (
    <ViewContainer style={style}>
      <TouchableOpacity onPress={handleInputPress} activeOpacity={1}>
        <View pointerEvents="none">
          <Input
            ref={inputRef}
            name={`textDateTimePicker-${mode}${name ? `-${name}` : ''}`}
            editable={false}
            validity={isValidField}
            placeholder={placeholder}
            value={dateFormatted}
            iconComponent={() => {
              if (Icon) {
                return <Icon color={currentValidationStyles?.borderColor} />;
              }
              return <DefaultIcon color={currentValidationStyles?.borderColor} />;
            }}
            color={color}
            isDirty={isDirty}
            onFocus={handleOnFocusInput}
            {...inputProps}
          />
        </View>
      </TouchableOpacity>
      <Modal
        visible={show}
        transparent
        animationType={animationType}
        supportedOrientations={['portrait', 'landscape']}>
        <ModalViewTop onPress={handleInputPress} />
        {Platform.OS === 'ios' && (
          <ModalViewMiddle>
            <TouchableOpacity onPress={() => clear()} hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <View>
                <ActionText allowFontScaling={false}>{clearText}</ActionText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => done()} hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <View>
                <ActionText allowFontScaling={false}>{doneText}</ActionText>
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
            maximumDate={maxDate}
            minimumDate={minDate}
            mode={mode as 'date' | 'time' | 'datetime' | 'countdown'}
            onChange={selectDate}
            display="spinner"
            textColor="black"
          />
        </ModalViewBottom>
      </Modal>
    </ViewContainer>
  );
};

export default DateTimePicker;
