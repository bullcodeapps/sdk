export const ACTIONS = {
  DISPLAY_ERROR: '@@TOAST/DISPLAY_ERROR',
  DISPLAY_WARNING: '@@TOAST/DISPLAY_WARNING',
  DISPLAY_INFO: '@@TOAST/DISPLAY_INFO',
  HIDE: '@@TOAST/HIDE',
};

const toastAction = (message, duration, type) => ({
  type,
  payload: {
    message,
    duration,
  },
});

const defaultDuration = 4000;

export const actionCreators = {
  hide() {
    return {
      type: ACTIONS.HIDE,
      payload: {},
    };
  },
  displayError(message, duration = defaultDuration) {
    return toastAction(message, duration, ACTIONS.DISPLAY_ERROR);
  },
  displayWarning(message, duration = defaultDuration) {
    return toastAction(message, duration, ACTIONS.DISPLAY_WARNING);
  },
  displayInfo(message, duration = defaultDuration) {
    return toastAction(message, duration, ACTIONS.DISPLAY_INFO);
  },
};
