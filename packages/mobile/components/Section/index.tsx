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
      <SectionTitle style={titleStyle}>{title}</SectionTitle>
      {children}
    </Container>
  );
};

export default Section;
