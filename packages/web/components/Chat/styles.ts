import styled, { css } from 'styled-components';
import { Input as UnformInput } from '../Form';

export const Container = styled.div`
  border: 1px solid #f3f3f3;
  margin-top: 8px;
  margin-bottom: 4px;
  border-radius: 4px;
`;

export const MessagesWrapper = styled.div`
  max-height: 500px;
  overflow-y: auto;
  padding: 5px;
`;

export const Message = styled('div') <{ backgroundColor: string, pPosition: string, spanPosition: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border: 1px solid #f3f3f3;
  border-radius: 4px;
  margin-bottom: 8px;
  padding: 8px;

  > div {
    display: flex;
    align-items: center;

    p {
      width: 100%;
      color: #6f6f73;
      font-size: 16px;
      text-align: ${({ pPosition }) => pPosition};
      white-space: pre-line;
    }

    button {
      background: none;
      border: none;

      svg {
        color: #6f6f73;
      }
    }
  }

  span {
    width: 100%;
    color: #aaa;
    font-size: 12px;
    text-align: ${({ spanPosition }) => spanPosition}
  }

  .menu {
    display: none;
    position: absolute;
    top: 8px;
    right: 10px;
  }

  &:hover {
    .menu {
      display: block;
    }

    p {
      margin-right: 25px;
    }
  }
`;

export const Username = styled('p') <{ position: string }>`
  text-align: ${({ position }) => position};
  padding-top: 5px;
  padding-bottom: 5px;
  color: #2d2d30;
  font-weight: 500;

  ${({ position }) => (position === 'right' ? css`
    padding-right: 5px;
  ` : css`
    padding-left: 5px;
  `)};
`;

export const SendWrapper = styled.div`
  /* margin-top: 15px; */
  padding: 0 5px;
  border-top: 1px solid #f3f3f3;

  form {
    display: flex;
    align-items: center;
  }
`;

export const Input = styled(UnformInput)`
  width: 100%;
`;

export const Button = styled.button`
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    height: 39px;
    padding: 0 10px;
    background: no-repeat;
    border: 1px solid #bdbdbd;
    border-radius: 4px;
    margin-left: 10px;
    font-size: 0;
    font-weight: bold;
    color: #6f6f73;

    svg {
      font-size: 24px;
      color: #613580;
      margin-left: 5px;
    }
  }

  @media (min-width: 769px) {
    display: flex;
    align-items: center;
    height: 39px;
    padding: 0 10px;
    background: no-repeat;
    border: 1px solid #bdbdbd;
    border-radius: 4px;
    margin-left: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #6f6f73;

    svg {
      font-size: 24px;
      color: #613580;
      margin-left: 5px;
    }
  }
`;
