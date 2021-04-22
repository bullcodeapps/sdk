import { RangeInputProps, RangeInputResponse } from '@bullcode/mobile/components/Form/RangeInput/types';
import MultiSlider, { LabelProps, MarkerProps } from '@ptomasroos/react-native-multi-slider';
import { useField } from '@unform/core';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

import { useDebouncedState } from '../../../../core/hooks';
import { FormFieldType } from '..';
import { DefaultStyles, RangeInputContext, RangeInputContextType } from './context';
import CustomLabel from './CustomLabel';
import { Container, Content, CustomSlider, PointCircle, TouchablePointArea } from './styles';

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

  // Refs
  const sliderRef = useRef<FieldType>(null);

  // States
  const [values, setValues] = useState<RangeInputResponse>({ min: initialPoint, max: endPoint });
  const { fieldName, registerField } = useField(name);
  const [sliderWidth, setSliderWidth] = useState<number>();

  // Debounce
  const debouncedValues = useDebouncedState(values);

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
        `[RangeInput] The "${theme}" theme does not exist, check if you wrote it correctly or if it was declared previously`,
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

  const handleOnLayoutContainer = (event: LayoutChangeEvent) => {
    setSliderWidth(event?.nativeEvent?.layout?.width);
  };

  const rangeValues = useMemo(() => {
    const arrayOfValues = [];
    if (!isNaN(values?.min)) {
      arrayOfValues?.push(values?.min);
    }
    if (!isNaN(values?.max)) {
      arrayOfValues?.push(values?.max);
    }
    return arrayOfValues;
  }, [values.max, values.min]);

  const customLabel = useCallback(
    (props: LabelProps) => (
      <CustomLabel
        {...props}
        enabledOne={enabledOne}
        enabledTwo={enabledTwo}
        initialPoint={initialPoint}
        endPoint={endPoint}
        labelPosition={labelPosition}
        labelFormatter={labelFormatter}
        sliderWidth={sliderWidth}
      />
    ),
    [enabledOne, enabledTwo, endPoint, initialPoint, labelFormatter, labelPosition, sliderWidth],
  );

  return (
    <Container style={style} onLayout={handleOnLayoutContainer}>
      <Content style={contentContainerStyle}>
        <CustomSlider
          ref={sliderRef}
          sliderLength={sliderWidth}
          customLabel={customLabel}
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
