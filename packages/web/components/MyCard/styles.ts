import styled from 'styled-components';
import { Card, CardActions, CardContent } from '@material-ui/core';

export const CustomCard = styled(Card)`
  flex: 1;
`;

export const CustomCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

export const CustomCardActions = styled(CardActions)`
  justify-content: flex-end;
`;

export const CustomCardHeader = styled.div`
  margin-bottom: 16px;
  border-bottom: 1px solid #d3d3d3;
`;

export const CustomCardTitle = styled.p`
  font-size: 20px;
  font-weight: 400;
  color: #000000;
  margin-bottom: 2px;
`;
