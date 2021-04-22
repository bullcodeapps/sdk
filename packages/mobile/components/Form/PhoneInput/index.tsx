import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useContext,
} from 'react';
import { TextInput, GestureResponderEvent, ViewStyle, TextStyle } from 'react-native';

import Select, { SelectItem, NativeSelectStyle } from '../../../components/Form/Select';
import { Content } from './styles';
import { PhoneInputContainer, Input } from './styles';
import { PhoneInputStyle } from './types';
import { DefaultStyles } from './context';

import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  CountryCode as PNCountryCode,
  parsePhoneNumberFromString,
} from 'libphonenumber-js/max';
import { useField } from '@unform/core';
import { useCombinedRefs } from '../../../../core/hooks';
import { InputRef, InputFieldType, InputProps } from '../Input';
import ValidityMark from '@bullcode/mobile/components/Form/Input/ValidityMark';
import { PickerStyle } from 'react-native-picker-select';
import { getStyleByValidity } from '@bullcode/mobile/utils';

import { PhoneInputContextType, PhoneInputContext } from './context';

export type CountryCode = PNCountryCode;

export type CustomProps = {
  name?: string;
  outerRef?: InputRef;
  inputRef?: React.MutableRefObject<InputRef>;
  nextInputRef?: React.MutableRefObject<InputRef>;
  placeholder?: string;
  useValidityMark?: boolean;
  defaultCountry?: CountryCode;
  onChange?: Dispatch<SetStateAction<string>>;
  onChangeCountry?: Dispatch<SetStateAction<CountryCode>>;
  onMarkPress?: (event?: GestureResponderEvent) => void;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  selectStyle?: NativeSelectStyle & PickerStyle;
};

export type PhoneInputProps = CustomProps & Omit<InputProps, 'name'>;

export type PhoneInputComponent = React.FC<PhoneInputProps>;

const PhoneInput: PhoneInputComponent = ({
  name,
  outerRef,
  inputRef,
  nextInputRef,
  placeholder,
  useValidityMark,
  defaultCountry,
  onChange,
  onChangeCountry,
  onMarkPress,
  onFocus: propOnFocus,
  style,
  contentContainerStyle,
  inputStyle,
  selectStyle = {},
  ...rest
}) => {
  const ctx = useContext<PhoneInputContextType>(PhoneInputContext);

  // States
  const [countries, setCountries] = useState<SelectItem[]>([]);
  const [localSelectedCountry, setLocalSelectedCountry] = useState<CountryCode>(defaultCountry);
  const [selectIsValid, setSelectIsValid] = useState<boolean>();
  const [inputIsValid, setInputIsValid] = useState<boolean>();
  const [phone, setPhone] = useState<string>();
  const [isDirty, setIsDirty] = useState(false);
  const { fieldName, registerField, error } = useField(name);

  // Refs
  const combinedRef = useCombinedRefs<InputFieldType>(inputRef, outerRef);

  const isValid = useMemo(() => {
    const hasPhone = phone !== undefined && phone !== null;
    const hasLocalSelectedCountry = localSelectedCountry !== undefined && localSelectedCountry !== null;

    if (phone) {
      const asYouType = new AsYouType(localSelectedCountry);
      asYouType.input(phone)

      return (
        selectIsValid &&
        inputIsValid &&
        hasPhone &&
        hasLocalSelectedCountry &&
        asYouType.getNumber().isValid()
      );
    }

    return false;
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

  const selectedStyle: PhoneInputStyle = useMemo(() => {
    const styles = ctx?.styles || DefaultStyles;
    const foundStyle = styles.find((_style) => _style.name === rest?.theme);
    if (!foundStyle) {
      console.log(
        `[PhoneInput] The "${rest?.theme}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultStyles[0];
    }
    return foundStyle;
  }, [rest?.theme, ctx?.styles]);

  const currentValidationStyles = useMemo(() => {
    if (usingValidity) {
      if (rest?.validity === 'keepDefault') {
        return selectedStyle?.default;
      }
      return getStyleByValidity(rest?.validity, selectedStyle);
    }

    if (!isDirty) {
      return selectedStyle?.default;
    }

    return getStyleByValidity(isValid, selectedStyle);
  }, [usingValidity, isValid, selectedStyle.default, rest?.validity, getStyleByValidity, isDirty]);

  const defaultSelectStyle: NativeSelectStyle = useMemo(
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

  const selectIconStyle = useMemo(
    () => ({
      color: currentValidationStyles?.select?.dropDownIcon || selectedStyle?.default?.select?.dropDownIcon,
    }),
    [currentValidationStyles?.select?.dropDownIcon, selectedStyle?.default?.select?.dropDownIcon],
  );

  useEffect(() => {
    combinedRef.current.markAsDirty = () => {
      if (isDirty) {
        return;
      }

      setIsDirty(true);
    };
  }, [combinedRef, isDirty]);

  const validity = useMemo(() => {
    if (!isDirty) {
      return 'keepDefault';
    }

    return isValid;
  }, [isDirty, isValid]);

  const onFocus = useCallback(
    (e) => {
      if (!isDirty) {
        setIsDirty(true);
      }

      propOnFocus && propOnFocus(e);
    },
    [isDirty, propOnFocus],
  );

  const handleOpenSelect = useCallback(() => {
    if (!isDirty) {
      setIsDirty(true);
    }
  }, [isDirty]);

  return (
    <PhoneInputContainer
      color={rest?.theme}
      style={[
        {
          borderRadius: selectedStyle?.default?.borderRadius,
          borderColor: currentValidationStyles?.input?.borderColor,
        },
        style,
      ]}>
      <Content>
        <Select
          items={countries}
          name={`country-select-${name}`}
          defaultValue={defaultCountry}
          value={localSelectedCountry}
          onValueChange={(value: string | number | Object) => handleChangeCountry(value as CountryCode)}
          onChangeValidity={setSelectIsValid}
          onOpen={handleOpenSelect}
          style={{ ...defaultSelectStyle, ...selectStyle }}
          iconStyle={selectIconStyle}
        />
        <Input
          ref={combinedRef}
          name={`formatted-number-input-${name}`}
          validity={validity}
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
              borderRadius: selectedStyle?.default?.borderRadius,
              paddingRight: usingValidity && useValidityMark ? 45 : 0,
            },
            rest?.style,
          ]}
          inputStyle={{
            paddingLeft: 10,
            borderWidth: 0,
            color: currentValidationStyles?.input?.color
          }}
          iconComponent={(props) => {
            if (selectedStyle?.validityMarkComponent) {
              const CustomValidityMark = selectedStyle?.validityMarkComponent;
              return <CustomValidityMark {...props} />;
            }
            return isDirty ? (
              <ValidityMark
                isValid={isValid}
                colors={selectedStyle?.validityMark}
                onPress={(e) => {
                  !!onMarkPress && onMarkPress(e);
                }}
              />
            ) : null;
          }}
          isDirty={isDirty}
          onFocus={onFocus}
        />
      </Content>
    </PhoneInputContainer>
  );
};

export default PhoneInput;
