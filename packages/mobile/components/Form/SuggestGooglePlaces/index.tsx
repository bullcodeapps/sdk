import React, { useState, useRef, useEffect, useCallback, FunctionComponent, Ref } from 'react';

import {
  Container,
  MapLocationIcon,
  MapLocationColoredIcon,
  MapLocationFilterIconContainer,
  CloseSearchIcon,
} from './styles';
import { GooglePlacesAutocomplete, Language } from 'react-native-google-places-autocomplete';
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
} from 'react-native';
import { useField } from '@unform/core';
import { useCombinedRefs } from '../../../../core/hooks';
import { usePosition } from '../../../hooks';
import Config from 'react-native-config';
import { FormFieldType } from '..';
import * as Yup from 'yup';

export interface GooglePlace {
  placeId?: string;
  description: string;
  latitude?: number;
  longitude?: number;
  mainText?: string;
  mainTextMatchedSubstrings?: { length: number; offset: number }[];
  secondaryText?: string;
}


interface SuggestGooglePlacesProps {
  outerRef?: Ref<TextInput>;
  name?: string;
  color?: 'primary' | 'secondary';
  placeholder?: string;
  language?: string;
  value?: GooglePlace;
  onChange?: (place: GooglePlace) => void;
  currentLocationLabel?: string;
  confirmCurrentLocationModalTitle?: string;
  confirmCurrentLocationModalText?: string;
  canUseCurrentLocation?: boolean;
  inputStyles?: ViewStyle;
}

type Props = SuggestGooglePlacesProps;
const API_KEY = Config.GOOGLE_MAPS_API_KEY;

export type SuggestGooglePlacesComponent = FunctionComponent<Props>;
type FieldType = FormFieldType<TextInput>;

export const getSuggestGooglePlacesYupSchema = () => Yup.object<GooglePlace>();

const SEARCH_MIN_LENGTH = 2;

const Component: SuggestGooglePlacesComponent = ({
  outerRef,
  name,
  color = 'primary',
  language = 'en',
  placeholder = 'Enter location...',
  onChange,
  currentLocationLabel = 'Current location',
  confirmCurrentLocationModalTitle = 'Are you sure?',
  confirmCurrentLocationModalText = 'Are you sure do you want to use your current location?',
  canUseCurrentLocation = false,
  inputStyles,
  ...rest
}: Props) => {
  // Functional Hooks
  const modal = useModal();
  const { latitude, longitude } = usePosition();

  // States
  const [selected, setSelected] = useState<GooglePlace>();
  const [text, setText] = useState<string>();
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [currentLocationChangeDate, setCurrentLocationChangeDate] = useState<Date>();
  const [validityColor, setValidityColor] = useState<string>('#ffffff');
  const { fieldName, registerField } = useField(name);

  // Refs
  const autocompleteRef = useRef<GooglePlacesAutocomplete>();
  const inputRef = useRef<FieldType>();
  const combinedRef = useCombinedRefs<FieldType>(outerRef, inputRef);

  useEffect(() => {
    registerField<GooglePlace>({
      name: fieldName,
      ref: combinedRef.current,
      clearValue: clear,
      setValue: (ref: TextInput, val: GooglePlace) => {
        setText(val?.description || null);
        setSelected(val);
      },
      getValue: () => {
        return selected;
      },
    });
  }, [combinedRef, fieldName, registerField, selected]);

  useEffect(() => {
    combinedRef?.current?.validate && combinedRef.current.validate(selected);
  }, [combinedRef, selected]);

  const handlePressIcon = () => {
    if (!selected) {
      promptCurrentLocation();
      return;
    }
    clear();
    inputRef?.current?.clear();
    (autocompleteRef?.current as any)?.clearText();
  };

  const MapLocationFilterIcon = () => {
    return (
      <MapLocationFilterIconContainer onPress={handlePressIcon}>
        {selected ? <CloseSearchIcon /> : canUseCurrentLocation ? <MapLocationColoredIcon /> : <MapLocationIcon />}
      </MapLocationFilterIconContainer>
    );
  };

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
    [currentLocation, currentLocationChangeDate, currentLocationLabel],
  );

  const clear = () => {
    setText('');
    setSelected(null);
  };

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

  const handleSelect = (rowData, details?) => {
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
  };

  const handleAutocompleteOnKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && selected) {
      clear();
    }
  };

  useEffect(() => {
    if (color === 'primary') {
      setValidityColor(selected?.placeId ? '#3a9def' : '#bbc8cf');
      return;
    }
    setValidityColor(selected?.placeId ? '#00f2d5' : '#ffffff');
  }, [color, selected?.placeId]);

  return (
    <Container>
      <GooglePlacesAutocomplete
        ref={autocompleteRef}
        {...rest}
        placeholder={placeholder}
        placeholderTextColor="#b3c1c8"
        minLength={SEARCH_MIN_LENGTH}
        autoFocus={false}
        returnKeyType={Platform.OS === 'android' ? 'none' : 'search'}
        fetchDetails
        renderDescription={(row) => row.description}
        listViewDisplayed={(text && text.length >= SEARCH_MIN_LENGTH && !selected) || currentLocation}
        styles={{
          textInputContainer: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            borderBottomWidth: 0,
            alignItems: 'center',
          },
          predefinedPlacesDescription: {
            color: '#3a9def',
          },
          listView: {
            width: '99.50%',
            alignSelf: 'center',
            marginTop: 16,
            borderWidth: 1,
            borderColor: '#bbc8cf',
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
            borderTopWidth: 0,
            paddingTop: 25,
            borderTopColor: 'transparent',
            top: -25,
          },
          separator: {
            backgroundColor: '#bbc8cf',
          },
          row: {
            padding: 15,
            height: 50,
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 1,
            elevation: 1,
          },
          description: {
            overflow: 'hidden',
            flexWrap: 'wrap',
            marginRight: 30,
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
            ref: combinedRef,
            InputComp: Input,
            returnKeyType: Platform.OS === 'android' ? 'none' : 'search',
            name: `descriptionSuggestGooglePlaces${name ? `-${name}` : ''}`,
            color,
            clearButtonMode: 'never',
            clearTextOnFocus: false,
            autoCorrect: false,
            style: {
              height: 55,
              paddingLeft: 20,
              paddingBottom: 10,
              borderRadius: 25,
              borderWidth: 1,
              fontSize: 16,
              fontWeight: '500',
              marginLeft: 0,
              marginRight: 0,
              // zIndex: 1,
              // elevation: 1,
              backgroundColor: '#fff',
              color: color === 'primary' ? '#2d2d30' : '#fff',
              borderColor: validityColor,
              paddingRight: 50,
              ...inputStyles,
            },
            value: selected?.description,
            onKeyPress: handleAutocompleteOnKeyPress,
            onChangeText: setText,
            onSubmitEditing: () => {},
          } as TextInputProps
        }
        autoCorrect={false}
        autoCapitalize="none"
        onPress={handleSelect}
        enablePoweredByContainer={false}
        value={selected?.description}
      />
      <MapLocationFilterIcon />
    </Container>
  );
};

const SuggestGooglePlaces: SuggestGooglePlacesComponent = React.forwardRef(
  (props: SuggestGooglePlacesProps, ref: Ref<TextInput>) => <Component outerRef={ref} {...props} />,
);

export default SuggestGooglePlaces;
