import React, {
  useEffect, useRef, useState, useCallback,
} from 'react';
import { useField } from '@unform/core';
import {
  TextField, FormHelperText, Grid, Typography, CircularProgress,
} from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextFieldProps } from '@material-ui/core/TextField';
import throttle from 'lodash/throttle';
import parse from 'autosuggest-highlight/parse';
import { CustomLabel, FormControl, LabelContainer } from "./styles";
import { useDebouncedState } from '../../../core/hooks';

const autocompleteService = { current: null };

interface CustomProps {
  name: string;
  label?: string;
  loadingText?: string;
  noOptionsText?: string;
  optionalText?: string;
  required?: boolean;
}

export interface GooglePlace {
  placeId:string
  description: string;
  latitude?: number;
  longitude?: number
  mainText?: string;
  mainTextMatchedSubstrings?: {length: number, offset: number}[];
  secondaryText?: string;
}

type InputProps = TextFieldProps & CustomProps;

export default function SuggestGooglePlace({
  name,
  label,
  helperText,
  size = 'small',
  margin = 'dense',
  loadingText,
  noOptionsText,
  fullWidth = true,
  required = false,
  optionalText = 'opcional',
  ...other
}: InputProps) {
  const [selected, setSelected] = useState<GooglePlace | null>(null);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<GooglePlace[]>([]);
  const loading = open && options !== null && options.length === 0;
  const [searchTerm, setSearchTerm] = useState<string>();

  const debouncedSearchTerm = useDebouncedState(searchTerm, 500);

  const inputRef = useRef<any>(null);

  const {
    fieldName, registerField, defaultValue, error,
  } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      getValue: () => selected,
      clearValue: (ref: any) => setSelected(null),
      setValue: (ref: any, value: GooglePlace) => setSelected(value),
    });
  }, [inputRef.current, fieldName, selected]); // eslint-disable-line

  const getPlaceDetails = useCallback((placeId: string): Promise<GooglePlace> => {
    const map = new (window as any).google.maps.Map(document.getElementById('google-maps'));
    const placeService = new (window as any).google.maps.places.PlacesService(map);

    return new Promise((resolve, reject) => {
      placeService.getDetails({ placeId }, ((place: any, status: any) => {
        if (status !== (window as any).google.maps.places.PlacesServiceStatus.OK) {
          return reject(new Error('Not found'));
        }

        return resolve({
          description: place.formatted_address,
          placeId: place.place_id,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        });
      }));
    });
  }, []);

  const fetch = React.useMemo(
    () => throttle((request: { input: string }, callback: (results?: any[]) => void) => {
      (autocompleteService.current as any).getPlacePredictions(request, callback);
    }, 200),
    [],
  );

  useEffect(() => {
    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
    }
  }, []);

  useEffect(() => {
    async function loadPlace() {
      if (defaultValue && defaultValue.placeId) {
        const place = await getPlaceDetails(defaultValue.placeId);
        setOptions([place]);
      }
    }
    loadPlace();
  }, [defaultValue, getPlaceDetails]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setOptions([]);
      setOpen(true);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    if (!autocompleteService.current) {
      return undefined;
    }

    if (debouncedSearchTerm === '') {
      setOptions([]);
      return undefined;
    }

    fetch({ input: debouncedSearchTerm }, (results?: any[]) => {
      if (active) {
        const predictions = results?.map((place): GooglePlace => ({
          placeId: place.place_id,
          description: place.description,
          mainText: place.structured_formatting?.main_text,
          mainTextMatchedSubstrings: place.structured_formatting?.main_text_matched_substrings,
          secondaryText: place.structured_formatting.secondary_text,
        }));
        setOptions(predictions || []);
      }
    });

    return () => {
      active = false;
    };
  }, [debouncedSearchTerm, fetch, loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  async function handleChange(value: any) {
    const place = await getPlaceDetails(value?.placeId);
    setSelected(place);
  }

  return (
    <FormControl error={!!error}>
      <LabelContainer>
        {label && <label htmlFor={fieldName}>{label}</label>}
        {!required && <CustomLabel>({optionalText})</CustomLabel>}
      </LabelContainer>

      <Autocomplete
        getOptionLabel={(option: GooglePlace) => option.description}
        getOptionSelected={(option: GooglePlace, value: GooglePlace) => option.placeId === value.placeId}
        filterOptions={(x) => x}
        options={options || []}
        loading={loading}
        value={selected}
        loadingText={loadingText || 'Carregando...'}
        noOptionsText={noOptionsText || 'Nenhum registro encontrado.'}
        autoComplete
        includeInputInList
        onChange={(e: any, value: any) => handleChange(value)}
        onInputChange={(event: any, value: string, reason: string) => {
          if (reason === 'input') {
            setSearchTerm(value);
          } else {
            setSearchTerm(undefined);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            margin="dense"
            error={!!error}
            required={required}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(option: GooglePlace) => {
          const matches = option.mainTextMatchedSubstrings;
          const parts = parse(
            option.mainText || '',
            matches ? matches.map((match: any) => [match.offset, match.offset + match.length]) : [],
          );

          return (
            <Grid container alignItems="center">
              <Grid item>
                <LocationOnIcon />
              </Grid>
              <Grid item xs>
                {option.mainTextMatchedSubstrings && parts.map((part: any, index: any) => (
                  <span key={part.text} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                    {part.text}
                  </span>
                ))}
                {!option.mainTextMatchedSubstrings && <span>{option.description}</span>}
                <Typography variant="body2" color="textSecondary">
                  {option.secondaryText}
                </Typography>
              </Grid>
            </Grid>
          );
        }}
      />

      {(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
    </FormControl>
  );
}
