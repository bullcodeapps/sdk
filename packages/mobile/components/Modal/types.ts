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
  fullScreen?: boolean;
};

export type ModalState = {
  component: any;
  config: ModalConfig;
  visibility: boolean;
};

export type ModalComponentProps = {
  getState: () => ModalState,
  show: (component: any, config?: ModalConfig) => void;
  hide: () => void;
};
