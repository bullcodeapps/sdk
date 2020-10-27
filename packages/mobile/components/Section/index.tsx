import React from 'react';

import { Container, SectionTitle } from './styles';
import { TextStyle, ViewProps } from 'react-native';

const Section = ({
  title,
  children,
  titleStyle,
  ...rest
}: {
  title: string;
  children: any;
  titleStyle?: TextStyle;
} & ViewProps) => {
  return (
    <Container {...rest}>
      {typeof title === 'string' ? <SectionTitle style={titleStyle}>{title}</SectionTitle> : { title }}
      {children}
    </Container>
  );
};

export default Section;
