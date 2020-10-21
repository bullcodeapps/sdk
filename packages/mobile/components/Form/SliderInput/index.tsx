import React, { useEffect, useState, useRef } from 'react';

import { Container, CustomSlider, PointLabelBox, PointLabel, TouchablePointArea, PointCircle } from './styles';
import { ViewStyle } from 'react-native';
import { useField } from '@unform/core';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useDebouncedState } from '../../../../core/hooks';
import { FormFieldType } from '..';

export type RangeInputProps = {
  name?: string;
  style?: ViewStyle;
  initialPoint: number;
  minValue: number;
  maxValue: number;
  onValuesChange?: (value: number) => void;
  optionsArray?: number[];
};

type FieldType = FormFieldType<MultiSlider>;

const SliderInput = ({
  name,
  style,
  initialPoint,
  optionsArray,
  onValuesChange,
  minValue,
  maxValue,
}: RangeInputProps) => {
  // States
  const [value, setValue] = useState(initialPoint);
  const { fieldName, registerField } = useField(name);

  // Debounce
  const debouncedValue = useDebouncedState(value);

  // Refs
  const sliderRef = useRef<FieldType>(null);

  useEffect(() => setValue(initialPoint), [initialPoint]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: sliderRef.current,
      clearValue: () => {
        setValue(0);
      },
      setValue: (ref: MultiSlider, val: number) => {
        console.log(val);
        if (!val) {
          return;
        }
        setValue(val);
      },
      getValue: () => {
        return value;
      },
    });
  }, [fieldName, registerField, value]);

  const handleValuesChange = (res: number[]) => {
    setValue(res[0]);
  };

  useEffect(() => {
    onValuesChange && onValuesChange(value);
  }, [onValuesChange, value]);

  useEffect(() => {
    sliderRef?.current?.validate && sliderRef.current.validate(debouncedValue);
  }, [debouncedValue]);

  const CustomMarker = () => (
    <TouchablePointArea activeOpacity={0.8}>
      <PointCircle />
    </TouchablePointArea>
  );

  return (
    <Container style={style}>
      <CustomSlider
        ref={sliderRef}
        customLabel={({ oneMarkerValue, oneMarkerLeftPosition }) => (
          <PointLabelBox style={{ left: oneMarkerLeftPosition }}>
            <PointLabel>{oneMarkerValue}</PointLabel>
          </PointLabelBox>
        )}
        values={[value]}
        onValuesChange={handleValuesChange}
        customMarker={CustomMarker}
        min={minValue}
        max={maxValue}
        optionsArray={optionsArray}
      />
    </Container>
  );
};

export default SliderInput;
