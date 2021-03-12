import { Platform, PixelRatio } from 'react-native';

import analytics from '@react-native-firebase/analytics';

import { windowWidth } from '../global-styles';
import { GlobalStyle } from '../types';

export type WeekDays = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Position = {
  latitude: number;
  longitude: number;
};

// Based on iPhone 11 scale
const scale = windowWidth / 414;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

/**
 * This function is responsible to dispatch an event on Analytics.
 *
 * @param eventName Event name
 * @param data Custom data
 */
export async function logAnalyticsEvent(eventName: string, data?: any) {
  try {
    await analytics().logEvent(eventName, data);
  } catch (e) {
    console.log('Error on dispatch analytics logEvent: ', e);
  }
}

/**
 * This function is responsible to dispatch the current screen on Analytics.
 *
 * @param screen Screen Name
 */
export async function logCurrentScreenAnalyticsEvent(screen: string) {
  try {
    await analytics().setCurrentScreen(screen, screen);
  } catch (e) {
    console.log('Error on dispatch analytics setCurrentScreen: ', e);
  }
}

export function getStyleByValidity(validity: boolean, selectedStyle: GlobalStyle) {
  if (validity) {
    return selectedStyle?.valid || selectedStyle?.default;
  }
  return selectedStyle?.invalid || selectedStyle?.default;
}
