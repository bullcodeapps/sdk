import React, { useEffect, useRef, useState } from 'react';
import { useField } from '@unform/core';
import {
  TextField, CircularProgress, FormHelperText, Chip,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextFieldProps } from '@material-ui/core/TextField';
import { CustomLabel, FormControl, InputContainer } from "./styles";
import { useDebouncedState } from '../../../core/hooks';

interface Props {
  name: string;
  label?: string;
  optionLabel: string;
  multiple?: boolean;
  optionalText?: string;
  required?: boolean;
  loadOptions: (params?: any) => Promise<any[]>;
  onChange?: (value?: any) => any;
}

type InputProps = Omit<TextFieldProps, 'onChange'> & Props;

export default function Suggest({
  name,
  label,
  optionLabel,
  multiple = false,
  helperText,
  size = 'small',
  margin = 'dense',
  fullWidth = true,
  value: originalValue,
  required = false,
  optionalText = 'opcional',
  loadOptions,
  onChange,
  placeholder,
  ...other
}: InputProps) {
  const [selected, setSelected] = useState<any[] | any>(multiple ? [] : null);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[] | null>(null);
  const loading = open && options !== null && options.length === 0;
  const [searchTerm, setSearchTerm] = useState<string>();
  const debouncedSearchTerm = useDebouncedState(searchTerm, 500);
  const [defaultOptions, setDefaultOptions] = useState<any>(null);

  const inputRef = useRef<any>(null);
  const {
    fieldName, registerField, defaultValue, error,
  } = useField(name);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setOptions([]);
      setOpen(true);
    }
  }, [debouncedSearchTerm]); // eslint-disable-line

  useEffect(() => {
    if (defaultValue && (defaultValue.id || (multiple && defaultValue.length > 0))) {
      setSelected(defaultValue);
    }
  }, [defaultValue, multiple]);

  useEffect(() => {
    setSelected(originalValue);
  }, [originalValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      getValue: () => selected,
      clearValue: (ref: any) => setSelected(multiple ? [] : null),
      setValue: (ref: any, value: any) => {
        if (value && (value.id || (multiple && value.length > 0))) {
          setSelected(value);
        }
      },
    });
  }, [inputRef.current, fieldName, selected]); // eslint-disable-line

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const opts = await loadOptions({ text: debouncedSearchTerm });

      if (active) {
        setOptions(opts && opts.length > 0 ? opts : null);
      }
    })();

    return () => {
      active = false;
    };
  }, [debouncedSearchTerm, loadOptions, loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    if (multiple) {
      setDefaultOptions({
        multiple: true,
        renderTags: (value: any, getTagProps: any) => value.map((option: any, index: number) => (
          <Chip label={option[optionLabel]} {...getTagProps({ index })} />
        )),
      });
    }
  }, [multiple, optionLabel]);

  function handleAutocompleteChange(e: any, value: any) {
    setSelected(value);

    if (onChange) {
      onChange(value);
    }
  }

  return (
    <FormControl error={!!error}>
      <InputContainer>
        {label && <label htmlFor={fieldName}>{label}</label>}
        {!required && <CustomLabel>({optionalText})</CustomLabel>}
      </InputContainer>

      <Autocomplete
        {...other}
        {...defaultOptions}
        ref={inputRef}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionSelected={(option: any, value) => option?.id === value?.id}
        getOptionLabel={(option: any) => option[optionLabel]}
        onChange={handleAutocompleteChange}
        onInputChange={(event: any, value: string, reason: string) => {
          if (reason === 'input') {
            setSearchTerm(value);
          } else {
            setSearchTerm(undefined);
          }
        }}
        value={selected}
        options={options || []}
        loading={loading}
        defaultValue={defaultValue}
        loadingText="Carregando..."
        noOptionsText="Nenhum registro encontrado."
        size="small"
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            margin="dense"
            error={!!error}
            placeholder={placeholder}
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
      />

      {(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
    </FormControl>
  );
}
