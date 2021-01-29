import { createContext, useContext } from 'react';
import { InputStyles } from '@bullcode/mobile/components/Form/Input/types';

export type InputContextType = { styles: InputStyles };

export const InputContext = createContext<InputContextType>({ styles: null });

export const setInputStyles = (styles: InputStyles) => {
  const ctx = useContext<InputContextType>(InputContext);
  ctx.styles = styles;
};

export const DefaultStyles: InputStyles = [
  {
    name: 'primary',
    default: {
      selectionColor: '#3a9def',
      placeholder: '#b3c1c8',
      color: '#2d2d30',
      borderColor: '#b3c1c8',
      borderRadius: 25,
    },
    valid: {
      borderColor: '#3a9def',
    },
    invalid: {
      borderColor: '#ffc962',
    },
    validityMarkComponent: null,
    validityMark: {
      valid: {
        backgroundColor: '#3a9def',
        color: '#ffffff',
      },
      invalid: {
        backgroundColor: '#ffc962',
        color: '#ffffff',
      },
    },
  },
];
