import React from 'react';

import { Container } from './styles';
import { ActivityIndicator } from 'react-native';

const FullScreenLoading: React.FC = () => (
  <Container>
    <ActivityIndicator size="large" color={'#ffffff'} />
  </Container>
);

export default FullScreenLoading;
