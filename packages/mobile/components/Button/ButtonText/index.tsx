import React, { useMemo, useContext } from 'react';

import { Text } from '@bullcode/mobile/components/Button/ButtonText/styles';
import ButtonContext, {
  ButtonContextType,
  DEFAULT_BUTTON_STYLES,
} from '@bullcode/mobile/components/Button/context';
import { ButtonStyleType } from '@bullcode/mobile/components/Button/types';
import { ActivityIndicator } from 'react-native';
import { TextProps } from '@bullcode/mobile/components/Text';

type CustomProps = {
  theme?: string;
  disabled?: boolean;
  outline?: boolean;
  loading?: boolean;
  loadingSize?: number | 'small' | 'large';
  showingUnderlay?: boolean;
  activityIndicatorColor?: string;
};

export type ButtonTextProps = CustomProps & TextProps;

const ButtonText: React.FC<ButtonTextProps> = ({
  theme,
  disabled,
  outline,
  loading,
  loadingSize,
  showingUnderlay,
  activityIndicatorColor: propActivityIndicatorColor,
  ...rest
}) => {
  const ctx = useContext<ButtonContextType>(ButtonContext);

  const foundStyle = useMemo(() => {
    const styles = ctx?.styles || DEFAULT_BUTTON_STYLES;
    return styles.find((_style) => _style.name === theme);
  }, [ctx?.styles, theme]);

  const buttonStyleType: ButtonStyleType = useMemo(() => {
    if (!foundStyle) {
      console.log(
        `The "${theme}" theme does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return {};
    }
    if (disabled) {
      return foundStyle?.disabled[outline ? 'outline' : 'solid'];
    }
    return foundStyle?.default[outline ? 'outline' : 'solid'];
  }, [disabled, foundStyle, outline, theme]);

  const activityIndicatorColor: string = useMemo(() => {
    if (!foundStyle) {
      console.log(
        `The "${theme}" theme does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return;
    }

    if (showingUnderlay) {
      const { activityIndicatorColor } = foundStyle.active[outline ? 'outline' : 'solid'];
      return activityIndicatorColor;
    }

    if (disabled) {
      const { activityIndicatorColor } = foundStyle?.disabled[outline ? 'outline' : 'solid'];
      return activityIndicatorColor;
    }

    const { activityIndicatorColor } = foundStyle.default[outline ? 'outline' : 'solid'];
    return activityIndicatorColor;
  }, [disabled, foundStyle, outline, showingUnderlay, theme]);

  return loading ? (
    <ActivityIndicator
      size={loadingSize || 'small'}
      color={propActivityIndicatorColor || activityIndicatorColor}
    />
  ) : (
    <Text type={buttonStyleType?.textType} {...rest} style={[buttonStyleType?.textStyle, rest?.style]} />
  );
};

export default ButtonText;
