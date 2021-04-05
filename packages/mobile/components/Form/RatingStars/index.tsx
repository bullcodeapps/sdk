import React, { useState, useEffect, createRef, useCallback, useMemo, useContext } from 'react';

import {
  Container,
  StarTouchableContainer,
  BackgroundStarIcon,
  BackgroundStars,
  ForegroundStarIcon,
  ForegroundStars,
  MaskContainer,
  DEFAULT_STAR_SIZE,
} from './styles';
import { ViewProps, ViewStyle } from 'react-native';
import { useField } from '@unform/core';

import { RatingStarsContextType, RatingStarsContext, DefaultStyles } from './context';

type RatingStarsProps = {
  name?: string;
  starsNumber?: number;
  starsSize?: number;
  value?: number;
  defaultValue?: number;
  required?: boolean;
  onChange?: (value: number) => void;
  theme?: string;
  disabled?: boolean;
  style?: ViewStyle;
  contentContainerStyles?: ViewStyle;
  starContainerStyles?: ViewStyle;
  starStyles?: ViewStyle;
} & ViewProps;

type ComponentRef = {};

const DEFAULT_STARS_NUMBER = 5;

const RatingStars: React.FC<RatingStarsProps> = ({
  name,
  starsNumber = DEFAULT_STARS_NUMBER,
  starsSize = DEFAULT_STAR_SIZE,
  value,
  defaultValue,
  required,
  onChange,
  theme = 'primary',
  disabled = false,
  style,
  contentContainerStyles,
  starContainerStyles,
  starStyles,
  ...rest
}) => {
  const ctx = useContext<RatingStarsContextType>(RatingStarsContext);

  // States
  const [stars, setStars] = useState<Array<any>>([...Array(DEFAULT_STARS_NUMBER)]);
  const [rating, setRating] = useState<number>(0);
  const { fieldName, registerField } = useField(name);

  const [backgroundStarsWidth, setBackgroundStarsWidth] = useState(0);
  const [backgroundStarsHeight, setBackgroundStarsHeight] = useState(0);

  const [starTouchableContainerWidth, setStarTouchableWidth] = useState(0);
  const [starTouchableContainerHeight, setStarTouchableHeight] = useState(0);

  // Refs
  const componentRef = createRef<ComponentRef>();

  useEffect(() => {
    if (isNaN(defaultValue)) {
      return;
    }
    setRating(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (isNaN(starsNumber)) {
      return;
    }
    setStars([...Array(starsNumber)]);
  }, [starsNumber]);

  useEffect(() => {
    if ([undefined, null].includes(value)) {
      return;
    }
    setRating(value);
  }, [value]);

  const reset = useCallback(() => setRating(defaultValue || 0), [defaultValue]);

  const handleStarPress = (index) => {
    if (rating === index + 1) {
      !required && reset();
    } else {
      setRating(index + 1);
    }
    onChange && onChange(rating);
  };

  useEffect(() => {
    registerField<number>({
      name: fieldName,
      ref: componentRef.current,
      clearValue: reset,
      setValue: (ref: ComponentRef, val: number) => setRating(val),
      getValue: () => rating,
    });
  }, [componentRef, defaultValue, fieldName, rating, registerField, reset]);

  const onLayoutBackgroundStars = (e) => {
    setBackgroundStarsWidth(e.nativeEvent.layout.width);
    setBackgroundStarsHeight(e.nativeEvent.layout.height);
  };

  const onLayoutStarTouchableContainer = (e) => {
    setStarTouchableWidth(e.nativeEvent.layout.width);
    setStarTouchableHeight(e.nativeEvent.layout.height);
  };

  const width = useMemo(() => {
    const margins = ((Number(starStyles?.marginLeft) || 0) + (Number(starStyles?.marginRight) || 0));
    const paddings = ((Number(starStyles?.paddingLeft) || 0) + (Number(starStyles?.paddingRight) || 0));

    return (starsSize * rating) + (margins + paddings) * Math.floor(rating);
  }, [starsSize, rating, starsNumber, starStyles]);

  const selectedStyle = useMemo(() => {
    const styles = ctx?.styles || DefaultStyles;
    const foundColor = styles.find((_color) => _color.name === theme);
    if (!foundColor) {
      console.warn(
        `The "${theme}" theme does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultStyles[0];
    }
    return foundColor;
  }, [theme, ctx?.styles]);

  return (
    <Container style={[style, selectedStyle?.default?.containerStyles]}>
      <BackgroundStars onLayout={onLayoutBackgroundStars} style={[contentContainerStyles, selectedStyle?.default?.contentContainerStyles]}>
        {stars.map((item, index) => (
          <StarTouchableContainer
            key={index}
            activeOpacity={disabled ? 1 : 0.8}
            onPress={() => !disabled && handleStarPress(index)}
            onLayout={onLayoutStarTouchableContainer}
            style={[starContainerStyles, selectedStyle?.default?.starContainerStyles]}
          >
            <BackgroundStarIcon size={starsSize} style={[starStyles, selectedStyle?.default?.backgroundStar]} />
          </StarTouchableContainer>
        ))}
      </BackgroundStars>
      <MaskContainer style={{ width }}>
        <ForegroundStars style={[{ width: backgroundStarsWidth, height: backgroundStarsHeight }, contentContainerStyles, selectedStyle?.default?.contentContainerStyles]}>
          {stars.map((item, index) => (
            <StarTouchableContainer
              key={index}
              activeOpacity={disabled ? 1 : 0.8}
              onPress={() => !disabled && handleStarPress(index)}
              style={[{
                width: starTouchableContainerWidth,
                height: starTouchableContainerHeight,
              }, starContainerStyles, selectedStyle?.default?.starContainerStyles]}
            >
              <ForegroundStarIcon size={starsSize} style={[starStyles, selectedStyle?.default?.foregroundStar]} />
            </StarTouchableContainer>
          ))}
        </ForegroundStars>
      </MaskContainer>
    </Container>
  );
};

export default RatingStars;
