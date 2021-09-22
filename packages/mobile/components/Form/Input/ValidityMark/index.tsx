import React, { useMemo } from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import { CheckCircle, CheckMarkIcon, ExclamationMarkIcon } from './styles';
import { AdornmentComponentType, ValidityMarkTypes } from '../types';

export type ValidityMarkProps = {
  isValid?: boolean;
  colors?: ValidityMarkTypes;
  onPress?: (event: GestureResponderEvent) => void;
  validValidityMarkIcon?: AdornmentComponentType;
  invalidValidityMarkIcon?: AdornmentComponentType;
};

const ValidityMark = ({ isValid, colors, onPress, validValidityMarkIcon, invalidValidityMarkIcon }: ValidityMarkProps) => {
  const activeColors = useMemo(() => {
    if (colors && Object.keys(colors).length) {
      return colors[isValid ? 'valid' : 'invalid'];
    }
  }, [colors, isValid]);

  const CustomValidValidityMarkIcon = useMemo(() => validValidityMarkIcon, [validValidityMarkIcon]);
  const CustomInvalidValidityMarkIcon = useMemo(() => invalidValidityMarkIcon, [invalidValidityMarkIcon]);

  return (
    <TouchableOpacity activeOpacity={isValid ? 1 : 0.8} onPress={(e) => !isValid && onPress(e)}>
      <CheckCircle color={(!!validValidityMarkIcon || !!invalidValidityMarkIcon) ? 'transparent' : activeColors?.backgroundColor} size={25}>
        {isValid ? (
          <>{!!validValidityMarkIcon ? <CustomValidValidityMarkIcon /> : <CheckMarkIcon color={activeColors?.color} />}</>
        ) : (
          <>{!!invalidValidityMarkIcon ? <CustomInvalidValidityMarkIcon /> : <ExclamationMarkIcon color={activeColors?.color} />}</>

        )}
      </CheckCircle>
    </TouchableOpacity>
  );
};

export default ValidityMark;
