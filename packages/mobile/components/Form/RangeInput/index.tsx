import React, { useEffect, useState, useRef } from 'react';

import { Container, CustomSlider, PointLabelBox, PointLabel, TouchablePointArea, PointCircle } from './styles';
import { ViewStyle } from 'react-native';
import { useField } from '@unform/core';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useDebouncedState } from '../../../../core/hooks';
import { FormFieldType } from '..';

export type RangeInputResponse = {
  min: number;
  max: number;
};

export type RangeInputProps = {
  name?: string;
  style?: ViewStyle;
  initialPoint: number;
  endPoint: number;
  minValue: number;
  maxValue: number;
  onValuesChange?: (values: RangeInputResponse) => void;
  optionsArray?: number[];
};

type FieldType = FormFieldType<MultiSlider>;

const RangeInput = ({
  name,
  style,
  initialPoint,
  endPoint,
  minValue,
  maxValue,
  optionsArray,
  onValuesChange,
}: RangeInputProps) => {
  // States
  const [values, setValues] = useState<RangeInputResponse>({ min: initialPoint, max: endPoint });
  const { fieldName, registerField } = useField(name);

  // Debounce
  const debouncedValues = useDebouncedState(values);

  // Refs
  const sliderRef = useRef<FieldType>(null);

  useEffect(() => {
    setValues({
      min: initialPoint,
      max: endPoint,
    });
  }, [endPoint, initialPoint]);

  useEffect(() => {
    registerField<RangeInputResponse>({
      name: fieldName,
      ref: sliderRef.current,
      clearValue: () => {
        setValues({
          min: minValue,
          max: maxValue,
        });
      },
      setValue: (ref: MultiSlider, val: RangeInputResponse) => {
        if (!val) {
          return;
        }
        setValues(val);
      },
      getValue: () => {
        return values;
      },
    });
  }, [fieldName, maxValue, minValue, registerField, values]);

  const handleValuesChange = (res: number[]) => {
    setValues({ min: res[0], max: res[1] });
  };

  useEffect(() => {
    onValuesChange && onValuesChange(values);
  }, [onValuesChange, values]);

  useEffect(() => {
    sliderRef?.current?.validate && sliderRef.current.validate(debouncedValues);
  }, [debouncedValues]);

  const CustomMarker = () => (
    <TouchablePointArea activeOpacity={0.8}>
      <PointCircle />
    </TouchablePointArea>
  );

  return (
    <Container style={style}>
      <CustomSlider
        ref={sliderRef}
        customLabel={({ oneMarkerValue, oneMarkerLeftPosition, twoMarkerValue, twoMarkerLeftPosition }) => (
          <>
            <PointLabelBox style={{ left: oneMarkerLeftPosition }}>
              <PointLabel>{oneMarkerValue}</PointLabel>
            </PointLabelBox>
            <PointLabelBox style={{ left: twoMarkerLeftPosition }}>
              <PointLabel>{twoMarkerValue}</PointLabel>
            </PointLabelBox>
          </>
        )}
        onValuesChange={handleValuesChange}
        customMarker={CustomMarker}
        values={[values?.min, values?.max]}
        min={minValue}
        max={maxValue}
        optionsArray={optionsArray}
      />
    </Container>
  );
};

export default RangeInput;
