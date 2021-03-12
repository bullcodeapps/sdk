import React, { useContext } from 'react';
import { TextTypes } from './types';

export type TextContextType = {
  types: TextTypes;
};

export const TextContext = React.createContext<TextContextType>({ types: null });

export const setTextTypes = (types: TextTypes) => {
  const ctx = useContext<TextContextType>(TextContext);
  ctx.types = types;
};
