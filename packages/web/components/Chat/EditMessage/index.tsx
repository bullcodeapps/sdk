import React, { useState } from 'react';

import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from '@material-ui/core';
import IMessage from '../Message';

import { Input } from '../../Form';

interface Props {
  open: boolean;
  handleClose: () => void;
  message: IMessage;
  onMessageEdit: (message: IMessage) => void;
  saveButtonText?: string;
  cancelButtonText?: string;
  editMessageTitle?: string;
}

export default function EditMessage({
  open, message, handleClose, onMessageEdit, saveButtonText, cancelButtonText, editMessageTitle,
}: Props) {
  const [newMessage, setNewMessage] = useState(message.message);

  function handleSave() {
    const updatedMessage: IMessage = {
      ...message,
      message: newMessage,
    };

    onMessageEdit(updatedMessage);
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{editMessageTitle}</DialogTitle>
      <DialogContent>
        <Input
          name="message"
          autoComplete="off"
          value={newMessage}
          onChange={(e: any) => setNewMessage(e.target.value)}
          multiline
          rows="5"
          rowsMax="15"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained" color="secondary">
          {saveButtonText}
        </Button>
        <Button onClick={handleClose} color="primary">
          {cancelButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
