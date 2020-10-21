import React, { Dispatch, SetStateAction, useCallback, useEffect, useState, useMemo, ComponentType } from 'react';
import { Animated, StyleSheet, TextInput, GestureResponderEvent } from 'react-native';

import Select, { SelectItem, SelectStyle } from '../../../components/Form/Select';
import { PhoneInputContainer, PhoneInput as Input } from './styles';

import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  CountryCode as PNCountryCode,
  parsePhoneNumberFromString,
  isValidNumber,
} from 'libphonenumber-js';
import { useField } from '@unform/core';
import { useCombinedRefs } from '../../../../core/hooks';
import ValidityMark from '../../../components/Form/Input/ValidityMark';
import { IconContainer } from '../../../components/Form/Input/styles';
import { InputComponent, InputRef, InputFieldType } from '../Input';

export type CountryCode = PNCountryCode;

export type CustomProps = {
  color?: 'primary' | 'secondary';
  name?: string;
  inputRef?: React.MutableRefObject<InputRef>;
  nextInputRef?: React.MutableRefObject<InputRef>;
  placeholder?: string;
  useValidityMark?: boolean;
  defaultCountry?: CountryCode;
  onChange?: Dispatch<SetStateAction<string>>;
  onChangeCountry?: Dispatch<SetStateAction<CountryCode>>;
  onMarkPress?: (event?: GestureResponderEvent) => void;
};

export type PhoneInputProps = CustomProps & InputComponent;

const PhoneInput: React.FC<PhoneInputProps> = ({
  color = 'primary',
  name,
  inputRef,
  nextInputRef,
  placeholder,
  useValidityMark,
  defaultCountry,
  onChange,
  onChangeCountry,
  onMarkPress,
  ...rest
}) => {
  // States
  const [countries, setCountries] = useState<SelectItem[]>([]);
  const [localSelectedCountry, setLocalSelectedCountry] = useState<CountryCode>(defaultCountry);
  const [selectIsValid, setSelectIsValid] = useState<boolean>();
  const [inputIsValid, setInputIsValid] = useState<boolean>();
  const [phone, setPhone] = useState<string>();
  const { fieldName, registerField } = useField(name);

  // Refs
  const combinedRef = useCombinedRefs<InputFieldType>(inputRef);

  const isValid = useMemo(() => {
    const hasPhone = phone !== undefined && phone !== null;
    const hasLocalSelectedCountry = localSelectedCountry !== undefined && localSelectedCountry !== null;

    return (
      selectIsValid &&
      inputIsValid &&
      hasPhone &&
      hasLocalSelectedCountry &&
      isValidNumber(phone, localSelectedCountry)
    );
  }, [selectIsValid, inputIsValid, phone, localSelectedCountry]);

  useEffect(() => {
    if (phone) {
      const parsedValue = parsePhoneNumberFromString(phone, localSelectedCountry);
      if (parsedValue) {
        onChange && onChange(parsedValue.formatInternational());
      }
    }
  }, [localSelectedCountry, onChange, phone]);

  useEffect(() => {
    if (phone) {
      const parsedValue = parsePhoneNumberFromString(phone, localSelectedCountry);
      if (parsedValue) {
        combinedRef?.current?.validate && combinedRef.current.validate(parsedValue.formatInternational());
      }
    }
  }, [combinedRef, localSelectedCountry, phone]);

  useEffect(() => {
    const countriesList = getCountries();

    const formattedCountries = countriesList
      .map((country) => ({
        label: `${getUnicodeFlagIcon(country)} +${getCountryCallingCode(country)}`,
        value: country,
        code: getCountryCallingCode(country),
      }))
      .sort((a, b) => {
        // primeiro ordenamos pelo código
        if (parseInt(a.code.toString()) < parseInt(b.code.toString())) {
          return -1;
        }
        if (parseInt(a.code.toString()) > parseInt(b.code.toString())) {
          return 1;
        }
        // depois pelo nome
        if (a.value < b.value) {
          return -1;
        }
        if (a.value > b.value) {
          return 1;
        }

        return 0;
      });
    setCountries(formattedCountries);
  }, []);

  const handleChangePhone = useCallback(
    (value: string) => {
      const parsedPhone = new AsYouType(localSelectedCountry).input(value || '');
      setPhone(parsedPhone);
    },
    [localSelectedCountry],
  );

  const handleChangeCountry = useCallback(
    (country: CountryCode) => {
      if (localSelectedCountry === country) {
        return;
      }
      setLocalSelectedCountry(country);
      onChangeCountry && onChangeCountry(country);
    },
    [localSelectedCountry, onChangeCountry],
  );

  const clear = useCallback(() => {
    setPhone('');
    setLocalSelectedCountry(defaultCountry);
  }, [defaultCountry]);

  const setValue = useCallback(
    (ref: TextInput, val: string) => {
      if (typeof val !== 'string') {
        return;
      }
      const phoneNumber = parsePhoneNumberFromString(val, defaultCountry);
      setLocalSelectedCountry(phoneNumber?.country);
      setPhone(phoneNumber?.formatNational());
    },
    [defaultCountry],
  );

  const getValue = useCallback(() => {
    if (typeof phone !== 'string') {
      return null;
    }
    const parsedValue = parsePhoneNumberFromString(phone, localSelectedCountry);
    return parsedValue?.formatInternational ? parsedValue?.formatInternational() : null;
  }, [localSelectedCountry, phone]);

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: combinedRef.current,
      clearValue: clear,
      setValue,
      getValue,
    });
  }, [clear, combinedRef, defaultCountry, fieldName, getValue, registerField, setValue]);

  const formattedColor = useMemo(() => {
    if (phone && phone.length > 0) {
      if (isValid) {
        return color === 'primary' ? '#3a9def' : '#00f2d5';
      }
      return '#ffc962';
    }
    return color === 'primary' ? '#bbc8cf' : '#ffffff';
  }, [color, isValid, phone]);

  return (
    <PhoneInputContainer color={color} style={{ borderColor: formattedColor }}>
      <Select
        items={countries}
        name="country"
        defaultValue={defaultCountry}
        value={localSelectedCountry}
        onValueChange={(value: string | number | Object) => handleChangeCountry(value as CountryCode)}
        onChangeValidity={setSelectIsValid}
        style={pickerStyle({ color })}
        iconStyle={iconStyles.iconStyle}
      />
      <Input
        ref={combinedRef}
        name="formatted"
        value={phone}
        placeholder={placeholder}
        maxLength={35}
        onChangeText={handleChangePhone}
        returnKeyType="next"
        onSubmitEditing={() => {
          nextInputRef && nextInputRef.current?.focus();
        }}
        onChangeValidity={setInputIsValid}
        color={color}
        keyboardType={'phone-pad'}
        {...rest}
      />
      {useValidityMark && phone?.length > 0 && (
        <IconContainer>
          <ValidityMark
            isValid={isValid}
            color={formattedColor}
            onPress={(e) => !!onMarkPress && onMarkPress(e)}
          />
        </IconContainer>
      )}
    </PhoneInputContainer>
  );
};

const pickerStyle = ({ color }) =>
  StyleSheet.create({
    selectContainer: {
      flexGrow: 1,
      marginTop: 0,
      alignSelf: 'stretch',
      maxWidth: 125,
    },
    viewContainer: {
      flexGrow: 1,
    },
    placeholder: {
      color: color === 'primary' ? '#2d2d30' : '#fff',
    },
    inputIOSContainer: {
      flexGrow: 1,
      flexDirection: 'row',
      alignItems: 'center',
      height: '100%',
    },
    inputIOS: {
      flexGrow: 1,
      height: '100%',
      paddingLeft: 20,
      paddingRight: 25 + 5, // IconContainer size + left space
      borderTopLeftRadius: 50,
      borderBottomLeftRadius: 50,
      fontSize: 16,
      fontWeight: 'bold',
      color: color === 'primary' ? '#2d2d30' : '#fff',
      backgroundColor: color === 'primary' ? '#bbc8cf' : '#085d96',
    },
    inputAndroidContainer: {
      flexGrow: 1,
      flexDirection: 'row',
      alignItems: 'center',
      height: '100%',
    },
    inputAndroid: {
      flexGrow: 1,
      height: '100%',
      padding: 0,
      paddingLeft: 20,
      paddingRight: 25 + 5, // IconContainer size + left space
      borderTopLeftRadius: 50,
      borderBottomLeftRadius: 50,
      fontSize: 16,
      fontWeight: 'bold',
      color: color === 'primary' ? '#2d2d30' : '#fff',
      backgroundColor: color === 'primary' ? '#bbc8cf' : '#085d96',
    },
    iconContainer: {
      paddingTop: 3,
      paddingRight: 5,
    },
  } as SelectStyle);

const iconStyles = StyleSheet.create({
  iconStyle: {
    color: '#2d2d30',
  },
});

export default PhoneInput;
