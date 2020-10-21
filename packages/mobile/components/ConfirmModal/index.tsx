import React, { useEffect, useState } from 'react';

import { Container, Title, Description, ActionButtons, CancelButton, ConfirmButton } from './styles';
import { useTranslation } from 'react-i18next';
import { GestureResponderEvent } from 'react-native';
import { useModal } from '../Modal';
import { DefaultContainer } from '../../global-styles';

export type ConfirmModalProps = {
  title?: string;
  description?: string;
  danger?: boolean;
  loading?: boolean;
  cancelText?: string;
  confirmText?: string;
  onCancel?: (event: GestureResponderEvent) => void;
  onConfirm?: (event: GestureResponderEvent) => void;
};

const ConfirmModal = ({
  title: paramTitle,
  description,
  danger,
  loading,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  const { t } = useTranslation();
  const modal = useModal();

  // States
  const [title, setTitle] = useState(paramTitle);

  useEffect(() => {
    if (title === undefined) {
      setTitle('Você confirma?');
    }
  }, [t, title]);

  const handleOnCancel = (event: GestureResponderEvent) => {
    modal.hide();
    onCancel && onCancel(event);
  };

  const handleOnConfirm = (event: GestureResponderEvent) => {
    modal.hide();
    onConfirm && onConfirm(event);
  };

  return (
    <Container>
      <DefaultContainer>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        <ActionButtons>
          <CancelButton outline color="tertiary" onPress={handleOnCancel}>
            {(cancelText || 'Cancelar').toLowerCase()}
          </CancelButton>
          <ConfirmButton loading={loading} color={danger ? 'danger' : null} onPress={handleOnConfirm}>
            {(confirmText || 'Confirmar').toLowerCase()}
          </ConfirmButton>
        </ActionButtons>
      </DefaultContainer>
    </Container>
  );
};

export default ConfirmModal;
