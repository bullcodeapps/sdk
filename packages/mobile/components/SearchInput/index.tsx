import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  FunctionComponent,
  Ref,
  ReactNode,
  memo,
  useMemo,
} from 'react';

import { Container, InputField, SearchIconTouchable, SearchIconsBox, SearchIcon, CloseSearchIcon } from './styles';
import {
  ViewProps,
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
  ViewStyle,
  TextInputProps,
  TextInput,
} from 'react-native';
import { useCombinedRefs, useDebouncedState } from '../../../core/hooks';

export interface SearchInputProps extends Readonly<{ children?: ReactNode }>, TextInputProps {
  ref?: Ref<TextInput>;
  outerRef?: Ref<TextInput>;
  loadOptionsOnInit?: boolean;
  useRedux?: boolean;
  reduxData?: { [key: string]: any; loading: boolean };
  onLoadResult?: (res: any) => void;
  loadOptions?: (text: string) => Promise<any> | void | object;
  debouncingTime?: number; // in ms, default: 500ms
  containerStyle?: ViewStyle;
  containerProps?: ViewProps;
  style?: any;
}

export type SearchInputComponent = FunctionComponent<SearchInputProps>;

const Component: SearchInputComponent = ({
  outerRef,
  loadOptionsOnInit,
  useRedux,
  reduxData,
  onLoadResult,
  loadOptions,
  debouncingTime = 500,
  containerStyle,
  containerProps,
  defaultValue = '',
  ...rest
}: SearchInputProps) => {
  const inputFieldRef = useRef<Ref<TextInput>>();
  const combinedRef = useCombinedRefs<TextInput>(outerRef, inputFieldRef);
  // const [loadOnInit] = useState(loadOptionsOnInit);
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const debouncedSearchTerm = useDebouncedState(searchTerm, debouncingTime);
  const [result, setResult] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState<boolean>();

  useEffect(() => {
    if (onLoadResult) {
      onLoadResult(result);
    }
  }, [onLoadResult, result]);

  useEffect(() => {
    setLoading(true);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (!loadOptions) {
      setLoading(false);
      return;
    }
    let active = true;

    if (!loading) {
      return;
    }

    (async () => {
      try {
        if (useRedux) {
          loadOptions(debouncedSearchTerm);
        } else {
          const opts = await loadOptions(debouncedSearchTerm);

          if (active) {
            setResult(opts);
          }
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [loadOptions, loading, debouncedSearchTerm, useRedux]);

  useEffect(() => {
    if (useRedux && !reduxData?.loading) {
      setResult(reduxData);
      setLoading(false);
    }
  }, [reduxData, useRedux]);

  const handleOnPressMagnifier = () => {
    if (!combinedRef.current) {
      return;
    }
    if (combinedRef.current.isFocused() || searchTerm?.length > 0) {
      handleOnChangeText('');
      // timeout pra aguardar a atualização de estado antes de realizar o blur
      return setTimeout(() => combinedRef.current.blur(), 100);
    }
    return combinedRef.current.focus();
  };

  const handleOnEndEditing = (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    setSearchTerm(e.nativeEvent.text);
  };

  const handleOnChangeText = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (rest && rest.onChangeText) {
        rest.onChangeText(term);
      }
    },
    [rest],
  );

  useEffect(() => {
    if (!loadOptionsOnInit) {
      return;
    }
    setLoading(true);
  }, [defaultValue, loadOptionsOnInit]);

  const showsSearchIcon = useMemo(() => searchTerm?.length <= 0 && !isFocused, [isFocused, searchTerm]);

  return (
    <Container style={containerStyle} {...containerProps}>
      <InputField
        ref={combinedRef}
        {...rest}
        value={searchTerm}
        autoCapitalize={rest && rest.autoCapitalize ? rest.autoCapitalize : 'none'}
        autoCompleteType={rest && rest.autoCompleteType ? rest.autoCompleteType : 'off'}
        autoCorrect={rest && rest.autoCorrect ? rest.autoCorrect : false}
        onEndEditing={handleOnEndEditing}
        onChangeText={handleOnChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <SearchIconTouchable onPress={handleOnPressMagnifier}>
        <SearchIconsBox>{showsSearchIcon ? <SearchIcon /> : <CloseSearchIcon />}</SearchIconsBox>
      </SearchIconTouchable>
    </Container>
  );
};

const SearchInput: SearchInputComponent = React.forwardRef((props: SearchInputProps, ref: Ref<TextInput>) => (
  <Component outerRef={ref} {...props} />
));

export default memo(SearchInput);
