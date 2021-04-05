import React, { useContext } from 'react';
import { SuggestGooglePlacesStyles } from './types';

export type SuggestGooglePlacesContextType = { styles: SuggestGooglePlacesStyles };

export const SuggestGooglePlacesContext = React.createContext<SuggestGooglePlacesContextType>({ styles: null });

export const setSuggestGooglePlacesStyles = (styles: SuggestGooglePlacesStyles) => {
  const ctx = useContext<SuggestGooglePlacesContextType>(SuggestGooglePlacesContext);
  ctx.styles = styles;
};

export const DefaultStyles: SuggestGooglePlacesStyles = [
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
  },
];
