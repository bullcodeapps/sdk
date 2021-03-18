export type ToastState = {
  message: string;
  error: boolean;
  warning: boolean;
  duration: number;
  reseter?: boolean;
};