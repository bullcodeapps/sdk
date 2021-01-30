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

  const buttonTextActiveType = useMemo(() => {
    if (!foundStyle) {
      console.log(
        `The "${theme}" theme does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return {};
    }

    if (disabled) {
      return foundStyle?.disabled[outline ? 'outline' : 'solid'];
    }

    return foundStyle?.active[outline ? 'outline' : 'solid'];
  }, [disabled, foundStyle, outline, theme]);

  const buttonTextDefaultType = useMemo(() => {
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

  const buttonTextStyle = useMemo(
    () => (showingUnderlay ? buttonTextActiveType?.textStyle : buttonTextDefaultType?.textStyle),
    [buttonTextActiveType?.textStyle, buttonTextDefaultType?.textStyle, showingUnderlay],
  );

  const buttonTextType = useMemo(
    () => (showingUnderlay ? buttonTextActiveType?.textType : buttonTextDefaultType?.textType),
    [buttonTextActiveType?.textType, buttonTextDefaultType?.textType, showingUnderlay],
  );

  const activityIndicatorColor: string = useMemo(
    () =>
      showingUnderlay
        ? buttonTextActiveType?.activityIndicatorColor
        : buttonTextDefaultType?.activityIndicatorColor,
    [buttonTextActiveType?.activityIndicatorColor, buttonTextDefaultType?.activityIndicatorColor, showingUnderlay],
  );

  return loading ? (
    <ActivityIndicator
      size={loadingSize || 'small'}
      color={propActivityIndicatorColor || activityIndicatorColor}
    />
  ) : (
    <Text type={buttonTextType} {...rest} style={[buttonTextStyle, rest?.style]} />
  );
};

export default ButtonText;
