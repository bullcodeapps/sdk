import { FunctionComponent } from 'react';

export type ChipListSingleValue = number | string | Date;

export type ChipListValue = ChipListSingleValue | Array<ChipListSingleValue>;

export type ChipButtonData = {
  id?: number;
  label: string;
  value: number | string | Date;
  active?: boolean;
  disabled?: boolean;
};

export enum ChipsListTypes {
  SCATTERED = 'scattered',
  HORIZONTAL_INLINE = 'horizontal-inline',
}

export type ChipsListProps<T> = {
  name?: string;
  type?: ChipsListTypes;
  options: ChipButtonData[];
  initialData?: ChipListValue;
  buttonStyle?: any;
  buttonTextStyle?: any;
  multiple?: boolean;
  onChange?: (data: ChipListValue) => void;
  fillWhenActive?: boolean;
};

export type ChipsListComponent<T = any> = FunctionComponent<ChipsListProps<T>>;
