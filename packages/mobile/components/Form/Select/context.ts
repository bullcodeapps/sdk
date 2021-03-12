import React, { useContext } from 'react';
import { SelectStyles } from '@bullcode/mobile/components/Form/Select/types';

export type SelectContextType = { styles: SelectStyles };

export const SelectContext = React.createContext<SelectContextType>({ styles: null });

export const setSelectStyles = (styles: SelectStyles) => {
  const ctx = useContext<SelectContextType>(SelectContext);
  ctx.styles = styles;
};

export const DefaultStyles: SelectStyles = [
  {
    name: 'primary',
    default: {
      selectionColor: '#3a9def',
      placeholder: '#b3c1c8',
      color: '#2d2d30',
      borderColor: '#b3c1c8',
      borderRadius: 25,
      dropdownIconColor: '#b3c1c8',
    },
    valid: {
      borderColor: '#3a9def',
      dropdownIconColor: '#b3c1c8',
    },
    invalid: {
      borderColor: '#ffc962',
      dropdownIconColor: '#b3c1c8',
    },
    disabled: {
      borderColor: '#b3c1c8',
      dropdownIconColor: '#b3c1c8',
    }
  },
];
