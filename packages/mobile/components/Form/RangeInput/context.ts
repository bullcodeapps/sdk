import React, { useContext } from 'react';
import { RangeInputStyles } from '@bullcode/mobile/components/Form/RangeInput/types';

export type RangeInputContextType = { styles: RangeInputStyles };

export const RangeInputContext = React.createContext<RangeInputContextType>({ styles: null });

export const setRangeInputStyles = (styles: RangeInputStyles) => {
  const ctx = useContext<RangeInputContextType>(RangeInputContext);
  ctx.styles = styles;
};

export const DefaultStyles: RangeInputStyles = [
  {
    name: 'primary',
    marker: {
      defaultStyle: {
        backgroundColor: '#3a9def',
      },
      disabledStyle: {
        backgroundColor: '#d2d2d2',
      }
    },
    trackStyle: {
      backgroundColor: '#B2C1C8',
      height: 1,
    },
    selectedStyle: {
      backgroundColor: '#00f2d5',
    },
  },
];
