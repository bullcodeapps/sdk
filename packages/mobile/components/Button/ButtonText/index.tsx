import React, { useMemo, useContext } from 'react';

import { Text } from './styles';
import ButtonContext, { ButtonContextType } from '@bullcode/mobile/components/Button/context';
import { ButtonTextStyles, ButtonColors } from '@bullcode/mobile/components/Button/types';
import { ActivityIndicator, TextProps } from 'react-native';

type CustomProps = {
  defaultButtonColors?: ButtonColors;
  color?: string;
  disabled?: boolean;
  outline?: boolean;
  loading?: boolean;
  loadingSize?: number | 'small' | 'large';
  activityIndicatorColor?: string;
};

export type ButtonTextProps = CustomProps & TextProps;

const ButtonText: React.FC<ButtonTextProps> = ({
  defaultButtonColors,
  color,
  disabled,
  outline,
  loading,
  loadingSize,
  activityIndicatorColor,
  ...rest
}) => {
  const ctx = useContext<ButtonContextType>(ButtonContext);

  const buttonTextColorStyles: Partial<ButtonTextStyles> = useMemo(() => {
    const colors = ctx?.colors || defaultButtonColors;
    const foundColor = colors.find((_color) => _color.name === color);
    if (!foundColor ) {
      if (__DEV__) {
        console.log(
          `The "${color}" color does not exist, check if you wrote it correctly or if it was declared previously`,
        );
      }
      return {};
    }
    if (disabled) {
      const { color: textColor } = foundColor?.disabled[outline ? 'outline' : 'solid'];
      return { color: textColor };
    }
    const { color: textColor } = foundColor?.default[outline ? 'outline' : 'solid'];
    return { color: textColor };
  }, [color, ctx?.colors, defaultButtonColors, disabled, outline]);

  return loading ? (
    <ActivityIndicator
      size={loadingSize || 'small'}
      color={activityIndicatorColor || buttonTextColorStyles?.color}
    />
  ) : (
    <Text {...rest} style={[buttonTextColorStyles, rest?.style]}/>
  );
};

export default ButtonText;