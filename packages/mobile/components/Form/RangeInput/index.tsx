import React, { useEffect, useState, useRef, useContext, useMemo, useCallback } from 'react';

import {
  Container,
  CustomSlider,
  PointLabelBox,
  PointLabel,
  TouchablePointArea,
  PointCircle,
  RangeInputStyles,
  DefaultColors,
} from './styles';
import { ViewStyle, LayoutChangeEvent } from 'react-native';
import { useField } from '@unform/core';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useDebouncedState } from '../../../../core/hooks';
import { FormFieldType } from '..';

export type RangeInputContextType = { colors: RangeInputStyles };

export const RangeInputContext = React.createContext<RangeInputContextType>({ colors: null });

export const setRangeInputColors = (colors: RangeInputStyles) => {
  const ctx = useContext<RangeInputContextType>(RangeInputContext);
  ctx.colors = colors;
};

export type RangeInputResponse = {
  min: number;
  max: number;
};

export type RangeInputProps = {
  name?: string;
  color?: string;
  labelPosition?: 'top' | 'bottom';
  style?: ViewStyle;
  initialPoint: number;
  endPoint: number;
  minValue: number;
  maxValue: number;
  optionsArray?: number[];
  labelFormatter?: (value: number) => void;
  onValuesChange?: (values: RangeInputResponse) => void;
};

type FieldType = FormFieldType<MultiSlider>;

type RangeInputComponent = React.FC<RangeInputProps>;

const RangeInput: RangeInputComponent = ({
  name,
  color,
  labelPosition,
  style,
  initialPoint,
  endPoint,
  minValue,
  maxValue,
  optionsArray,
  labelFormatter,
  onValuesChange,
}) => {
  const ctx = useContext<RangeInputContextType>(RangeInputContext);

  // States
  const [values, setValues] = useState<RangeInputResponse>({ min: initialPoint, max: endPoint });
  const { fieldName, registerField } = useField(name);
  const [sliderWidth, setSliderWidth] = useState<number>();

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

  const selectedColor = useMemo(() => {
    const colors = ctx?.colors;
    if (!color && !!colors?.length) {
      const foundColor = colors?.find((_color) => _color.name === 'default');
      if (foundColor) {
        return foundColor;
      }
      return DefaultColors[0];
    }
    const foundColor = colors?.find((_color) => _color.name === color);
    if (!foundColor) {
      console.log(
        `The "${color}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultColors[0];
    }
    return foundColor;
  }, [color, ctx?.colors]);

  const CustomMarker = useCallback(
    () => (
      <TouchablePointArea activeOpacity={0.8}>
        <PointCircle style={selectedColor?.markerStyle} />
      </TouchablePointArea>
    ),
    [selectedColor?.markerStyle],
  );

  const CustomLabel = useCallback(
    ({ oneMarkerValue, oneMarkerLeftPosition, twoMarkerValue, twoMarkerLeftPosition }) => {
      const firstLabel = labelFormatter ? labelFormatter(oneMarkerValue) : oneMarkerValue;
      const secondLabel = labelFormatter ? labelFormatter(twoMarkerValue) : twoMarkerValue;
      return (
        <>
          <PointLabelBox
            style={{ left: oneMarkerLeftPosition, ...(labelPosition === 'bottom' ? { bottom: 5 } : { top: 10 }) }}>
            <PointLabel>{firstLabel}</PointLabel>
          </PointLabelBox>
          <PointLabelBox
            style={{ left: twoMarkerLeftPosition, ...(labelPosition === 'bottom' ? { bottom: 5 } : { top: 10 }) }}>
            <PointLabel>{secondLabel}</PointLabel>
          </PointLabelBox>
        </>
      );
    },
    [labelFormatter, labelPosition],
  );

  const handleOnLayoutContainer = (event: LayoutChangeEvent) => {
    setSliderWidth(event?.nativeEvent?.layout?.width);
  };

  return (
    <Container style={style} onLayout={handleOnLayoutContainer}>
      <CustomSlider
        ref={sliderRef}
        sliderLength={sliderWidth}
        customLabel={CustomLabel}
        containerStyle={labelPosition === 'bottom' ? { paddingBottom: 15 } : { paddingTop: 15 }}
        onValuesChange={handleValuesChange}
        customMarker={CustomMarker}
        values={[values?.min, values?.max]}
        min={minValue}
        max={maxValue}
        optionsArray={optionsArray}
        trackStyle={selectedColor?.trackStyle}
        selectedStyle={selectedColor?.selectedStyle}
      />
    </Container>
  );
};

export default RangeInput;
