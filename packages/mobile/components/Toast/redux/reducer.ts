import { ACTIONS } from './actions';

const DEFAULT_STATE = {
  message: null,
  error: false,
  warning: false,
  duration: null,
  reseter: false,
};

export default function reducer(state = DEFAULT_STATE, action) {
  const { payload, type } = action;

  switch (action.type) {
    case ACTIONS.HIDE:
      return {
        ...DEFAULT_STATE,
        reseter: state?.reseter,
      };
    case ACTIONS.DISPLAY_ERROR:
    case ACTIONS.DISPLAY_WARNING:
    case ACTIONS.DISPLAY_INFO:
      return {
        reseter: !state?.reseter,
        message: payload?.message,
        duration: payload?.duration,
        error: type === ACTIONS.DISPLAY_ERROR,
        warning: type === ACTIONS.DISPLAY_WARNING,
      };
    default:
      return state;
  }
}
