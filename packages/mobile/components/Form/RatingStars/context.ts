import React, { useContext } from 'react';
import { RatingStarsStyles } from '@bullcode/mobile/components/Form/RatingStars/types';

export type RatingStarsContextType = { styles: RatingStarsStyles };

export const RatingStarsContext = React.createContext<RatingStarsContextType>({ styles: null });

export const setRatingStarsStyles = (styles: RatingStarsStyles) => {
  const ctx = useContext<RatingStarsContextType>(RatingStarsContext);
  ctx.styles = styles;
};

export const DefaultStyles: RatingStarsStyles = [
  {
    name: 'primary',
    default: {
      backgroundStarColor: '#bbc8cf',
      foregroundStarColor: '#ffc962',
    },
  },
];
