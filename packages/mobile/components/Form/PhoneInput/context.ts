import React, { useContext } from 'react';
import { PhoneInputStyles } from '@bullcode/mobile/components/Form/PhoneInput/types';

export type PhoneInputContextType = { styles: PhoneInputStyles };

export const PhoneInputContext = React.createContext<PhoneInputContextType>({ styles: null });

export const setPhoneInputStyles = (styles: PhoneInputStyles) => {
  const ctx = useContext<PhoneInputContextType>(PhoneInputContext);
  ctx.styles = styles;
};

export const DefaultStyles: PhoneInputStyles = [
  {
    name: 'primary',
    default: {
      input: {
        selectionColor: '#3a9def',
        placeholder: '#ffffff',
        color: '#2d2d30',
        borderColor: '#b3c1c8',
      },
      select: {
        placeholder: '#ffffff',
        color: '#ffffff',
        backgroundColor: '#3a9def',
      },
      borderRadius: 25,
    },
    valid: {
      input: {
        selectionColor: '#3a9def',
        placeholder: '#ffffff',
        color: '#2d2d30',
        borderColor: '#3a9def',
      },
      select: {
        placeholder: '#ffffff',
        color: '#ffffff',
        backgroundColor: '#3a9def',
      },
    },
    invalid: {
      input: {
        selectionColor: '#3a9def',
        placeholder: '#ffffff',
        color: '#2d2d30',
        borderColor: '#ffc962',
      },
      select: {
        placeholder: '#ffffff',
        color: '#ffffff',
        backgroundColor: '#3a9def',
      },
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
