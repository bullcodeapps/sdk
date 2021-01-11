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
import { InputProps, InputContextType, InputContext } from '../Form/Input';
import {
  format,
  isAfter,
  isBefore,
  isEqual,
  isWithinInterval,
  parseISO,
  toDate,
  isValid as isValidDate,
} from 'date-fns';
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
  style?: ViewStyle,
  pickerStyle?: any,
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

  // Refs
  const inputRef = useRef<FieldType>(null);

  const usingValidity = useMemo(() => ![undefined, null].includes(inputProps?.validity), [inputProps?.validity]);

  const onChangeValue = useCallback(
    ({ currentDate, validate = true }: { currentDate: any; validate?: boolean }) => {
      const newMinDate = typeof minDate === 'string' ? new Date(minDate) : minDate;
      const newMaxDate = typeof maxDate === 'string' ? new Date(maxDate) : maxDate;
      const newDate = typeof currentDate === 'string' ? new Date(currentDate) : currentDate;

      if (minDate && maxDate && isWithinInterval(newDate, { start: newMinDate, end: newMaxDate })) {
        setDate(newDate);
        onChange && onChange(newDate);
        if (validate) {
          inputRef?.current?.validate && inputRef.current.validate(newMaxDate);
        }
        return newDate;
      }

      if (minDate && isBefore(newDate, newMinDate)) {
        setDate(newMinDate);
        onChange && onChange(newMinDate);
        if (validate) {
          inputRef?.current?.validate && inputRef.current.validate(newMinDate);
        }
        return newMinDate;
      }

      if (maxDate && isAfter(newDate, newMaxDate)) {
        setDate(newMaxDate);
        onChange && onChange(newMaxDate);
        if (validate) {
          inputRef?.current?.validate && inputRef.current.validate(newMaxDate);
        }
        return newMaxDate;
      }

      setDate(newDate);
      onChange && onChange(newDate);
      if (validate) {
        inputRef?.current?.validate && inputRef.current.validate(newDate);
      }
      return newDate;
    },
    [minDate, maxDate, onChange],
  );

  useEffect(() => {
    if (!date || !value || !isValidDate(date) || !isValidDate(value)) {
      return;
    }
    if (mode === 'date') {
      const parsedDate = toDate(parseISO(format(date, 'yyyy-MM-dd')));
      const parsedValue = toDate(parseISO(format(value, 'yyyy-MM-dd')));

      if (isEqual(parsedDate, parsedValue)) {
        return;
      } else {
        const newDate = typeof value === 'string' ? new Date(value) : value;
        setDate(newDate);
      }
    }

    if (mode === 'time') {
      const parsedDateHour = toDate(parseISO(format(date, 'HH:mm')));
      const parsedValueHour = toDate(parseISO(format(value, 'HH:mm')));

      if (isEqual(parsedDateHour, parsedValueHour)) {
        return;
      } else {
        const newDate = typeof value === 'string' ? new Date(value) : value;
        setDate(newDate);
      }
    }
  }, [date, mode, value]);

  const getDefaultModeFormat = useCallback((mode: string): string => {
    switch (mode) {
      case 'time':
        return 'HH:mm';
      case 'date':
      default:
        return 'dd/MM/yyyy';
    }
  }, []);

  const [choosenFormat, setChoosenFormat] = useState<string>(displayFormat || getDefaultModeFormat(mode));

  const getDateFormatted = useCallback(
    (dateObject: Date) => {
      if (!dateObject || !isValidDate(dateObject) || !choosenFormat?.toString()) {
        return;
      }
      if (typeof dateObject === 'string') {
        dateObject = new Date(dateObject);
      }
      return format(dateObject, choosenFormat.toString(), { locale: (window as any).__dateLocale__ });
    },
    [choosenFormat],
  );

  useEffect(() => {
    if (!displayFormat) {
      setChoosenFormat(getDefaultModeFormat(mode));
    }
  }, [displayFormat, getDefaultModeFormat, mode]);

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

  useEffect(() => {
    if (mode === 'time') {
      if (rest?.minuteInterval && typeof value === 'object') {
        setDate(roundTime(value, rest?.minuteInterval));
        return;
      }
      setDate(value);
    }
  }, [mode, rest.minuteInterval, value]);

  const clear = useCallback(() => {
    // setDate(null);
    setShow(false);
    onChangeValue({ currentDate: null, validate: false });
    // onChange && onChange(null);
  }, [onChangeValue]);

  useEffect(() => {
    registerField<Date>({
      name: fieldName,
      ref: inputRef.current,
      clearValue: clear,
      setValue: (ref: any, val: Date) => {
        // Transforms dates from the form as a string to the data object automatically
        const newDate = typeof val === 'string' ? new Date(val) : val;
        setDate(newDate);
        onChange && onChange(newDate);
        inputRef?.current?.validate && inputRef.current.validate(newDate);
      },
      getValue: () => date,
    });
  }, [fieldName, registerField, date]); // eslint-disable-line

  const selectDate = useCallback(
    (event, newDate: Date) => {
      if (!newDate || date === newDate) {
        return;
      }
      setShow(Platform.OS === 'ios');
      onChangeValue({ currentDate: newDate });
    },
    [date, onChangeValue],
  );

  const togglePicker = useCallback(() => {
    setShow(!show);
    if (show) {
      onChange && onChange(date || new Date());
      inputRef?.current?.validate && inputRef.current.validate(date);
    }
  }, [date, onChange, show]);

  const done = useCallback(() => {
    setShow(false);
    onChangeValue({ currentDate: date || new Date() });
  }, [date, onChangeValue]);

  const handleInputPress = useCallback(() => {
    if (!date) {
      onChangeValue({ currentDate: new Date() });
    }
    togglePicker();

    setIsDirty(true);
  }, [date, onChangeValue, togglePicker]);

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
    if (date) {
      return selectedColor?.valid || selectedColor?.default;
    }

    return selectedColor?.default;
  }, [
    error,
    getColorTypeByValidity,
    inputProps?.validity,
    selectedColor?.default,
    selectedColor?.invalid,
    usingValidity,
    date,
  ]);

  const DefaultIcon = useCallback(
    (props: SvgProps) => (mode === 'time' ? <ClockIcon {...props} /> : <CalendarIcon {...props} />),
    [mode],
  );
  const isValid = useMemo(() => {
    if (!isDirty) {
      return 'keepDefault';
    }

    if (error) {
      return false;
    }

    if (![null, undefined].includes(date) && [null, undefined].includes(error)) {
      return true;
    }

    return 'keepDefault';
  }, [date, error, isDirty]);

  return (
    <ViewContainer style={style}>
      <TouchableOpacity onPress={handleInputPress} activeOpacity={1}>
        <View pointerEvents="none">
          <Input
            ref={inputRef}
            name={`textDateTimePicker-${mode}${name ? `-${name}` : ''}`}
            editable={false}
            validity={isValid}
            placeholder={placeholder}
            value={date && getDateFormatted(date)}
            iconComponent={() => {
              if (Icon) {
                return <Icon color={currentValidationStyles?.borderColor} />;
              }
              return <DefaultIcon color={currentValidationStyles?.borderColor} />;
            }}
            color={color}
            isDirty={isDirty}
            onChangeDirty={(dirty) => setIsDirty(dirty)}
            {...inputProps}
          />
        </View>
      </TouchableOpacity>
      <Modal
        visible={show}
        transparent
        animationType={animationType}
        supportedOrientations={['portrait', 'landscape']}
      >
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
            value={date}
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
