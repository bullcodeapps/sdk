import { all, call, put, spawn, take, takeLatest } from 'redux-saga/effects';
import NetInfo from '@react-native-community/netinfo';
import { OFFLINE, ONLINE } from 'redux-offline-queue';
import { eventChannel } from 'redux-saga';

export function* monitorNetworkConnectivity() {
  const channel = eventChannel((emmiter) => {
    const unsubscribe = NetInfo.addEventListener((state) => emmiter(state.isConnected));

    return () => unsubscribe();
  });

  try {
    while (true) {
      const isConnected = yield take(channel);
      if (isConnected) {
        yield put({ type: ONLINE });
      } else {
        yield put({ type: OFFLINE });
      }
    }
  } finally {
    channel.close();
  }
}

export default all([spawn(monitorNetworkConnectivity)]);
