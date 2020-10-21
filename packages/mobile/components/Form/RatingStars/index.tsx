import React, { useState, useEffect, createRef, useCallback } from 'react';

import {
  Container,
  StarTouchableContainer,
  BackgroundStars,
  BackgroundStarIcon,
  ForegroundStars,
  ForegroundStarIcon,
  MaskContainer,
} from './styles';
import { ViewProps } from 'react-native';
import { useField } from '@unform/core';

type RatingStarsProps = {
  name?: string;
  starsNumber?: number;
  starsSize?: number;
  value?: number;
  defaultValue?: number;
  required?: boolean;
  onChange?: (value: number) => void;
} & ViewProps;

type ComponentRef = {};

const RatingStars: React.FC<RatingStarsProps> = ({
  name,
  starsNumber,
  starsSize,
  value,
  defaultValue,
  required,
  onChange,
  ...rest
}) => {
  // States
  const [stars, setStars] = useState<Array<any>>([...Array(5)]);
  const [rating, setRating] = useState<number>(0);
  const { fieldName, registerField } = useField(name);

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

  return (
    <Container starsSize={starsSize} {...rest}>
      <BackgroundStars>
        {stars.map((item, index) => (
          <StarTouchableContainer key={index} activeOpacity={0.8} onPress={() => handleStarPress(index)}>
            <BackgroundStarIcon size={starsSize} last={index === stars?.length - 1} />
          </StarTouchableContainer>
        ))}
      </BackgroundStars>
      <MaskContainer starsSize={starsSize} rating={rating}>
        <ForegroundStars>
          {stars.map((item, index) => (
            <StarTouchableContainer key={index} activeOpacity={0.8} onPress={() => handleStarPress(index)}>
              <ForegroundStarIcon size={starsSize} last={index === stars?.length - 1} />
            </StarTouchableContainer>
          ))}
        </ForegroundStars>
      </MaskContainer>
    </Container>
  );
};

export default RatingStars;
