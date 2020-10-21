import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, TextInput, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { useField } from '@unform/core';
import { useDebouncedState } from '../../../../core/hooks';
import i18n from '../../../../../languages';

import { FormFieldType } from '../../../components/Form';

import { Autocomplete, Button, Text, InputContainer, Input } from './styles';

type Props = {
  name: string;
  data: Array<Object>;
  onChange: (text?: string) => void;
  onFocus?: (text?: string) => void;
  loading: boolean;
  listItemKey: string;
  onSelectItem?: (item: Object) => void;
  placeholder?: string;
  listItemTextComponent?: React.FunctionComponent<{ item: any }>;
  textInputHeight?: number;
  cleanOnPress?: boolean;
  validate?: boolean;
  inputIcon?: any;
  inputBorderRadius?: number;
};

const Suggest: React.FC<Props> = ({
  name,
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
  inputIcon,
  inputBorderRadius = 25,
  ...rest
}) => {
  const [selectedItem, setSelectedItem] = useState({});
  const [showBottomBorders, setShowBottomBorders] = useState(true);
  const [hideResults, setHideResults] = useState(false);
  const [term, setTerm] = useState('');
  const debouncedTerm = useDebouncedState(term);
  const [isFocused, setIsFocused] = useState(false);
  const [selection, setSelection] = useState<any>();

  const inputRef = useRef<FormFieldType<TextInput>>(null);

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
      setShowBottomBorders(data?.length === 0);
      setHideResults(data?.length <= 0);
    } else {
      setShowBottomBorders(true);
    }
  }, [data]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      return;
    }
    const length =
      selectedItem && !isNaN(Object.keys(selectedItem)?.length) ? Object.keys(selectedItem)?.length : 0;
    setSelection(isFocused ? { start: length, end: length } : { start: 0, end: 0 });
    const timeout = setTimeout(() => setSelection(null), 0);
    return () => {
      clearTimeout(timeout);
    };
  }, [isFocused]); // eslint-disable-line

  const onChangeText = (text: string) => {
    setTerm(text);
    setHideResults(false);
    if (selectedItem && Object.keys(selectedItem)?.length > 0) {
      setSelectedItem(undefined);
    }
  };

  const onPress = (item) => {
    if (!cleanOnPress) {
      setSelectedItem(item);
    }
    setShowBottomBorders(true);
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

  const getColorByValidity = useCallback((validity?: boolean) => {
    if (validity) {
      return '#3a9def';
    }
    return '#ffc962';
  }, []);

  const formattedColor = useMemo(() => {
    if (isFocused) {
      return '#3a9def';
    }

    if (selectedItem && Object.keys(selectedItem)?.length > 0) {
      return getColorByValidity(!error);
    }

    if (!!error && !!selectedItem) {
      return '#ffc962';
    }

    return '#bbc8cf';
  }, [error, getColorByValidity, isFocused, selectedItem]);

  const renderInput = useCallback(
    (props) => {
      /* It was done in this way because the inputRef functions was throwing errors and the ref needs to be
      passed to the AutoComplete component and not to the Input directly. So, if the prop cleanOnPress is true
      the Input value is going to be the term state, otherwise is going to be the props.value. Doing is this way, we can
      guarantee that when an option is selected, the input value is going to be clean */

      const value = cleanOnPress ? term : props.value;
      delete props.value;

      return (
        <InputContainer flexRow={!!inputIcon || loading}>
          <Input
            ref={props.ref}
            selection={selection}
            placeholder={placeholder}
            placeholderTextColor="#b3c1c8"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            value={value}
            autoCorrect={false}
            {...props}
          />
          {loading ? <ActivityIndicator /> : inputIcon}
        </InputContainer>
      );
    },
    [cleanOnPress, handleInputBlur, handleInputFocus, inputIcon, loading, placeholder, selection, term],
  );

  return (
    <Autocomplete
      ref={inputRef as any}
      data={data}
      renderItem={({ item }) => (
        <Button onPress={() => onPress(item)}>
          {ListItemTextComponent ? <ListItemTextComponent item={item} /> : <Text>{item[listItemKey]}</Text>}
        </Button>
      )}
      keyExtractor={(item, index) => index.toString()}
      hideResults={hideResults}
      showBottomBorders={showBottomBorders}
      textInputHeight={textInputHeight}
      renderTextInput={renderInput}
      borderColor={formattedColor}
      borderRadius={inputBorderRadius}
      value={selectedItem && selectedItem[listItemKey]}
      onChangeText={onChangeText}
      listContainerStyle={data?.length > 0 && { height: data?.length * 28 }}
      flatListProps={{
        renderScrollComponent: (scrollProps) => <ScrollView {...scrollProps} />,
        showsVerticalScrollIndicator: false,
      }}
      {...rest}
    />
  );
};

export default Suggest;
