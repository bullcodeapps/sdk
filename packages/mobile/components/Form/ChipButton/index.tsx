import React, { FunctionComponent, useMemo } from 'react';

import { Container, ChipButtonBox, ChipButtonText } from './styles';
import { TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';

export type ChipButtonProps = TouchableOpacityProps & {
  active?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  fillWhenActive?: boolean;
  disabled?: boolean;
  children: any;
};

export type ChipButtonComponent = FunctionComponent<ChipButtonProps>;

const ChipButton: ChipButtonComponent = ({
  active,
  children,
  containerStyle,
  textStyle,
  fillWhenActive = false,
  disabled = false,
  ...rest
}: ChipButtonProps) => {
  const styles = useMemo(() => {
    let formattedStyles = {};

    ((rest.style as Array<object>) || []).forEach((item) => {
      formattedStyles = { ...formattedStyles, ...item };
    });

    formattedStyles = {
      ...formattedStyles,
      ...containerStyle,
    };

    return formattedStyles;
  }, [containerStyle, rest?.style]);

  return (
    <Container active={active} fillWhenActive={fillWhenActive} disabled={disabled} {...rest} style={styles}>
      {typeof children === 'string' ? (
        <ChipButtonBox>
          <ChipButtonText style={textStyle} active={active} fillWhenActive={fillWhenActive}>
            {children}
          </ChipButtonText>
        </ChipButtonBox>
      ) : (
        children
      )}
    </Container>
  );
};

export default ChipButton;
