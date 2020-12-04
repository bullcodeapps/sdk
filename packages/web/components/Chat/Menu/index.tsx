import React, { useState } from 'react';

import { Menu as MuiMenu, MenuItem } from '@material-ui/core';

import { MoreVertTwoTone } from '@material-ui/icons';

import { useConfirm } from 'material-ui-confirm';
import IMessage from '../Message';

import EditMessageModal from '../EditMessage';

import {
  Container,
} from './styles';

interface Props {
  message: IMessage;
  onMessageEdit?: (message: IMessage) => void;
  onMessageDelete?: (message: IMessage) => void;
  editButtonText?: string;
  deleteButtonText?: string;
  textConfirmDelete?: string;
  saveButtonText?: string;
  cancelButtonText?: string;
  editMessageTitle?: string;
}

export default function Menu({
  message, onMessageEdit, onMessageDelete, editButtonText, deleteButtonText, textConfirmDelete, saveButtonText, cancelButtonText, editMessageTitle,
}: Props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const confirm = useConfirm();

  function handleOpenMenu(event: any) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleEdit() {
    setOpenEditModal(true);
    handleClose();
  }

  function handleCloseEditModal() {
    setOpenEditModal(false);
  }

  function handleDelete() {
    confirm({ description: textConfirmDelete })
      .then(() => onMessageDelete && onMessageDelete(message))
      .catch();
    handleClose();
  }

  return (
    <Container>
      {(onMessageEdit || onMessageDelete) || (onMessageEdit && onMessageDelete) ? (
        <>
          <button type="button" onClick={handleOpenMenu}>
            <MoreVertTwoTone />
          </button>
          <MuiMenu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {onMessageEdit && (
              <MenuItem onClick={handleEdit}>{editButtonText}</MenuItem>
            )}
            {onMessageDelete && (
              <MenuItem onClick={handleDelete}>{deleteButtonText}</MenuItem>
            )}
          </MuiMenu>
        </>
      ) : <></>}

      {onMessageEdit && (
        <EditMessageModal
          open={openEditModal}
          handleClose={handleCloseEditModal}
          message={message}
          onMessageEdit={onMessageEdit}
          saveButtonText={saveButtonText}
          cancelButtonText={cancelButtonText}
          editMessageTitle={editMessageTitle}
        />
      )}
    </Container>
  );
}
