import styled from 'styled-components/native';
import { Platform, Animated } from 'react-native';

export type ButtonStyles = {
  backgroundColor: string,
  borderColor: string,
};

export type ButtonTextStyles = {
  color: string,
};

export type ButtonColorTypes = {
  outline: ButtonStyles & ButtonTextStyles,
  solid: ButtonStyles & ButtonTextStyles,
  borderRadius?: number,
};

export type ButtonColor = {
  name: string;
  default: ButtonColorTypes;
  active?: ButtonColorTypes;
  disabled?: ButtonColorTypes;
};

export type ButtonColors = Array<ButtonColor>;

const BUTTON_BG_PRIMARY = '#3a9def';
const BUTTON_COLOR_PRIMARY = '#ffffff';

const BUTTON_BG_SECONDARY = '#ffffff';
const BUTTON_COLOR_SECONDARY = '#3a9def';

const BUTTON_BG_TERTIARY = '#2d2d30';
const BUTTON_COLOR_TERTIARY = '#ffffff';

const BUTTON_BG_WARNING = '#ffc963';
const BUTTON_COLOR_WARNING = '#000';

const BUTTON_BG_DANGER = '#dc3446';
const BUTTON_COLOR_DANGER = '#ffffff';

const DISABLED_BG = '#d2d2d6';
const DISABLED_COLOR = '#fff';

export const DefaultDisabledColors = {
  outline: {
    backgroundColor: 'transparent',
    borderColor: DISABLED_BG,
    color: DISABLED_BG,
  },
  solid: {
    backgroundColor: DISABLED_BG,
    borderColor: DISABLED_BG,
    color: DISABLED_COLOR,
  },
}

export const DefaultButtonColors: ButtonColors = [
  {
    name: 'primary',
    default: {
      outline: {
        backgroundColor: 'transparent',
        borderColor: BUTTON_BG_PRIMARY,
        color: BUTTON_BG_PRIMARY,
      },
      solid: {
        backgroundColor: BUTTON_BG_PRIMARY,
        borderColor: BUTTON_BG_PRIMARY,
        color: BUTTON_COLOR_PRIMARY,
      }
    },
    disabled: DefaultDisabledColors,
  },
  {
    name: 'secondary',
    default: {
      outline: {
        backgroundColor: 'transparent',
        borderColor: BUTTON_BG_SECONDARY,
        color: BUTTON_BG_SECONDARY,
      },
      solid: {
        backgroundColor: BUTTON_BG_SECONDARY,
        borderColor: BUTTON_BG_SECONDARY,
        color: BUTTON_COLOR_SECONDARY,
      }
    },
    disabled: DefaultDisabledColors,
  },
  {
    name: 'tertiary',
    default: {
      outline: {
        backgroundColor: 'transparent',
        borderColor: BUTTON_BG_TERTIARY,
        color: BUTTON_BG_TERTIARY,
      },
      solid: {
        backgroundColor: BUTTON_BG_TERTIARY,
        borderColor: BUTTON_BG_TERTIARY,
        color: BUTTON_COLOR_TERTIARY,
      }
    },
    disabled: DefaultDisabledColors,
  },
  {
    name: 'warning',
    default: {
      outline: {
        backgroundColor: 'transparent',
        borderColor: BUTTON_BG_WARNING,
        color: BUTTON_BG_WARNING,
      },
      solid: {
        backgroundColor: BUTTON_BG_WARNING,
        borderColor: BUTTON_BG_WARNING,
        color: BUTTON_COLOR_WARNING,
      }
    },
    disabled: DefaultDisabledColors,
  },
  {
    name: 'danger',
    default: {
      outline: {
        backgroundColor: 'transparent',
        borderColor: BUTTON_BG_DANGER,
        color: BUTTON_BG_DANGER,
      },
      solid: {
        backgroundColor: BUTTON_BG_DANGER,
        borderColor: BUTTON_BG_DANGER,
        color: BUTTON_COLOR_DANGER,
      }
    },
    disabled: DefaultDisabledColors,
  },
]

export const Container = styled(Animated.View)`
  flex-grow: 1;
  margin-top: 10px;
`;

export const ButtonBox = styled(Animated.View)`
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  height: 60px;
  border-radius: 30px;
`;

export const ButtonText = styled(Animated.Text)`
  font-size: 18px;
  height: ${Platform.OS === 'ios' ? '18' : '28'}px;
  font-weight: 500;
`;
