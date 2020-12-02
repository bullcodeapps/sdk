import React, { useCallback, useEffect, useMemo, useRef, useState, useContext } from 'react';
import { TextInput, ActivityIndicator, TextInputKeyPressEventData, NativeSyntheticEvent } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { useField } from '@unform/core';
import { useDebouncedState } from '../../../../core/hooks';

import { FormFieldType } from '..';

import { Autocomplete, Row, Text, Input } from './styles';
import { InputContextType, InputContext } from '@bullcode/mobile/components/Form/Input';
import { DefaultColors, InputStyle } from '@bullcode/mobile/components/Form/Input/styles';

type Props = {
  name: string;
  color?: string;
  data: Array<Object>;
  onChange?: (text?: string) => void;
  onFocus?: (text?: string) => void;
  loading?: boolean;
  listItemKey: string;
  onSelectItem?: (item: Object) => void;
  placeholder?: string;
  listItemTextComponent?: React.FunctionComponent<{ item: any }>;
  textInputHeight?: number;
  cleanOnPress?: boolean;
  validate?: boolean;
  validity?: boolean;
  useValidityMark?: boolean;
  inputIcon?: any;
  inputBorderRadius?: number;
};

const Suggest: React.FC<Props> = ({
  name,
  color,
  data,
  onChange,
  onFocus,
  loading,
  listItemKey,
  placeholder = 'Digite para pesquisar',
  listItemTextComponent: ListItemTextComponent,
  onSelectItem,
  textInputHeight = 55,
  cleanOnPress = false,
  validate = true,
  validity: propValidity,
  useValidityMark,
  inputIcon,
  inputBorderRadius = 25,
  ...rest
}) => {
  const ctx = useContext<InputContextType>(InputContext);

  // Refs
  const inputRef = useRef<FormFieldType<TextInput>>(null);

  // States
  const [selectedItem, setSelectedItem] = useState<object>();
  const [hideResults, setHideResults] = useState(false);
  const [term, setTerm] = useState('');
  const debouncedTerm = useDebouncedState(term);
  const [isFocused, setIsFocused] = useState(false);

  // Form
  const { fieldName, registerField, error } = useField(name);

  useEffect(() => {
    if (validate) {
      inputRef?.current?.validate && inputRef.current.validate(selectedItem || '');
    }
  }, [selectedItem, validate]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      clearValue: () => {
        setSelectedItem(undefined);
      },
      setValue: (ref: TextInput, val: Object) => {
        setSelectedItem(val);
      },
      getValue: () => selectedItem,
    });
  }, [inputRef, fieldName, registerField, selectedItem]);

  /* It was done in this way to prevent multiple API calls. So, the idea here is
  to use a state and a debounced state. When the onChangeText function is called, the new
  state is going to be set and after 500 miliseconds, it's gonna to be invoked the onChange function.
  */
  useEffect(() => {
    onChange && onChange(debouncedTerm);
  }, [debouncedTerm, onChange]);

  useEffect(() => {
    if (data !== undefined) {
      setHideResults(!data?.length || !isFocused || !!selectedItem || !term?.length);
    }
  }, [data, isFocused, selectedItem, term?.length]);

  const onChangeText = useCallback((text: string) => {
    setTerm(text);
    setHideResults(!text?.length);
  }, []);

  const onPress = (item) => {
    if (!cleanOnPress) {
      setSelectedItem(item);
    }
    setHideResults(true);
    onSelectItem && onSelectItem(item);
    setTerm('');
  };

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    if (term?.length === 0) {
      onFocus && onFocus(term);
    }
  }, [onFocus, term]);

  const handleInputBlur = useCallback(() => setIsFocused(false), []);

  const usingValidity = useMemo(() => ![undefined, null].includes(propValidity), [propValidity]);

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
      return getColorTypeByValidity(propValidity);
    }
    if (selectedItem && Object.keys(selectedItem)?.length > 0) {
      return getColorTypeByValidity(!error);
    }

    if (!!error && !!selectedItem) {
      return selectedColor?.invalid || selectedColor?.default;
    }

    return selectedColor?.default;
  }, [
    usingValidity,
    selectedItem,
    error,
    selectedColor.default,
    selectedColor.invalid,
    getColorTypeByValidity,
    propValidity,
  ]);

  const handleInpuOnKeyPress = useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      event?.preventDefault();
      event?.stopPropagation();
      if (!!selectedItem && event?.nativeEvent?.key === 'Backspace') {
        setSelectedItem(undefined);
      }
    },
    [selectedItem],
  );

  const renderInput = useCallback(
    (props) => {
      /* It was done in this way because the inputRef functions was throwing errors and the ref needs to be
      passed to the AutoComplete component and not to the Input directly. So, if the prop cleanOnPress is true
      the Input value is going to be the term state, otherwise is going to be the props.value. Doing is this way, we can
      guarantee that when an option is selected, the input value is going to be clean */

      const value = cleanOnPress ? term : props.value;
      delete props.value;

      return (
        <Input
          ref={props.ref}
          name={`inner-text-input-${fieldName}`}
          color={color}
          useValidityMark={!inputIcon && useValidityMark}
          selectTextOnFocus
          placeholder={placeholder}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          iconComponent={loading ? <ActivityIndicator /> : inputIcon}
          autoCorrect={false}
          {...props}
          onKeyPress={(e) => {
            handleInpuOnKeyPress(e);
            props?.onKeyPress && props.onKeyPress(e);
          }}
          validity={!!selectedItem && !!value?.length ? !error : 'keepDefault'}
          value={value}
          style={
            hideResults
              ? {}
              : {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }
          }
        />
      );
    },
    [
      cleanOnPress,
      color,
      error,
      fieldName,
      handleInpuOnKeyPress,
      handleInputBlur,
      handleInputFocus,
      hideResults,
      inputIcon,
      loading,
      placeholder,
      selectedItem,
      term,
      useValidityMark,
    ],
  );

  return (
    <Autocomplete
      ref={inputRef as any}
      data={data}
      renderItem={({ item }) => (
        <Row onPress={() => onPress(item)}>
          {ListItemTextComponent ? <ListItemTextComponent item={item} /> : <Text>{item[listItemKey]}</Text>}
        </Row>
      )}
      onChangeText={onChangeText}
      keyExtractor={(item, index) => index.toString()}
      hideResults={hideResults}
      renderTextInput={renderInput}
      value={!!selectedItem && selectedItem[listItemKey]}
      containerStyle={{
        flexGrow: 1,
        flexBasis: 'auto',
        marginTop: 10,
      }}
      inputContainerStyle={{
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: 'auto',
        borderWidth: 0,
      }}
      flatListProps={{
        renderScrollComponent: (scrollProps) => <ScrollView {...scrollProps} />,
        showsVerticalScrollIndicator: false,
        contentContainerStyle: {
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: 'auto',
        },
        style: {
          position: 'relative',
          borderBottomLeftRadius: inputBorderRadius || currentValidationStyles?.borderRadius,
          borderBottomRightRadius: inputBorderRadius || currentValidationStyles?.borderRadius,
          paddingTop: 8,
          paddingBottom: 8,
          borderWidth: 1,
          maxHeight: 200,
          borderColor: currentValidationStyles?.borderColor,
        },
      }}
      {...rest}
    />
  );
};

export default Suggest;
