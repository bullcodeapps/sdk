import styled from 'styled-components/native';
import Text from '../StammText';
import Button from '../Button';

export const Container = styled.View`
  flex-grow: 1;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 3px 4px 6px rgba(0, 0, 0, 0.15);
`;

export const Title = styled(Text)`
  padding-bottom: 20px;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
`;

export const Description = styled(Text)`
  padding-bottom: 20px;
  font-size: 18px;
`;

export const ActionButtons = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CancelButton = styled(Button)`
  height: 50px;
  margin-right: 20px;
`;

export const ConfirmButton = styled(Button)`
  height: 50px;
`;
