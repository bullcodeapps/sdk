import React, { useRef, useEffect, useState } from 'react';
import { SendTwoTone } from '@material-ui/icons';
import { Form } from '../Form';
import { isSameDay } from 'date-fns';
import * as Yup from 'yup';
import IMessage from './Message';

import { formatTime, formatDateWithTime } from '../../../core/utils';

import Menu from './Menu';

import {
  Container, MessagesWrapper, Message, Username, SendWrapper, Input, Button,
} from './styles';

export enum UserStatusEnum {
  ACTIVE,
  BLOCKED,
  DELETED,
  PENDING_ACTIVATION
}

interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  status: UserStatusEnum;
}

interface Props {
  messages?: IMessage[];
  currentUser: User;
  onMessageEdit?: (message: IMessage) => void;
  onMessageDelete?: (message: IMessage) => void;
  onNewMessage?: (message: IMessage) => void;
  onNewMessageError?: () => void;
  authedUserMessage?: string;
  sendMessageText?: string;
  sendButtonText?: string;
  editButtonText?: string;
  deleteButtonText?: string;
  textConfirmDelete?: string;
  saveButtonText?: string;
  cancelButtonText?: string;
  editMessageTitle?: string;
}

type InputProps = Props;

const colors = ['rgba(140, 197, 245, 0.2)', '#fafafa'];

const getColors = {
  CURRENT: () => 'rgba(215, 252, 246, 0.2)',
  RANDOM: (arr?: string[]) => (arr ? arr[Math.floor((Math.random()) * arr.length)] : colors[Math.floor((Math.random()) * colors.length)]),
};

export default function Chat({
  messages,
  currentUser,
  onMessageEdit,
  onMessageDelete,
  onNewMessage,
  onNewMessageError,
  authedUserMessage = 'Você',
  sendMessageText = 'Envie uma mensagem',
  sendButtonText = 'Enviar',
  editButtonText = 'Editar',
  deleteButtonText = 'Deletar',
  textConfirmDelete = 'Deseja deletar o item selecionado?',
  saveButtonText = 'Salvar',
  cancelButtonText = 'Cancelar',
  editMessageTitle = 'Alterar mensagem',
}: InputProps) {
  const formRef = useRef(null);
  const [baseMessages, setBaseMessages] = useState();

  const schema = Yup.object().shape({
    message: Yup.string().required()
  })

  function formatDateTime(date: Date) {
    const formattedDate = new Date(date);
    formattedDate.setHours(0);
    formattedDate.setMinutes(0);

    const formattedNow = new Date();
    formattedNow.setHours(0);
    formattedNow.setMinutes(0);

    if (isSameDay(formattedDate, formattedNow)) {
      return formatTime(String(date));
    }

    return formatDateWithTime(String(date));
  }

  useEffect(() => {
    const newMessages = messages?.reduce((accumulator: any, current: IMessage) => {
      const date = current.createdAt && formatDateTime(current.createdAt);

      if (!accumulator) {
        return [
          {
            user: current.user,
            messages: [
              {
                id: current.id,
                message: current.message,
                date,
              },
            ],
          },
        ];
      }

      const prev = accumulator[accumulator.length - 1];
      if (prev?.user.id === current?.user.id) {
        prev.messages.push({
          id: current.id,
          message: current.message,
          date,
        });
        return accumulator;
      }

      const userExist = accumulator.find((acc: any) => acc.user.id === current.user.id);

      let bgColor = '';

      if (userExist) {
        bgColor = userExist.user.bgColor;
      } else if (accumulator !== []) {
        const usedColors = accumulator.map((acc: any) => acc.user.bgColor);
        const newColors = colors.filter((c: any) => !usedColors.includes(c));
        bgColor = getColors[current.user.id === currentUser.id ? 'CURRENT' : 'RANDOM'](newColors);
      } else {
        bgColor = getColors[current.user.id === currentUser.id ? 'CURRENT' : 'RANDOM']();
      }

      return [
        ...accumulator,
        {
          user: {
            ...current.user,
            bgColor,
          },
          messages: [
            {
              id: current.id,
              message: current.message,
              date,
            },
          ],
        },
      ];
    }, []);
    setBaseMessages(newMessages);
  }, [currentUser.id, messages]);

  function handleSubmit() {
    const userMessage = formRef !== null && (formRef as any).current.getFieldRef('message').value;
    if (!userMessage) {
      return;
    }

    const message: IMessage = {
      user: currentUser,
      message: userMessage,
    };

    if (onNewMessage) {
      onNewMessage(message);
    }

    (formRef as any).current.setFieldValue('message', '');
  }

  function submitForm() {
    (formRef as any).current.submitForm();
  }

  return (
    <Container>
      <MessagesWrapper>
        {baseMessages?.map((m: any) => (
          <>
            {m.user.id === currentUser.id ? (
              <Username position="right">{authedUserMessage}</Username>
            ) : (
                <Username position="left">{m.user.name}</Username>
              )}
            {m.messages.map((message: any) => (
              <Message
                key={message.id}
                backgroundColor={m.user.bgColor || ''}
                pPosition={m.user.id === currentUser.id ? 'left' : 'right'}
                spanPosition={m.user.id === currentUser.id ? 'right' : 'left'}
              >
                <div className="message">
                  <p>{message.message}</p>
                  <div className="menu">
                    <Menu
                      message={message}
                      onMessageEdit={onMessageEdit}
                      onMessageDelete={onMessageDelete}
                      editButtonText={editButtonText}
                      deleteButtonText={deleteButtonText}
                      textConfirmDelete={textConfirmDelete}
                      saveButtonText={saveButtonText}
                      cancelButtonText={cancelButtonText}
                      editMessageTitle={editMessageTitle}
                    />
                  </div>
                </div>
                <span>
                  {message.date}
                </span>
              </Message>
            ))}
          </>
        ))}
      </MessagesWrapper>

      {onNewMessage && (
        <SendWrapper>
          <Form schema={schema} onSubmit={handleSubmit} onSubmitError={onNewMessageError} ref={formRef}>
            <Input
              name="message"
              placeholder={sendMessageText}
              autoComplete="off"
              multiline
              rowsMax="5"
            />
            <Button type="button" onClick={submitForm}>
              {sendButtonText}
              <SendTwoTone />
            </Button>
          </Form>
        </SendWrapper>
      )}
    </Container>
  );
}
