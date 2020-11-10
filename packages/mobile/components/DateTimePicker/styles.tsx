import styled from 'styled-components/native';
import ClockSvg from '@bullcode/core/assets/icons/clock.svg';
import CalendarSvg from '@bullcode/core/assets/icons/simple-calendar.svg';
import DefaultInput, { InputComponent } from '../../components/Form/Input';
import { FormFieldType } from '../../components/Form';
import { Animated, TextInput } from 'react-native';
import { ComponentType } from 'react';

export type FieldType = FormFieldType<Animated.AnimatedComponent<ComponentType<TextInput>>>;

export const ViewContainer = styled.View`
  flex-grow: 1;
  align-self: stretch;
`;

export const Input = styled(DefaultInput as InputComponent<FieldType>)``;

export const ModalViewTop = styled.TouchableOpacity`
  flex: 1;
`;

export const ModalViewMiddle = styled.View`
  height: 45px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  background-color: #f8f8f8;
  border-top-width: 1px;
  border-top-color: #dedede;
  z-index: 2;
`;

export const ChevronContainer = styled.View`
  flex-direction: row;
`;

export const ChevronUp = styled.View<{ active?: boolean }>`
  width: 15px;
  height: 15px;
  background-color: transparent;
  border-top-width: 1.5px;
  border-right-width: 1.5px;
  margin-left: 11px;
  transform: rotate(-45deg) translate(0px, 4px);
  border-color: ${(props) => (props.active ? '#007aff' : '#a1a1a1')};
`;

export const ChevronDown = styled.View<{ active?: boolean }>`
  width: 15px;
  height: 15px;
  background-color: transparent;
  border-top-width: 1.5px;
  border-right-width: 1.5px;
  margin-left: 22px;
  transform: rotate(135deg) translate(0px, -5px);
  border-color: ${(props) => (props.active ? '#007aff' : '#a1a1a1')};
`;

/**
 * Aqui devemos manter a fonte do dispositivo por se tratar de um componente que imita o componente nativo.
 */
export const ActionText = styled.Text`
  color: #007aff;
  font-weight: 600;
  font-size: 17px;
  padding-top: 1px;
  padding-right: 11px;
  padding-left: 11px;
`;

export const ModalViewBottom = styled.View`
  justify-content: center;
  background-color: #d0d4da;
`;

export const ClockIcon = styled(ClockSvg)`
  width: 20px;
  height: 20px;
`;

export const CalendarIcon = styled(CalendarSvg)`
  width: 20px;
  height: 20px;
`;
