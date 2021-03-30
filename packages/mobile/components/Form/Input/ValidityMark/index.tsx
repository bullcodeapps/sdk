import React, { useMemo } from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import { CheckCircle, CheckMarkIcon, ExclamationMarkIcon } from './styles';
import { ValidityMarkTypes } from '@bullcode/mobile/components/Form/Input/types';

export type ValidityMarkProps = {
  isValid?: boolean;
  colors?: ValidityMarkTypes;
  onPress?: (event: GestureResponderEvent) => void;
};

const ValidityMark = ({ isValid, colors, onPress }: ValidityMarkProps) => {
  const activeColors = useMemo(() => {
    if (colors && Object.keys(colors).length) {
      return colors[isValid ? 'valid' : 'invalid'];
    }
  }, [colors, isValid]);
  return (
    <TouchableOpacity activeOpacity={isValid ? 1 : 0.8} onPress={(e) => !isValid && onPress(e)}>
      <CheckCircle color={activeColors?.backgroundColor} size={25}>
        {isValid ? (
          <CheckMarkIcon color={activeColors?.color} />
        ) : (
          <ExclamationMarkIcon color={activeColors?.color} />
        )}
      </CheckCircle>
    </TouchableOpacity>
  );
};

export default ValidityMark;
