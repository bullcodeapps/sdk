import styled from 'styled-components/native';
import { Form as Unform } from '@unform/mobile';

export const Container = styled.View``;

export const Form = styled(Unform)``;

export const LoadingOverlay = styled.View`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  padding-top: 150px;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  z-index: 99;
`;
