import React, { FunctionComponent, useMemo } from 'react';

import { Container, ChipButtonBox, ChipButtonText, Content } from './styles';
import { TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';

export type ChipButtonProps = TouchableOpacityProps & {
  active?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  textStyle?: TextStyle;
  fillWhenActive?: boolean;
  disabled?: boolean;
  children: any;
};

export type ChipButtonComponent = FunctionComponent<ChipButtonProps>;

const ChipButton: ChipButtonComponent = ({
  active,
  children,
  style,
  contentContainerStyle,
  textStyle,
  fillWhenActive = false,
  disabled = false,
  ...rest
}: ChipButtonProps) => {

  return (
    <Container active={active} fillWhenActive={fillWhenActive} disabled={disabled} {...rest} style={style}>
      <Content style={contentContainerStyle}>
        {typeof children === 'string' ? (
          <ChipButtonBox>
            <ChipButtonText style={textStyle} active={active} fillWhenActive={fillWhenActive}>
              {children}
            </ChipButtonText>
          </ChipButtonBox>
        ) : (
            children
          )}
      </Content>
    </Container>
  );
};

export default ChipButton;
