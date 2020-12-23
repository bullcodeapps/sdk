import React, { Ref, FunctionComponent, memo, useContext, useEffect, useMemo } from 'react';

import { Container, SectionTitle, Content, SectionStyles, SectionStyle, DefaultStyles } from './styles';
import { TextStyle, ViewProps, ViewStyle, View } from 'react-native';

export type SectionContextType = { styles: SectionStyles };

export const SectionContext = React.createContext<SectionContextType>({ styles: null });

export const setSectionStyles = (styles: SectionStyles) => {
  const ctx = useContext<SectionContextType>(SectionContext);
  ctx.styles = styles;
};

type CustomProps = {
  color?: string;
  outerRef?: Ref<View>;
  contentContainerStyle?: ViewStyle;
  title: string;
  children: any;
  titleStyle?: TextStyle;
};

export type SectionProps<T = any> = CustomProps & ViewProps;

export type SectionComponent<T = any> = FunctionComponent<SectionProps<T>>;

const Component: SectionComponent = ({
  color,
  outerRef,
  contentContainerStyle,
  title,
  children,
  titleStyle,
  ...rest
}) => {
  const ctx = useContext<SectionContextType>(SectionContext);

  const selectedStyle: SectionStyle = useMemo(() => {
    const colors = ctx?.styles || DefaultStyles;
    const foundColor = colors?.find((_color) => _color.name === color);
    if (!foundColor) {
      console.log(
        `The "${color}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultStyles[0];
    }
    return foundColor;
  }, [color, ctx?.styles]);

  return (
    <Container {...rest} style={[selectedStyle?.default?.container, rest?.style]}>
      {selectedStyle?.sectionTitleComponent ? (
        selectedStyle?.sectionTitleComponent
      ) : typeof title === 'string' ? (
        <SectionTitle style={[selectedStyle?.default?.titleStyle, titleStyle]}>{title}</SectionTitle>
      ) : (
        { title }
      )}
      <Content style={[selectedStyle?.default?.contentContainerStyle, contentContainerStyle]}>{children}</Content>
    </Container>
  );
};

const Section: SectionComponent = React.forwardRef((props: SectionProps, ref: Ref<View>) => (
  <Component outerRef={ref} {...props} />
));

export default memo(Section);
