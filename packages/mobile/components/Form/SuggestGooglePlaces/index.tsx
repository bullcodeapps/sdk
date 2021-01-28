import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  FunctionComponent,
  Ref,
  useContext,
  useMemo,
} from 'react';

import {
  MapLocationIcon,
  MapLocationColoredIcon,
  MapLocationFilterIconContainer,
  CloseSearchIcon,
  SuggestGooglePlacesStyles,
  SuggestGooglePlacesStyle,
  DefaultColors,
  ListEmptyContainer,
  ListEmptyText,
} from './styles';
import {
  GooglePlacesAutocomplete,
  Language,
  GooglePlacesAutocompleteRef,
} from '@bullcode/react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
import Input from '../Input';
import { differenceInMinutes } from 'date-fns';
import { useModal } from '../../Modal';
import ConfirmModal from '../../ConfirmModal';
import {
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInput,
  TextInputProps,
  Platform,
  ViewStyle,
  ReturnKeyTypeOptions,
  ActivityIndicator,
} from 'react-native';
import { useField } from '@unform/core';
import { useCombinedRefs } from '../../../../core/hooks';
import { usePosition } from '../../../hooks';
import Config from 'react-native-config';
import { FormFieldType } from '..';
import * as Yup from 'yup';

export type SuggestGooglePlacesContextType = { colors: SuggestGooglePlacesStyles };

export const SuggestGooglePlacesContext = React.createContext<SuggestGooglePlacesContextType>({ colors: null });

export const setSuggestGooglePlacesColors = (colors: SuggestGooglePlacesStyles) => {
  const ctx = useContext<SuggestGooglePlacesContextType>(SuggestGooglePlacesContext);
  ctx.colors = colors;
};

export interface GooglePlace {
  placeId?: string;
  description: string;
  latitude?: number;
  longitude?: number;
  mainText?: string;
  mainTextMatchedSubstrings?: { length: number; offset: number }[];
  secondaryText?: string;
}

interface CustomProps {
  outerRef?: Ref<TextInput>;
  name?: string;
  color?: string;
  placeholder?: string;
  language?: string;
  value?: GooglePlace;
  currentLocationLabel?: string;
  confirmCurrentLocationModalTitle?: string;
  confirmCurrentLocationModalText?: string;
  canUseCurrentLocation?: boolean;
  inputStyles?: ViewStyle;
  validity?: boolean | 'keepDefault';
  emptyListText?: string;
  onChange?: (place: GooglePlace) => void;
}

type SuggestGooglePlacesProps = CustomProps;
const API_KEY = Config.GOOGLE_MAPS_API_KEY;

export type SuggestGooglePlacesComponent = FunctionComponent<SuggestGooglePlacesProps>;
type FieldType = FormFieldType<GooglePlacesAutocompleteRef> & { markAsDirty: () => void };

export const getSuggestGooglePlacesYupSchema = () => Yup.object<GooglePlace>();

const SEARCH_MIN_LENGTH = 2;

/*
 * IMPORTANT: When this component is a child from a virtualized list,
 * the virtualized list must have the prop: keyboardShouldPersistTaps="handled".
 * this guarantees that item selection works!
 */
const Component: SuggestGooglePlacesComponent = ({
  outerRef,
  name,
  color,
  language = 'en',
  placeholder = 'Enter location...',
  currentLocationLabel = 'Current location',
  confirmCurrentLocationModalTitle = 'Are you sure?',
  confirmCurrentLocationModalText = 'Are you sure do you want to use your current location?',
  canUseCurrentLocation = false,
  inputStyles,
  validity: propValidity,
  emptyListText,
  onChange,
  ...rest
}) => {
  const ctx = useContext<SuggestGooglePlacesContextType>(SuggestGooglePlacesContext);

  // Functional Hooks
  const modal = useModal();
  const { latitude, longitude } = usePosition();

  // States
  const [selected, setSelected] = useState<GooglePlace>();
  const [text, setText] = useState<string>();
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [currentLocationChangeDate, setCurrentLocationChangeDate] = useState<Date>();
  const { fieldName, registerField, error } = useField(name);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState(false);

  // Refs
  const autocompleteRef = useRef<FieldType>();
  const combinedRef = useCombinedRefs<FieldType>(autocompleteRef, outerRef);

  const usingValidity = useMemo(() => ![undefined, null].includes(propValidity), [propValidity]);

  useEffect(() => {
    registerField<GooglePlace>({
      name: fieldName,
      ref: combinedRef.current,
      clearValue: clear,
      setValue: (ref: TextInput, val: GooglePlace) => {
        if (val?.placeId && val?.placeId === selected?.placeId) {
          return;
        }
        setText(val?.description);
        setSelected(val);
      },
      getValue: () => selected,
    });
  }, [combinedRef, fieldName, registerField, selected]);

  useEffect(() => {
    combinedRef?.current?.validate && combinedRef.current.validate(selected);
  }, [combinedRef, selected]);

  useEffect(() => {
    combinedRef.current.markAsDirty = () => {
      if (isDirty) {
        return;
      }

      setIsDirty(true);
    };
  }, [isDirty]);

  const handlePressIcon = () => {
    if (!selected) {
      promptCurrentLocation();
      return;
    }
    clear();
    combinedRef?.current && combinedRef?.current?.clear();
  };

  const MapLocationFilterIcon = useCallback(
    () => (
      <MapLocationFilterIconContainer onPress={handlePressIcon}>
        {selected ? <CloseSearchIcon /> : canUseCurrentLocation ? <MapLocationColoredIcon /> : <MapLocationIcon />}
      </MapLocationFilterIconContainer>
    ),
    [canUseCurrentLocation, handlePressIcon, selected],
  );

  const promptCurrentLocation = () => {
    if (!canUseCurrentLocation) {
      return;
    }
    modal.show(
      <ConfirmModal
        danger
        title={confirmCurrentLocationModalTitle}
        description={confirmCurrentLocationModalText}
        onConfirm={() => loadCurrentLocation(true)}
      />,
      {
        exitOnBackdrop: true,
      },
    );
  };

  const handleSelect = useCallback((rowData, details?) => {
    if (rowData?.isPredefinedPlace) {
      const description = rowData.description;
      details = rowData.details;
      rowData = rowData.data;
      rowData.description = description;
    }
    const googlePlace: GooglePlace = {
      placeId: rowData.place_id,
      description: rowData.description,
      mainText: rowData.structured_formatting?.main_text,
      mainTextMatchedSubstrings: rowData.structured_formatting?.main_text_matched_substrings,
      secondaryText: rowData.structured_formatting?.secondary_text,
      latitude: details?.geometry?.location?.lat,
      longitude: details?.geometry?.location?.lng,
    };
    setSelected(googlePlace);

    combinedRef?.current?.validate && combinedRef.current.validate(selected);
  }, []);

  const loadCurrentLocation = useCallback(
    async (select: boolean = false) => {
      try {
        if (currentLocationChangeDate && differenceInMinutes(new Date(), currentLocationChangeDate) < 15) {
          if (select) {
            handleSelect(currentLocation);
          }
          return;
        }
        const { coords } = await new Promise((resolve, reject) =>
          Geolocation.getCurrentPosition(
            (position) => resolve(position),
            (e) => reject(e),
            {
              enableHighAccuracy: true,
              timeout: 1000 * 10,
              maximumAge: 1000 * 60 * 15,
            },
          ),
        );

        const response = await fetch(
          'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          coords.latitude +
          ',' +
          coords.longitude +
          '&key=' +
          API_KEY,
        );
        const json = await response.json();
        setCurrentLocation({
          data: json.results[0],
          details: json.results[0],
          description: currentLocationLabel,
          isPredefinedPlace: true,
        });
        setCurrentLocationChangeDate(new Date());

        if (select) {
          handleSelect(currentLocation);
        }
      } catch (e) {
        // console.log(e);
      }
    },
    [currentLocation, currentLocationChangeDate, currentLocationLabel, handleSelect],
  );

  const clear = () => {
    setText('');
    setSelected(null);
  };

  const selectedColor: SuggestGooglePlacesStyle = useMemo(() => {
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
    if (!isDirty && !selected) {
      return selectedColor?.default;
    }

    if (usingValidity) {
      if (propValidity === 'keepDefault') {
        return selectedColor?.default;
      }
      return getColorTypeByValidity(propValidity);
    }

    if (selected || (text && !isFocused)) {
      return getColorTypeByValidity(!!selected && !!text);
    }

    if (error) {
      return selectedColor?.invalid || selectedColor?.default;
    }

    return selectedColor?.default;
  }, [getColorTypeByValidity, isFocused, propValidity, selected, selectedColor?.default, text, usingValidity, isDirty, error, name]);

  useEffect(() => {
    if (!canUseCurrentLocation) {
      setCurrentLocation(null);
      return;
    }
    loadCurrentLocation();
  }, [canUseCurrentLocation]); // eslint-disable-line

  useEffect(() => {
    onChange && onChange(selected);
  }, [onChange, selected]);

  const handleAutocompleteOnKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !!selected) {
      clear();
    }
  };

  const handleOnChangeText = (_text: string) => {
    if (_text === text) {
      return;
    }
    setIsLoading(true);
    setText(_text);
  };

  const handleOnLoad = () => {
    console.log('handleOnLoad!');
    setIsLoading(false);
  };

  const handleOnFail = () => {
    setIsLoading(false);
  };

  const handleOnNotFound = () => {
    setIsLoading(false);
  };

  const handleOnTimeout = () => {
    setIsLoading(false);
  };

  const handleOnFocus = useCallback(() => {
    setIsFocused(true);

    if (!isDirty) {
      setIsDirty(true);
    }
  }, [isDirty]);

  const handleOnBlur = () => {
    setIsFocused(false);
  };

  const listViewDisplayed = useMemo(
    () =>
      (text?.length >= SEARCH_MIN_LENGTH && !selected && isFocused) ||
      ![undefined, null].includes(currentLocation),
    [currentLocation, isFocused, selected, text],
  );

  const ListEmptyComponent = useCallback(
    () => (
      <ListEmptyContainer>
        {isLoading ? (
          <ActivityIndicator size="small" color="#9ca7ad" />
        ) : (
            <ListEmptyText>{emptyListText || 'Nenhum endereço foi encontrado!'}</ListEmptyText>
          )}
      </ListEmptyContainer>
    ),
    [emptyListText, isLoading],
  );

  return (
    <GooglePlacesAutocomplete
      ref={combinedRef}
      listEmptyComponent={ListEmptyComponent}
      {...rest}
      keyboardShouldPersistTaps="handled"
      placeholder={placeholder}
      minLength={SEARCH_MIN_LENGTH}
      fetchDetails
      renderDescription={(row) => row.description}
      listViewDisplayed={listViewDisplayed}
      styles={{
        textInputContainer: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          borderBottomWidth: 0,
          alignItems: 'center',
          zIndex: 2,
        },
        predefinedPlacesDescription: {
          color: currentValidationStyles?.color,
        },
        listView: {
          width: '100%',
          alignSelf: 'center',
          borderWidth: 1,
          borderColor: selectedColor?.default?.borderColor,
          borderBottomLeftRadius: currentValidationStyles?.borderRadius || selectedColor?.default?.borderRadius,
          borderBottomRightRadius: currentValidationStyles?.borderRadius || selectedColor?.default?.borderRadius,
          borderTopWidth: 0,
          paddingTop: 55 / 2,
          borderTopColor: 'transparent',
          top: -55 / 2,
          backgroundColor: 'transparent',
          overflow: 'hidden',
          zIndex: 1,
        },
        separator: {
          backgroundColor: selectedColor?.default?.borderColor,
        },
        row: {
          height: 50,
          alignItems: 'center',
          backgroundColor: 'transparent',
        },
        description: {
          flex: 1,
          flexWrap: 'wrap',
        },
      }}
      currentLocation={false}
      currentLocationLabel={currentLocationLabel}
      predefinedPlaces={currentLocation ? [currentLocation] : []}
      predefinedPlacesAlwaysVisible
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: API_KEY,
        language: language as Language, // language of the results
        radius: 20000,
        location: `${latitude},${longitude}`,
      }}
      nearbyPlacesAPI="GooglePlacesSearch"
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        rankby: 'distance',
        location: `${latitude},${longitude}`,
      }}
      debounce={300}
      textInputProps={
        {
          InputComp: Input,
          name: `descriptionSuggestGooglePlaces${name ? `-${name}` : ''}`,
          color,
          clearButtonMode: 'never',
          clearTextOnFocus: false,
          autoCorrect: false,
          autoFocus: false,
          autoCapitalize: 'none',
          style: {
            height: 55,
            paddingLeft: 20,
            paddingBottom: 10,
            borderRadius: currentValidationStyles?.borderRadius || selectedColor?.default?.borderRadius,
            borderWidth: 1,
            fontSize: 16,
            fontWeight: '500',
            marginLeft: 0,
            marginRight: 0,
            backgroundColor: currentValidationStyles?.backgroundColor,
            color: currentValidationStyles?.color,
            borderColor: currentValidationStyles?.borderColor,
            paddingRight: 50,
            ...inputStyles,
          },
          selectionColor: currentValidationStyles?.selectionColor,
          value: selected?.description || text,
          placeholderTextColor: currentValidationStyles?.placeholder,
          returnKeyType: Platform?.select<ReturnKeyTypeOptions>({
            ios: 'search',
            android: 'none',
          }),
          onFocus: handleOnFocus,
          onBlur: handleOnBlur,
          onKeyPress: handleAutocompleteOnKeyPress,
          onChangeText: handleOnChangeText,
          onSubmitEditing: () => {
          },
        } as TextInputProps
      }
      onLoad={handleOnLoad}
      onFail={handleOnFail}
      onNotFound={handleOnNotFound}
      onTimeout={handleOnTimeout}
      onPress={handleSelect}
      listUnderlayColor="rgba(179, 193, 200, 0.2)"
      timeout={10000}
      renderRightButton={MapLocationFilterIcon}
      isRowScrollable={false}
      enablePoweredByContainer={false}
    />
  );
};

const SuggestGooglePlaces: SuggestGooglePlacesComponent = React.forwardRef(
  (props: SuggestGooglePlacesProps, ref: Ref<TextInput>) => <Component outerRef={ref} {...props} />,
);

export default SuggestGooglePlaces;
