import ToastContainer from './ToastContainer';
import { actions, actionCreators } from './redux/actions';
import reducer from './redux/reducer';

export {
  ToastContainer as Toast,
  actions as ToastActions,
  actionCreators as ToastActionsCreators,
  reducer as toastReducer,
};
