import React, { Dispatch, SetStateAction, useCallback, useEffect, useState, useMemo, useContext } from 'react';
import { TextInput, GestureResponderEvent, ViewStyle } from 'react-native';

import Select, { SelectItem, SelectStyle } from '../../../components/Form/Select';
import { PhoneInputContainer, Input, PhoneInputStyles, PhoneInputStyle, DefaultColors } from './styles';

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
import { InputRef, InputFieldType, InputProps } from '../Input';
import ValidityMark from '@bullcode/mobile/components/Form/Input/ValidityMark';
import { PickerStyle } from 'react-native-picker-select';

export type PhoneInputContextType = { colors: PhoneInputStyles };

export const PhoneInputContext = React.createContext<PhoneInputContextType>({ colors: null });

export const setPhoneInputColors = (colors: PhoneInputStyles) => {
  const ctx = useContext<PhoneInputContextType>(PhoneInputContext);
  ctx.colors = colors;
};

export type CountryCode = PNCountryCode;

export type CustomProps = {
  name?: string;
  inputRef?: React.MutableRefObject<InputRef>;
  nextInputRef?: React.MutableRefObject<InputRef>;
  placeholder?: string;
  useValidityMark?: boolean;
  defaultCountry?: CountryCode;
  containerStyle?: ViewStyle;
  selectStyle?: SelectStyle & PickerStyle;
  onChange?: Dispatch<SetStateAction<string>>;
  onChangeCountry?: Dispatch<SetStateAction<CountryCode>>;
  onMarkPress?: (event?: GestureResponderEvent) => void;
};

export type PhoneInputProps = CustomProps & Omit<InputProps, 'name'>;

const PhoneInput: React.FC<PhoneInputProps> = ({
  name,
  inputRef,
  nextInputRef,
  placeholder,
  useValidityMark,
  defaultCountry,
  containerStyle,
  selectStyle = {},
  onChange,
  onChangeCountry,
  onMarkPress,
  ...rest
}) => {
  const ctx = useContext<PhoneInputContextType>(PhoneInputContext);

  // States
  const [countries, setCountries] = useState<SelectItem[]>([]);
  const [localSelectedCountry, setLocalSelectedCountry] = useState<CountryCode>(defaultCountry);
  const [selectIsValid, setSelectIsValid] = useState<boolean>();
  const [inputIsValid, setInputIsValid] = useState<boolean>();
  const [phone, setPhone] = useState<string>();
  const { fieldName, registerField, error } = useField(name);

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

  const usingValidity = useMemo(() => ![undefined, null].includes(rest?.validity), [rest?.validity]);

  const selectedColor: PhoneInputStyle = useMemo(() => {
    const colors = ctx?.colors || DefaultColors;
    const foundColor = colors.find((_color) => _color.name === rest?.color);
    if (!foundColor) {
      console.log(
        `The "${rest?.color}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultColors[0];
    }
    return foundColor;
  }, [rest?.color, ctx?.colors]);

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
      if (rest?.validity === 'keepDefault') {
        return selectedColor?.default;
      }
      return getColorTypeByValidity(rest?.validity);
    }
    if (phone?.length > 0) {
      return getColorTypeByValidity(isValid);
    }

    if (isValid && !!phone) {
      return selectedColor?.invalid || selectedColor?.default;
    }

    return selectedColor?.default;
  }, [
    usingValidity,
    phone,
    isValid,
    selectedColor?.default,
    selectedColor?.invalid,
    rest?.validity,
    getColorTypeByValidity,
  ]);

  const defaultSelectStyle: SelectStyle = useMemo(
    () => ({
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
        color: currentValidationStyles?.select?.placeholder,
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
        fontSize: 16,
        fontWeight: 'bold',
        color: currentValidationStyles?.select?.color,
        backgroundColor: currentValidationStyles?.select?.backgroundColor,
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
        color: currentValidationStyles?.select?.color,
        backgroundColor: currentValidationStyles?.select?.backgroundColor,
      },
      iconContainer: {
        paddingTop: 3,
        paddingRight: 5,
      },
    }),
    [
      currentValidationStyles?.select?.backgroundColor,
      currentValidationStyles?.select?.color,
      currentValidationStyles?.select?.placeholder,
    ],
  );

  return (
    <PhoneInputContainer
      color={rest?.color}
      style={[
        {
          borderRadius: selectedColor?.default?.borderRadius,
          borderColor: currentValidationStyles?.input?.borderColor,
        },
        containerStyle,
      ]}>
      <Select
        items={countries}
        name={`country-select-${name}`}
        defaultValue={defaultCountry}
        value={localSelectedCountry}
        onValueChange={(value: string | number | Object) => handleChangeCountry(value as CountryCode)}
        onChangeValidity={setSelectIsValid}
        style={{ ...defaultSelectStyle, ...selectStyle }}
        iconStyle={{
          iconStyle: {
            color: currentValidationStyles?.select?.color,
          },
        }}
      />
      <Input
        ref={combinedRef}
        name={`formatted-number-input-${name}`}
        validity={!phone?.length ? 'keepDefault' : isValid}
        value={phone}
        placeholder={placeholder}
        maxLength={35}
        onChangeText={handleChangePhone}
        returnKeyType="next"
        onSubmitEditing={() => {
          nextInputRef && nextInputRef.current?.focus();
        }}
        onChangeValidity={setInputIsValid}
        keyboardType={'phone-pad'}
        {...rest}
        selectionColor={currentValidationStyles?.input?.selectionColor}
        style={[
          {
            backgroundColor: currentValidationStyles?.input?.backgroundColor || 'transparent',
            borderColor: currentValidationStyles?.input?.borderColor,
            color: currentValidationStyles?.input?.color,
            borderRadius: selectedColor?.default?.borderRadius,
            paddingRight: usingValidity && useValidityMark ? 45 : 0,
          },
          rest?.style,
        ]}
        iconComponent={(props) => {
          if (selectedColor?.validityMarkComponent) {
            const CustomValidityMark = selectedColor?.validityMarkComponent;
            return <CustomValidityMark {...props} />;
          }
          return phone?.length > 0 ? (
            <ValidityMark
              isValid={isValid}
              colors={selectedColor?.validityMark}
              onPress={(e) => {
                !!onMarkPress && onMarkPress(e);
              }}
            />
          ) : null;
        }}
      />
    </PhoneInputContainer>
  );
};

export default PhoneInput;
