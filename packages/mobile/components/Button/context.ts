import { createContext, useContext } from 'react';

import { ContextButtonStyles, ButtonStyleTypes } from '@bullcode/mobile/components/Button/types';

export type ButtonContextType = { colors: ContextButtonStyles };

export const ButtonContext = createContext<ButtonContextType>({ colors: null });

export const setButtonColors = (colors: ContextButtonStyles) => {
  const ctx = useContext<ButtonContextType>(ButtonContext);
  ctx.colors = colors;
};

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

export const DEFAULT_DISABLED_COLORS: ButtonStyleTypes = {
  outline: {
    buttonStyle: {
      backgroundColor: 'transparent',
      borderColor: DISABLED_BG,
    },
    textStyle: {
      backgroundColor: 'transparent',
      borderColor: DISABLED_BG,
      color: DISABLED_BG,
    },
  },
  solid: {
    buttonStyle: {
      backgroundColor: DISABLED_BG,
      borderColor: DISABLED_BG,
    },
    textStyle: {
      backgroundColor: DISABLED_BG,
      borderColor: DISABLED_BG,
      color: DISABLED_COLOR,
    },

  },
};

export const DEFAULT_BUTTON_COLORS: ContextButtonStyles = [
  {
    name: 'primary',
    default: {
      outline: {
        buttonStyle: {
          backgroundColor: 'transparent',
          borderColor: BUTTON_BG_PRIMARY,
          color: BUTTON_BG_PRIMARY,
        },
        textStyle: {
          backgroundColor: 'transparent',
          borderColor: BUTTON_BG_PRIMARY,
          color: BUTTON_BG_PRIMARY,
        },
      },
      solid: {
        buttonStyle: {
          backgroundColor: BUTTON_BG_PRIMARY,
          borderColor: BUTTON_BG_PRIMARY,
          color: BUTTON_COLOR_PRIMARY,
        },
        textStyle: {
          backgroundColor: BUTTON_BG_PRIMARY,
        borderColor: BUTTON_BG_PRIMARY,
        color: BUTTON_COLOR_PRIMARY,
        },
      }
    },
    disabled: DEFAULT_DISABLED_COLORS,
  },
  {
    name: 'secondary',
    default: {
      outline: {
        buttonStyle: {
          backgroundColor: BUTTON_BG_PRIMARY,
          borderColor: BUTTON_BG_PRIMARY,
          color: BUTTON_COLOR_PRIMARY,
        },
        textStyle: {
          backgroundColor: BUTTON_BG_PRIMARY,
          borderColor: BUTTON_BG_PRIMARY,
          color: BUTTON_COLOR_PRIMARY,
        },
      },
      solid: {
        buttonStyle: {
          backgroundColor: BUTTON_BG_SECONDARY,
          borderColor: BUTTON_BG_SECONDARY,
          color: BUTTON_COLOR_SECONDARY,
        },
        textStyle: {
          backgroundColor: BUTTON_BG_SECONDARY,
          borderColor: BUTTON_BG_SECONDARY,
          color: BUTTON_COLOR_SECONDARY,
        },
      }
    },
    disabled: DEFAULT_DISABLED_COLORS,
  },
  {
    name: 'tertiary',
    default: {
      outline: {
        buttonStyle: {
          backgroundColor: 'transparent',
          borderColor: BUTTON_BG_TERTIARY,
          color: BUTTON_BG_TERTIARY,
        },
        textStyle: {
          backgroundColor: BUTTON_BG_SECONDARY,
          borderColor: BUTTON_BG_SECONDARY,
          color: BUTTON_COLOR_SECONDARY,
        },
      },
      solid: {
        buttonStyle: {
          backgroundColor: 'transparent',
          borderColor: BUTTON_BG_TERTIARY,
          color: BUTTON_BG_TERTIARY,
        },
        textStyle: {
          backgroundColor: BUTTON_BG_TERTIARY,
          borderColor: BUTTON_BG_TERTIARY,
          color: BUTTON_COLOR_TERTIARY,
        },
      }
    },
    disabled: DEFAULT_DISABLED_COLORS,
  },
  {
    name: 'warning',
    default: {
      outline: {
        buttonStyle: {
          backgroundColor: 'transparent',
          borderColor: BUTTON_BG_WARNING,
          color: BUTTON_BG_WARNING,
        },
        textStyle: {
          backgroundColor: BUTTON_BG_TERTIARY,
          borderColor: BUTTON_BG_TERTIARY,
          color: BUTTON_COLOR_TERTIARY,
        },
      },
      solid: {
        buttonStyle: {
          backgroundColor: BUTTON_BG_WARNING,
          borderColor: BUTTON_BG_WARNING,
          color: BUTTON_COLOR_WARNING,
        },
        textStyle: {
          backgroundColor: BUTTON_BG_WARNING,
          borderColor: BUTTON_BG_WARNING,
          color: BUTTON_COLOR_WARNING,
        },
      }
    },
    disabled: DEFAULT_DISABLED_COLORS,
  },
  {
    name: 'danger',
    default: {
      outline: {
        buttonStyle: {
          backgroundColor: 'transparent',
          borderColor: BUTTON_BG_DANGER,
          color: BUTTON_BG_DANGER,
        },
        textStyle: {
          backgroundColor: 'transparent',
          borderColor: BUTTON_BG_DANGER,
          color: BUTTON_BG_DANGER,
        },
      },
      solid: {
        buttonStyle: {
          backgroundColor: BUTTON_BG_DANGER,
          borderColor: BUTTON_BG_DANGER,
          color: BUTTON_COLOR_DANGER,
        },
        textStyle: {
          backgroundColor: BUTTON_BG_DANGER,
          borderColor: BUTTON_BG_DANGER,
          color: BUTTON_COLOR_DANGER,
        },
      }
    },
    disabled: DEFAULT_DISABLED_COLORS,
  },
];

export default ButtonContext;
