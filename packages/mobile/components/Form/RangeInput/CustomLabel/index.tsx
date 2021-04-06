import { RangeInputProps } from '@bullcode/mobile/components/Form/RangeInput/types';
import { LabelProps } from '@ptomasroos/react-native-multi-slider';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, LayoutRectangle, View } from 'react-native';

import { PointLabel, PointLabelBox } from './styles';

type CustomProps = {
  sliderWidth: number;
};

type UnusedParentProps =
  | 'name'
  | 'theme'
  | 'style'
  | 'contentContainerStyle'
  | 'minValue'
  | 'maxValue'
  | 'enableLabel'
  | 'optionsArray'
  | 'onValuesChange';

export type CustomLabelProps = CustomProps & Omit<RangeInputProps, UnusedParentProps> & LabelProps;

const DEFAULT_LAYOUT_RECTANGLE = {
  height: 0,
  width: 0,
  x: 0,
  y: 0,
};

const CustomLabel = ({
  oneMarkerValue,
  twoMarkerValue,
  oneMarkerLeftPosition = 0,
  twoMarkerLeftPosition = 0,
  oneMarkerPressed,
  twoMarkerPressed,
  enabledOne,
  enabledTwo,
  initialPoint,
  endPoint,
  labelPosition,
  sliderWidth = 0,
  labelFormatter,
}: CustomLabelProps) => {
  const spaceBetweenLabels = 10;

  // Ref
  const firstPointOpacity = useRef(new Animated.Value(0)).current;
  const secondPointOpacity = useRef(new Animated.Value(0)).current;

  // States
  const [firstPointLayout, setFirstPointLayout] = useState<LayoutRectangle>(DEFAULT_LAYOUT_RECTANGLE);
  const [secondPointLayout, setSecondPointLayout] = useState<LayoutRectangle>(DEFAULT_LAYOUT_RECTANGLE);
  const [firstPointLeftMeasure, setFirstPointLeftMeasure] = useState<number>(0);
  const [secondPointLeftMeasure, setSecondPointLeftMeasure] = useState<number>(0);

  const handleOnLayoutFirstPoint = useCallback(
    (e: LayoutChangeEvent) => setFirstPointLayout(e?.nativeEvent?.layout || DEFAULT_LAYOUT_RECTANGLE),
    [],
  );

  const handleOnLayoutSecondPoint = useCallback(
    (e: LayoutChangeEvent) => setSecondPointLayout(e?.nativeEvent?.layout),
    [],
  );

  const firstPointHalfWidth = useMemo(() => (firstPointLayout?.width || 0) / 2, [firstPointLayout?.width]);
  const secondPointHalfWidth = useMemo(() => (secondPointLayout?.width || 0) / 2, [secondPointLayout?.width]);

  const firstLabel = useMemo(() => (labelFormatter ? labelFormatter(oneMarkerValue) : oneMarkerValue), [
    labelFormatter,
    oneMarkerValue,
  ]);
  const secondLabel = useMemo(() => (labelFormatter ? labelFormatter(twoMarkerValue) : twoMarkerValue), [
    labelFormatter,
    twoMarkerValue,
  ]);

  const firstPointReachedStart = useMemo(() => oneMarkerLeftPosition - firstPointHalfWidth <= 0, [
    firstPointHalfWidth,
    oneMarkerLeftPosition,
  ]);
  const secondPointReachedEnd = useMemo(() => twoMarkerLeftPosition + secondPointHalfWidth > sliderWidth, [
    secondPointHalfWidth,
    sliderWidth,
    twoMarkerLeftPosition,
  ]);

  const firstPointPosition = useMemo(
    () => ({
      start: firstPointReachedStart ? oneMarkerLeftPosition : oneMarkerLeftPosition - firstPointHalfWidth,
      middle: firstPointReachedStart ? oneMarkerLeftPosition + firstPointHalfWidth : oneMarkerLeftPosition,
      end: firstPointReachedStart
        ? oneMarkerLeftPosition + firstPointLayout?.width
        : oneMarkerLeftPosition + firstPointHalfWidth,
    }),
    [firstPointHalfWidth, firstPointLayout?.width, firstPointReachedStart, oneMarkerLeftPosition],
  );

  const secondPointPosition = useMemo(
    () => ({
      start: secondPointReachedEnd
        ? twoMarkerLeftPosition - secondPointLayout?.width
        : twoMarkerLeftPosition - secondPointHalfWidth,
      middle: secondPointReachedEnd ? twoMarkerLeftPosition - secondPointHalfWidth : twoMarkerLeftPosition,
      end: secondPointReachedEnd ? twoMarkerLeftPosition : twoMarkerLeftPosition + firstPointHalfWidth,
    }),
    [
      firstPointHalfWidth,
      secondPointHalfWidth,
      secondPointLayout?.width,
      secondPointReachedEnd,
      twoMarkerLeftPosition,
    ],
  );

  useEffect(() => {
    // prevents changes to the second point from making changes to the first
    if (twoMarkerPressed && !oneMarkerPressed) {
      return;
    }
    if (firstPointReachedStart) {
      // ensures that it does not exceed the limit (min)
      setFirstPointLeftMeasure(firstPointHalfWidth);
    } else if (firstPointPosition?.end + spaceBetweenLabels >= secondPointPosition?.start) {
      // respects the adjacent item
      setFirstPointLeftMeasure(secondPointPosition?.start - firstPointHalfWidth - spaceBetweenLabels);
    } else {
      // when it is not being limited by the edges or by the adjacent item,
      // then we keep the label centered to the point
      setFirstPointLeftMeasure(firstPointPosition?.middle);
    }
  }, [
    oneMarkerPressed,
    twoMarkerPressed,
    firstPointHalfWidth,
    firstPointReachedStart,
    firstPointPosition?.end,
    firstPointPosition?.middle,
    firstPointPosition.start,
    secondPointPosition?.start,
  ]);

  useEffect(() => {
    // prevents changes to the first point from making changes to the second
    if (oneMarkerPressed && !twoMarkerPressed) {
      return;
    }
    if (secondPointReachedEnd) {
      // ensures that it does not exceed the limit (max)
      setSecondPointLeftMeasure(sliderWidth - secondPointHalfWidth);
    } else if (secondPointPosition?.start - spaceBetweenLabels <= firstPointPosition?.end) {
      // respects the adjacent item
      setSecondPointLeftMeasure(firstPointPosition?.end + secondPointHalfWidth + spaceBetweenLabels);
    } else {
      // when it is not being limited by the edges or by the adjacent item,
      // then we keep the label centered to the point
      setSecondPointLeftMeasure(secondPointPosition?.middle);
    }
  }, [
    sliderWidth,
    oneMarkerPressed,
    twoMarkerPressed,
    secondPointHalfWidth,
    secondPointReachedEnd,
    firstPointPosition?.end,
    secondPointPosition?.middle,
    secondPointPosition?.start,
  ]);

  const firstPointLeft = useMemo(() => Math.max(firstPointLeftMeasure, firstPointHalfWidth), [
    firstPointHalfWidth,
    firstPointLeftMeasure,
  ]);

  const secondPointLeft = useMemo(() => Math.min(secondPointLeftMeasure, sliderWidth - secondPointHalfWidth), [
    secondPointHalfWidth,
    secondPointLeftMeasure,
    sliderWidth,
  ]);

  useEffect(() => {
    const hasFirstPointMeasure = firstPointHalfWidth > 0;
    const hasSecondPointMeasure = secondPointHalfWidth > 0;
    if ((enabledOne && !hasFirstPointMeasure) || (enabledTwo && !hasSecondPointMeasure)) {
      return;
    }
    Animated.parallel([
      Animated.timing(firstPointOpacity, {
        toValue: +hasFirstPointMeasure,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(secondPointOpacity, {
        toValue: +hasSecondPointMeasure,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [enabledOne, enabledTwo, firstPointHalfWidth, firstPointOpacity, secondPointHalfWidth, secondPointOpacity]);

  return (
    <View>
      {(enabledOne || initialPoint) && (
        <PointLabelBox
          style={{
            // ensures that it does not exceed the limit (min)
            left: firstPointLeft,
            ...(labelPosition === 'bottom' ? { bottom: 5 } : { top: 10 }),
          }}>
          <PointLabel onLayout={handleOnLayoutFirstPoint} style={{ opacity: firstPointOpacity }}>
            {firstLabel}
          </PointLabel>
        </PointLabelBox>
      )}
      {(enabledTwo || endPoint) && (
        <PointLabelBox
          style={{
            // ensures that it does not exceed the limit (max)
            left: secondPointLeft,
            ...(labelPosition === 'bottom' ? { bottom: 5 } : { top: 10 }),
          }}>
          <PointLabel onLayout={handleOnLayoutSecondPoint} style={{ opacity: secondPointOpacity }}>
            {secondLabel}
          </PointLabel>
        </PointLabelBox>
      )}
    </View>
  );
};

export default CustomLabel;
