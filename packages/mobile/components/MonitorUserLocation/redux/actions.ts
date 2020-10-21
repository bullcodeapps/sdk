import { action } from 'typesafe-actions';
import { UserLocationTypes, UserLocation } from './types';
import { markActionsOffline } from 'redux-offline-queue';

const UserLocationActions = {
  createRequest: (payload: UserLocation) => action(UserLocationTypes.CREATE_REQUEST, payload),
};

markActionsOffline(UserLocationActions, ['createRequest']);

export default UserLocationActions;
