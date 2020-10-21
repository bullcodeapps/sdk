import * as Immutable from 'seamless-immutable';
import { UserLocationTypes } from './types';

const defaultState = {
  date: null,
  latitude: null,
  longitude: null,
};

export default function reducer(state = Immutable.from(defaultState), action) {
  switch (action.type) {
    case UserLocationTypes.CREATE_REQUEST:
      return {
        ...state,
        ...action.payload,
      };
    default: {
      return state;
    }
  }
}
