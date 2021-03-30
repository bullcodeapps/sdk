import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';

import { useDispatch } from 'react-redux';
import { usePosition } from '../../hooks';
import UserLocationActions from './redux/actions';

type MonitorUserLocationProps = {
  disable?: boolean;
};

const MonitorUserLocation: React.FC<MonitorUserLocationProps> = ({ disable }) => {
  const dispatch = useDispatch();

  const { longitude, latitude } = usePosition(disable);

  const onChangeLocation = useCallback(() => {
    if (!disable && longitude && latitude) {
      dispatch(
        UserLocationActions.createRequest({
          latitude,
          longitude,
          date: new Date(),
        }),
      );
    }
  }, [disable, dispatch, latitude, longitude]);

  useEffect(() => {
    const interval = setInterval(() => {
      onChangeLocation();
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  return <View />;
};

export default MonitorUserLocation;
