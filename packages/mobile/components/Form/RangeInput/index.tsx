import React, { useEffect, useState, useRef, useContext, useMemo, useCallback } from 'react';

import {
  Container,
  CustomSlider,
  PointLabelBox,
  PointLabel,
  TouchablePointArea,
  PointCircle,
  Content,
} from './styles';
import { ViewStyle, LayoutChangeEvent } from 'react-native';
import { useField } from '@unform/core';
import MultiSlider, { MarkerProps } from '@ptomasroos/react-native-multi-slider';
import { useDebouncedState } from '../../../../core/hooks';
import { FormFieldType } from '..';

import { RangeInputContextType, RangeInputContext, DefaultStyles } from './context';

export type RangeInputResponse = {
  min: number;
  max: number;
};

export type RangeInputProps = {
  name?: string;
  theme?: string;
  labelPosition?: 'top' | 'bottom';
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  initialPoint?: number;
  endPoint?: number;
  minValue: number;
  maxValue: number;
  enabledOne?: boolean;
  enabledTwo?: boolean;
  enableLabel?: boolean;
  optionsArray?: number[];
  labelFormatter?: (value: number) => void;
  onValuesChange?: (values: RangeInputResponse) => void;
};

type FieldType = FormFieldType<MultiSlider>;

type RangeInputComponent = React.FC<RangeInputProps>;

const RangeInput: RangeInputComponent = ({
  name,
  theme,
  labelPosition,
  style,
  contentContainerStyle,
  initialPoint,
  endPoint,
  minValue,
  maxValue,
  enabledOne = true,
  enabledTwo = false,
  enableLabel = true,
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
    const styles = ctx?.styles;
    if (!theme && !!styles?.length) {
      const foundColor = styles?.find((_style) => _style.name === 'default');
      if (foundColor) {
        return foundColor;
      }
      return DefaultStyles[0];
    }
    const foundColor = styles?.find((_style) => _style.name === theme);
    if (!foundColor) {
      console.log(
        `The "${theme}" theme does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultStyles[0];
    }
    return foundColor;
  }, [theme, ctx?.styles]);

  const CustomMarker = useCallback(
    ({ enabled }: MarkerProps) => (
      <TouchablePointArea activeOpacity={0.8}>
        <PointCircle
          style={enabled ? selectedColor?.marker?.defaultStyle : selectedColor?.marker?.disabledStyle}
        />
      </TouchablePointArea>
    ),
    [selectedColor?.marker?.defaultStyle, selectedColor?.marker?.disabledStyle],
  );

  const CustomLabel = useCallback(
    ({ oneMarkerValue, oneMarkerLeftPosition, twoMarkerValue, twoMarkerLeftPosition }) => {
      const firstLabel = labelFormatter ? labelFormatter(oneMarkerValue) : oneMarkerValue;
      const secondLabel = labelFormatter ? labelFormatter(twoMarkerValue) : twoMarkerValue;
      return (
        <>
          {(enabledOne || initialPoint) && (
            <PointLabelBox
              style={{
                left: oneMarkerLeftPosition,
                ...(labelPosition === 'bottom' ? { bottom: 5 } : { top: 10 }),
              }}>
              <PointLabel>{firstLabel}</PointLabel>
            </PointLabelBox>
          )}
          {(enabledTwo || endPoint) && (
            <PointLabelBox
              style={{
                left: twoMarkerLeftPosition,
                ...(labelPosition === 'bottom' ? { bottom: 5 } : { top: 10 }),
              }}>
              <PointLabel>{secondLabel}</PointLabel>
            </PointLabelBox>
          )}
        </>
      );
    },
    [enabledOne, enabledTwo, endPoint, initialPoint, labelFormatter, labelPosition],
  );

  const handleOnLayoutContainer = (event: LayoutChangeEvent) => {
    setSliderWidth(event?.nativeEvent?.layout?.width);
  };

  const rangeValues = useMemo(() => {
    let arrayOfValues = [];
    if (!isNaN(values?.min)) {
      arrayOfValues?.push(values?.min);
    }
    if (!isNaN(values?.max)) {
      arrayOfValues?.push(values?.max);
    }
    return arrayOfValues;
  }, [values.max, values.min]);

  return (
    <Container style={style} onLayout={handleOnLayoutContainer}>
      <Content style={contentContainerStyle}>
        <CustomSlider
          ref={sliderRef}
          sliderLength={sliderWidth}
          customLabel={CustomLabel}
          containerStyle={labelPosition === 'bottom' ? { paddingBottom: 15 } : { paddingTop: 15 }}
          onValuesChange={handleValuesChange}
          customMarker={CustomMarker}
          values={rangeValues}
          min={minValue}
          max={maxValue}
          optionsArray={optionsArray}
          trackStyle={selectedColor?.trackStyle}
          selectedStyle={selectedColor?.selectedStyle}
          enabledOne={enabledOne}
          enabledTwo={enabledTwo}
          enableLabel={enableLabel}
        />
      </Content>
    </Container>
  );
};

export default RangeInput;
