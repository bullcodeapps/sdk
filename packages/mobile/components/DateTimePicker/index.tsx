import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

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
import { InputProps } from '../Form/Input';
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
import i18n from '../../../../languages';
import { useField } from '@unform/core';

const isIOS14 = Platform.OS === 'ios' && +Platform.Version >= 14;

interface Props {
  style?: any;
  containerStyle?: ViewStyle;
}

export type DateTimePickerProps = {
  name?: string;
  mode?: 'date' | 'time';
  color?: 'primary' | 'secondary';
  placeholder?: string;
  displayFormat?: string;
  value?: Date;
  style?: any;
  doneText?: string;
  clearText?: string;
  maxDate?: Date;
  minDate?: Date;
  minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;
  onChange?: (value: Date) => void;
  inputProps?: InputProps & Props;
  icon?: any;
};

const DateTimePicker = ({
  name,
  mode = 'date',
  color = 'primary',
  placeholder = 'date',
  value,
  doneText = 'Done',
  clearText = 'Clear',
  displayFormat,
  inputProps,
  maxDate,
  minDate,
  onChange,
  icon: Icon,
  ...rest
}: DateTimePickerProps) => {
  const animationType = 'slide';

  // States
  const [date, setDate] = useState<Date | null>(null);
  const [show, setShow] = useState(false);
  const { fieldName, registerField, error } = useField(name);

  // Refs
  const inputRef = useRef<FieldType>(null);

  const isValid = useMemo(() => !error, [error]);

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
  }, [date, onChangeValue, togglePicker]);

  const formattedColor = useMemo(() => {
    if (date) {
      if (isValid) {
        return color === 'primary' ? '#3a9def' : '#00f2d5';
      }
      return '#ffc962';
    }
    return color === 'primary' ? '#bbc8cf' : '#ffffff';
  }, [color, date, isValid]);

  const defaultIcon = useMemo(
    () =>
      mode === 'time' ? (
        <ClockIcon defaultColor={color} color={formattedColor} />
      ) : (
        <CalendarIcon defaultColor={color} color={formattedColor} />
      ),
    [color, formattedColor, mode],
  );

  return (
    <ViewContainer>
      <TouchableOpacity onPress={handleInputPress} activeOpacity={1}>
        <View pointerEvents="none">
          <Input
            ref={inputRef}
            name={`textDateTimePicker-${mode}${name ? `-${name}` : ''}`}
            editable={false}
            validity={date && isValid}
            placeholder={placeholder}
            value={date && getDateFormatted(date)}
            iconComponent={Icon ? <Icon defaultColor={color} color={formattedColor} /> : defaultIcon}
            color={color}
            {...inputProps}
          />
        </View>
      </TouchableOpacity>
      <Modal
        visible={show}
        transparent
        animationType={animationType}
        supportedOrientations={['portrait', 'landscape']}
        // onOrientationChange={this.onOrientationChange}
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
            locale={i18n.language}
            value={date}
            maximumDate={maxDate}
            minimumDate={minDate}
            mode={mode as 'date' | 'time' | 'datetime' | 'countdown'}
            onChange={selectDate}
            {...(isIOS14 ? { display: 'spinner' } : { textColor: 'black' })} // on ios 14+ causes crash
          />
        </ModalViewBottom>
      </Modal>
    </ViewContainer>
  );
};

export default DateTimePicker;
