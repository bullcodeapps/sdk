import AsyncStorage from '@react-native-community/async-storage';
import {
  createRef,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Keyboard, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request, requestMultiple, RESULTS } from 'react-native-permissions';

import { Position } from '../utils';

type PersistedStateResponse<T> = [T, Dispatch<SetStateAction<T>>, boolean];
type PositionError = string;
type PositionHookProps = Position & {
  permissionGranted: boolean;
  error: PositionError;
  getCurrentPosition: () => Promise<Position & { error: PositionError }>;
};

export const usePosition = (disableRealtimePosition?: boolean): PositionHookProps => {
  // Refs
  const interval = useRef<NodeJS.Timeout>();

  // State
  const [position, setPosition] = usePersistedState<Position>('@Position:usePosition:position', {
    latitude: null,
    longitude: null,
  });

  const [error, setError] = usePersistedState<string>('@Position:usePosition:error', null);
  const [permissionGranted, setPermissionGranted] = usePersistedState<boolean>(
    '@Position:usePosition:permissionGranted',
    false,
  );

  const onChange = useCallback(
    ({ coords }: Geolocation.GeoPosition) => {
      if (!coords?.latitude || !coords?.longitude) {
        return;
      }
      setError(null);
      setPosition({
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      });
    },
    [setError, setPosition],
  );

  const onError = useCallback(
    (err: Geolocation.GeoError) => {
      setError(err?.message);
    },
    [setError],
  );

  useEffect(() => {
    async function ask() {
      if (Platform.OS === 'android') {
        const granted = await requestMultiple([
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ]);
        setPermissionGranted(
          granted[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED ||
            granted[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === RESULTS.GRANTED,
        );
      } else {
        const granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        setPermissionGranted(granted === RESULTS.GRANTED);
      }
    }
    ask();
  }, [setPermissionGranted]);

  useEffect(() => {
    if (!permissionGranted || disableRealtimePosition) {
      return;
    }

    const geo = Geolocation;
    if (!geo) {
      setError('Geolocation is not supported');
      return;
    }

    interval.current = setInterval(() => {
      geo.getCurrentPosition(onChange, onError, {
        timeout: 1000 * 30,
        // enableHighAccuracy: true,
      });
    }, 1000 * 10);

    return () => {
      if (!interval?.current) {
        return;
      }
      clearInterval(interval.current);
    };
  }, [disableRealtimePosition, onChange, onError, permissionGranted, setError]);

  const getCurrentPosition = async (): Promise<Position & { error: PositionError }> => {
    const geo = Geolocation;
    if (!geo) {
      setError('Geolocation is not supported');
      return;
    }
    return new Promise((resolve, reject) => {
      geo.getCurrentPosition(
        ({ coords }) => {
          resolve({
            latitude: coords.latitude,
            longitude: coords.longitude,
            error: undefined,
          });
        },
        (e) => {
          resolve({
            latitude: undefined,
            longitude: undefined,
            error: e?.message,
          });
        },
        {
          timeout: 1000 * 30,
          // enableHighAccuracy: true,
        },
      );
    });
  };

  return { ...position, permissionGranted, error, getCurrentPosition };
};

export function usePersistedState<T>(key: string, initialState: T): PersistedStateResponse<T> {
  const [state, setState] = useState<T>(initialState);
  const [isReading, setIsReading] = useState<boolean>(true);

  const loadFromStorage = useCallback(async () => {
    const storageValue = await AsyncStorage.getItem(key);
    if (storageValue) {
      setState(JSON.parse(storageValue));
    }
    setIsReading(false);
    return storageValue;
  }, [key]);

  useEffect(() => {
    loadFromStorage();
  }, [key, loadFromStorage]); // eslint-disable-line react-hooks/exhaustive-deps

  const performSetState = useCallback(
    (value: SetStateAction<T>) => {
      async function setOnStorage() {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        setState(value);
      }
      setOnStorage();
    },
    [key],
  );

  return [state, performSetState, isReading];
}

export const useIsKeyboardShown = () => {
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);

  useEffect(() => {
    const handleKeyboardShow = () => setIsKeyboardShown(true);
    const handleKeyboardHide = () => setIsKeyboardShown(false);

    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', handleKeyboardShow);
      Keyboard.addListener('keyboardWillHide', handleKeyboardHide);
    } else {
      Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
      Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
    }

    return () => {
      if (Platform.OS === 'ios') {
        Keyboard.removeListener('keyboardWillShow', handleKeyboardShow);
        Keyboard.removeListener('keyboardWillHide', handleKeyboardHide);
      } else {
        Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
        Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
      }
    };
  }, []);

  return isKeyboardShown;
};
