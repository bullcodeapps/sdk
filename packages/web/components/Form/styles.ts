import styled from 'styled-components';
import { Form as Unform } from '@unform/web';
import { FormControl as MUIFormControl, Chip as MUIChip } from '@material-ui/core';

export const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

export const FormControl = styled(MUIFormControl)`
  margin-bottom: 5px;

  .MuiSlider-valueLabel {
    text-align: center;
  }
`;

export const Form = styled(Unform)`
  label {
    display: block;
    font-size: 14px;
    font-weight: bold;
    margin: 3px 1px 5px;
  }

  span.error {
    color: #f44336;
  }
`;

export const LoadingOverlay = styled.div`
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

export const Chip = styled(MUIChip)`
  background-color: #3A9DEF;
  color: #fff;

  > svg {
    color: #fff;
  }
`;

export const LabelContainer = styled.div`
  position: relative;
  height: auto;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  gap: 4px;
`;

export const CustomLabel = styled.label`
  display: block;
  font-size: 10px !important;
  font-weight: normal !important;
`;
