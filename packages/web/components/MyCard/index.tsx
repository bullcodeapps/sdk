import React from 'react';

import { CardProps } from '@material-ui/core';
import {
  CustomCard, CustomCardContent, CustomCardActions, CustomCardHeader, CustomCardTitle,
} from './styles';

interface Props {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function MyCard({
  title, children, actions, ...other
}: Props & CardProps) {
  return (
    <CustomCard {...other}>
      <CustomCardContent>
        { title && (
          <CustomCardHeader>
            <CustomCardTitle>{title}</CustomCardTitle>
          </CustomCardHeader>
        )}
        {children}
      </CustomCardContent>
      <CustomCardActions>
        {actions}
      </CustomCardActions>
    </CustomCard>
  );
}
