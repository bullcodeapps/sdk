import React, { useEffect, useState } from 'react';

import { Container, Title, Description, ActionButtons, CancelButton, ConfirmButton } from './styles';
import { GestureResponderEvent } from 'react-native';
import { useModal } from '../Modal';
import { DefaultContainer } from '../../global-styles';

export type ConfirmModalProps = {
  title?: string;
  description?: string | React.ReactNode;
  danger?: boolean;
  loading?: boolean;
  cancelText?: string;
  confirmText?: string;
  cancelButtonColor?: string;
  confirmButtonColor?: string;
  onCancel?: (event: GestureResponderEvent) => void;
  onConfirm?: (event: GestureResponderEvent) => void;
};

const ConfirmModal = ({
  title: paramTitle,
  description,
  loading,
  cancelText,
  confirmText,
  cancelButtonColor,
  confirmButtonColor,
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  const modal = useModal();

  // States
  const [title, setTitle] = useState(paramTitle);

  useEffect(() => {
    if (title === undefined) {
      setTitle('Você confirma?');
    }
  }, [title]);

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
        {typeof description === 'string' ? <Description>{description}</Description> : description}
        <ActionButtons>
          <CancelButton outline theme={cancelButtonColor || 'cancel'} onPress={handleOnCancel}>
            {(cancelText || 'Cancelar').toLowerCase()}
          </CancelButton>
          <ConfirmButton loading={loading} theme={confirmButtonColor || 'danger'} onPress={handleOnConfirm}>
            {(confirmText || 'Confirmar').toLowerCase()}
          </ConfirmButton>
        </ActionButtons>
      </DefaultContainer>
    </Container>
  );
};

export default ConfirmModal;
