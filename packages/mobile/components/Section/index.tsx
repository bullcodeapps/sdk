import React, {Ref,FunctionComponent, memo, useContext, useMemo} from 'react';

import { Container, SectionTitle, Content, SectiontStyles, DefaultColors } from './styles';
import { TextStyle, ViewProps, ViewStyle } from 'react-native';

export type SectionContextType = { colors: SectiontStyles };

export const SectionContext = React.createContext<SectionContextType>({ colors: null });

export const setSectionStyles = () => {
  useContext<SectionContextType>(SectionContext);
};

export type SectionRef = {};

export interface SectionProps<T = any> {
  ref?: Ref<SectionRef>;
  outerRef?: Ref<SectionRef>;
  containerStyle?: any;
  contentContainerStyle?: ViewStyle;
  title: string;
  children: any;
  titleStyle?: TextStyle;
  containerProps?: ViewProps;
  style?: string;
  styleTitle?: string;
  contentStyle?: string;
}

export type SectionComponent<T = any> = FunctionComponent<SectionProps<T>>;

const Component: SectionComponent = ({
  style,
  styleTitle,
  contentStyle,
  outerRef,
  containerStyle,
  contentContainerStyle,
  containerProps,
  title,
  children,
  titleStyle,
  ...rest
}) => {
  const ctx = useContext<SectionContextType>(SectionContext);

  const selectedContainerColor = useMemo(() => {
    const colors = ctx?.colors || DefaultColors;
    const foundColor = colors.find((_color) => _color.name === style);
    if (!foundColor) {
      console.warn(
        `The "${style}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultColors[0];
    }
    return foundColor;
    
  }, [style, ctx?.colors]);

  const selectedContentColor = useMemo(() => {
    const colors = ctx?.colors || DefaultColors;
    const foundColor = colors.find((_color) => _color.name === contentStyle);
    if (!foundColor) {
      console.warn(
        `The "${contentStyle}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultColors[0];
    }
    return foundColor;
    
  }, [contentStyle, ctx?.colors]);

  const selectedTitleColor = useMemo(() => {
    const colors = ctx?.colors || DefaultColors;
    const foundColor = colors.find((_color) => _color.name === styleTitle);
    if (!foundColor) {
      console.warn(
        `The "${styleTitle}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultColors[0];
    }
    return foundColor;
    
  }, [styleTitle, ctx?.colors]);

  return (
    <Container style={[selectedContainerColor, containerStyle]} {...containerProps}>
      {typeof title === 'string' ? <SectionTitle style={[selectedTitleColor, titleStyle]}>{title}</SectionTitle> : { title }}
      <Content style={[selectedContentColor, contentContainerStyle]}>
        {children}
      </Content>
    </Container>
  );
};

const Section: SectionComponent = React.forwardRef((props: SectionProps, ref: Ref<SectionRef>) => (
  <Component outerRef={ref} {...props} />
));

export default memo(Section);
