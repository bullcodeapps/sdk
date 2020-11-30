import React from 'react';
import {
  NavigationContainerRef,
  NavigationContainerEventMap,
  EventListenerCallback,
  NavigationAction,
  NavigationState,
} from '@react-navigation/native';

export const navigationRef = React.createRef<NavigationContainerRef>();
const getNavigation = (): NavigationContainerRef => navigationRef?.current;

const RootNavigation = {
  getCurrentOptions: () => navigationRef?.current?.getCurrentOptions(),
  dispatch: (action: NavigationAction | ((state: NavigationState) => NavigationAction)) =>
    getNavigation().dispatch(action),
  addListener: <EventName extends Extract<keyof NavigationContainerEventMap, string>>(
    type: EventName,
    callback: EventListenerCallback<NavigationContainerEventMap, EventName>,
  ) => getNavigation()?.addListener(type, callback),
  removeListener: <EventName extends Extract<keyof NavigationContainerEventMap, string>>(
    type: EventName,
    callback: EventListenerCallback<NavigationContainerEventMap, EventName>,
  ) => getNavigation()?.removeListener(type, callback),
  getCurrentRoute: () => getNavigation()?.getCurrentRoute(),
  navigate: (name: string, params?: object) => getNavigation()?.navigate(name, params),
  goBack: () => getNavigation()?.goBack(),
  getState: () => getNavigation()?.getRootState(),
  canGoBack: () => getNavigation()?.canGoBack(),
  resetRoot: () => getNavigation()?.resetRoot(),
};

export default RootNavigation;
