import { TextStyle } from 'react-native';
import { GlobalStyle } from '../../../types';

export type SuggestGooglePlacesCustomStyles = {
  selectionColor: string;
  placeholder: string;
};

export type SuggestGooglePlacesStateStyles = SuggestGooglePlacesCustomStyles & TextStyle;

export interface SuggestGooglePlacesStyle extends GlobalStyle {
  name: string;
  default: SuggestGooglePlacesStateStyles;
  valid?: Partial<SuggestGooglePlacesStateStyles>;
  invalid?: Partial<SuggestGooglePlacesStateStyles>;
};

export type SuggestGooglePlacesStyles = Array<SuggestGooglePlacesStyle>;
