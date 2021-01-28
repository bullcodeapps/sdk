import { createContext, useContext } from 'react';
import { TextStyle, ViewStyle } from 'react-native';

export type SectionContextType = { styles: SectionStyles };

export const SectionContext = createContext<SectionContextType>({ styles: null });

export type SectionContainersStyles = {
  container?: ViewStyle;
  titleStyle?: TextStyle;
  titleType?: string;
  contentContainerStyle?: ViewStyle;
};

export type SectionStyle = {
  name: string;
  default: SectionContainersStyles;
  sectionTitleComponent?: React.ReactNode;
};

export type SectionStyles = Array<SectionStyle>;

export const DEFAULT_SECTION_STYLES: SectionStyles = [{
  name: 'default',
  default: {
    container: {
      flexGrow: 1,
      marginBottom: 10,
      marginTop: 20,
    },
    contentContainerStyle: {
      flexGrow: 1,
    },
  }
}];

export const setSectionStyles = (styles: SectionStyles) => {
  const ctx = useContext<SectionContextType>(SectionContext);
  ctx.styles = styles;
};