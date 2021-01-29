import React, { useContext } from 'react';
import { SwitchColors } from './types';

export type SwitchContextType = { styles: SwitchColors };

export const SwitchContext = React.createContext<SwitchContextType>({ styles: null });

export const setSwitchStyles = (styles: SwitchColors) => {
  const ctx = useContext<SwitchContextType>(SwitchContext);
  ctx.styles = styles;
};
