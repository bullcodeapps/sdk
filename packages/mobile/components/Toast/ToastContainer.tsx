import { connect } from 'react-redux';

import Toast from './Toast';
import { Dispatch, bindActionCreators } from 'redux';
import { actionCreators } from '@bullcode/mobile/components/Toast/redux/actions';

const mapStateToProps = (store) => store.toast;

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Toast);
