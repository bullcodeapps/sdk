import React, { useRef, useEffect, useState } from 'react';
import { Slider as MUISlider } from '@material-ui/core';

import { useField } from '@unform/core';
import { FormControl } from './styles';

interface Props {
  name: string;
  label?: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export default function Slider({
  name,
  label,
  min,
  max,
  step,
  unit,
  ...other
}: Props) {
  const sliderRef = useRef<HTMLInputElement>(null);
  const {
    fieldName, registerField, defaultValue, error,
  } = useField(name);
  const [selected, setSelected] = useState<number[]>([min, max]);

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue as number[]);
    }
  }, [defaultValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: sliderRef,
      path: 'value',
      getValue: (ref: any) => selected,
      clearValue: () => setSelected(defaultValue || null),
      setValue: (ref: any, value: number[]) => setSelected(value),
    });
  }, [sliderRef, fieldName, defaultValue, selected]); // eslint-disable-line

  const handleChange = (event: any, newValue: number | number[]) => {
    setSelected(newValue as number[]);
  };


  return (
    <FormControl error={!!error}>
      {label && <label htmlFor={fieldName}>{label}</label>}

      <MUISlider
        name={fieldName}
        value={selected}
        ref={sliderRef}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto"
        valueLabelFormat={(value: number) => `${value}\n${unit}`}
        {...other}
      />
    </FormControl>
  );
}
