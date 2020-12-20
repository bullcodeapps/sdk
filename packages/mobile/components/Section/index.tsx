import React, {Ref,FunctionComponent, memo, useContext} from 'react';

import { Container, SectionTitle, Content, SectiontStyles } from './styles';
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
  color?: string;
}

export type SectionComponent<T = any> = FunctionComponent<SectionProps<T>>;

const Component: SectionComponent = ({
  color = 'primary',
  outerRef,
  containerStyle,
  contentContainerStyle,
  containerProps,
  title,
  children,
  titleStyle,
  ...rest
}) => {
  return (
    <Container style={containerStyle} {...containerProps}>
      {typeof title === 'string' ? <SectionTitle style={titleStyle}>{title}</SectionTitle> : { title }}
      <Content style={contentContainerStyle}>
        {children}
      </Content>
    </Container>
  );
};

const Section: SectionComponent = React.forwardRef((props: SectionProps, ref: Ref<SectionRef>) => (
  <Component outerRef={ref} {...props} />
));

export default memo(Section);
