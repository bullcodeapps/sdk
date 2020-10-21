import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import { CheckCircle, CheckMarkIcon, ExclamationMarkIcon } from './styles';

export type ValidityMarkProps = {
  isValid?: boolean;
  color?: string;
  onPress?: (event: GestureResponderEvent) => void;
};

const ValidityMark = ({ isValid, color, onPress }: ValidityMarkProps) => {
  return (
    <TouchableOpacity activeOpacity={isValid ? 1 : 0.8} onPress={(e) => !isValid && onPress(e)}>
      <CheckCircle color={color} size={25}>
        {isValid ? <CheckMarkIcon /> : <ExclamationMarkIcon />}
      </CheckCircle>
    </TouchableOpacity>
  );
};

export default ValidityMark;
