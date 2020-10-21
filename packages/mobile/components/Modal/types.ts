export enum ModalAnimationEnum {
  NONE,
  BOUNCE,
  EASE,
}

export type ModalConfig = {
  animationSpeed?: number; // default: 0.5
  animation?: ModalAnimationEnum;
  backdropColor?: string;
  exitOnBackdrop?: boolean;
};

type StateType = {
  component: any;
  config: ModalConfig;
  visibility: boolean;
};

export type ModalComponent = {
  state: StateType;
  show: (component: any, config?: ModalConfig) => void;
  hide: () => void;
};
