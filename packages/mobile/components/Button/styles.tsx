import styled from 'styled-components/native';
import { Platform, Animated } from 'react-native';

const BUTTON_BG_PRIMARY = '#3a9def';
const BUTTON_COLOR_PRIMARY = '#ffffff';

const BUTTON_BG_SECONDARY = '#ffffff';
const BUTTON_COLOR_SECONDARY = '#3a9def';

const BUTTON_BG_TERTIARY = '#2d2d30';
const BUTTON_COLOR_TERTIARY = '#ffffff';

const BUTTON_BG_QUATERNARY = '#ffc963';
const BUTTON_COLOR_QUATERNARY = '#000';

const BUTTON_BG_GROUP = '#144DDE';
const BUTTON_COLOR_GROUP = '#ffffff';

const BUTTON_BG_WHITE = '#ffffff';
const BUTTON_COLOR_WHITE = '#2d2d30';

const BUTTON_BG_DANGER = '#dc3446';
const BUTTON_COLOR_DANGER = '#ffffff';

const DISABLED_BG = '#d2d2d6';
const DISABLED_COLOR = '#fff';

/*
 * For now we will keep the color mapping like this, but in the future it would be interesting to create
 * the colors dynamically within the global style file.
 * For that it would be necessary to create a color object for the button where the key is the name
 * of the color and the value is the color in hexadecimal.
 */

export enum AvailableColorsEnum {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  QUATERNARY = 'quaternary',
  GROUP = 'group',
  WHITE = 'white',
  DANGER = 'danger',
}

export type AvailableColors = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'group' | 'white' | 'danger';

type ColorProps = {
  disabled?: boolean;
  outline?: boolean;
  color?: AvailableColors;
};

const getButtonBackground = ({ color, outline, disabled }: ColorProps) => {
  if (disabled) {
    return `background-color: ${outline ? 'transparent' : DISABLED_BG}; border-color: #d2d2d6;`;
  }
  switch (color) {
    case AvailableColorsEnum.SECONDARY:
      return `background-color: ${
        outline ? 'transparent' : BUTTON_BG_SECONDARY
      }; border-color: ${BUTTON_BG_SECONDARY};`;
    case AvailableColorsEnum.TERTIARY:
      return `background-color: ${
        outline ? 'transparent' : BUTTON_BG_TERTIARY
      }; border-color: ${BUTTON_BG_TERTIARY};`;
    case AvailableColorsEnum.QUATERNARY:
      return `background-color: ${
        outline ? 'transparent' : BUTTON_BG_QUATERNARY
      }; border-color: ${BUTTON_BG_QUATERNARY};`;
    case AvailableColorsEnum.GROUP:
      return `background-color: ${outline ? 'transparent' : BUTTON_BG_GROUP}; border-color: ${BUTTON_BG_GROUP};`;
    case AvailableColorsEnum.WHITE:
      return `background-color: ${outline ? 'transparent' : BUTTON_BG_WHITE}; border-color: ${BUTTON_BG_WHITE};`;
    case AvailableColorsEnum.DANGER:
      return `background-color: ${outline ? 'transparent' : BUTTON_BG_DANGER}; border-color: ${BUTTON_BG_DANGER};`;
    case AvailableColorsEnum.PRIMARY:
    default:
      return `background-color: ${
        outline ? 'transparent' : BUTTON_BG_PRIMARY
      }; border-color: ${BUTTON_BG_PRIMARY};`;
  }
};

export const getButtonColor = ({ color, outline, disabled }: ColorProps) => {
  if (disabled) {
    return outline ? DISABLED_BG : DISABLED_COLOR;
  }
  switch (color) {
    case AvailableColorsEnum.SECONDARY:
      return outline ? BUTTON_BG_SECONDARY : BUTTON_COLOR_SECONDARY;
    case AvailableColorsEnum.TERTIARY:
      return outline ? BUTTON_BG_TERTIARY : BUTTON_COLOR_TERTIARY;
    case AvailableColorsEnum.QUATERNARY:
      return outline ? BUTTON_BG_QUATERNARY : BUTTON_COLOR_QUATERNARY;
    case AvailableColorsEnum.GROUP:
      return outline ? BUTTON_BG_GROUP : BUTTON_COLOR_GROUP;
    case AvailableColorsEnum.WHITE:
      return outline ? BUTTON_BG_WHITE : BUTTON_COLOR_WHITE;
    case AvailableColorsEnum.DANGER:
      return outline ? BUTTON_BG_DANGER : BUTTON_COLOR_DANGER;
    case AvailableColorsEnum.PRIMARY:
    default:
      return outline ? BUTTON_BG_PRIMARY : BUTTON_COLOR_PRIMARY;
  }
};

export const Container = styled(Animated.View)`
  flex-grow: 1;
  margin-top: 10px;
`;

export const ButtonBox = styled(Animated.View)<ColorProps>`
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  height: 60px;
  border-radius: 30px;
  ${(props) => getButtonBackground(props)};
`;

export const ButtonText = styled(Animated.Text)<ColorProps>`
  font-size: 18px;
  height: ${Platform.OS === 'ios' ? '18' : '28'}px;
  font-weight: 500;
  color: ${(props) => getButtonColor(props)};
`;
