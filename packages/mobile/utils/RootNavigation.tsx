import { createRef } from 'react';
import {
  NavigationContainerRef,
  NavigationContainerEventMap,
  EventListenerCallback,
  NavigationAction,
  NavigationState,
  PartialState,
  Route,
} from '@react-navigation/native';

export const isNavigationReadyRef = createRef<boolean>();

export const currentRouteHandler = createRef<NodeJS.Timeout>();
export const currentRouteCounter = createRef<number>();

export const navigateHandler = createRef<NodeJS.Timeout>();
export const navigateCounter = createRef<number>();

export const navigationRef = createRef<NavigationContainerRef>();
export const getRef = (): NavigationContainerRef => navigationRef?.current;
export const isReady = (): boolean =>
  !!getRef &&
  !!getRef().getRootState &&
  !!getRef().getRootState() &&
  !!getRef().getRootState().key &&
  isNavigationReadyRef?.current;

const persistGettingCurrentRoute = () =>
  new Promise<Route<string> | undefined>((resolve, reject) => {
    if (isReady()) {
      resolve(getRef()?.getCurrentRoute());
    } else {
      let count = 0;
      (currentRouteHandler as any).current = setInterval(() => {
        count += 1;
        if (isReady()) {
          resolve(getRef().getCurrentRoute());
        } else if (count === 5) {
          reject();
        }
      }, 500);
    }
  });

const RootNavigation = {
  getCurrentOptions: () => navigationRef?.current?.getCurrentOptions(),
  dispatch: (action: NavigationAction | ((state: NavigationState) => NavigationAction)) =>
    getRef().dispatch(action),
  addListener: <EventName extends Extract<keyof NavigationContainerEventMap, string>>(
    type: EventName,
    callback: EventListenerCallback<NavigationContainerEventMap, EventName>,
  ) => getRef()?.addListener(type, callback),
  removeListener: <EventName extends Extract<keyof NavigationContainerEventMap, string>>(
    type: EventName,
    callback: EventListenerCallback<NavigationContainerEventMap, EventName>,
  ) => getRef()?.removeListener(type, callback),
  getCurrentRoute: async () => {
    const currentRoute = await persistGettingCurrentRoute();
    if (currentRouteHandler?.current) {
      clearInterval(currentRouteHandler.current);
    }
    return currentRoute;
  },
  navigate: (name: string, params?: object) => {
    if (navigateCounter.current === 5) {
      return;
    }
    if (isReady()) {
      getRef()?.navigate(name, params);
      if (navigateHandler.current) {
        clearTimeout(navigateHandler.current);
      }
    } else {
      (navigateHandler as any).current = setTimeout(() => {
        (navigateCounter as any).current = (navigateCounter as any).current + 1;
        RootNavigation?.navigate(name, params);
        if (navigateHandler.current) {
          clearTimeout(navigateHandler.current);
        }
      }, 500);
    }
  },
  goBack: () => {
    if (navigateCounter.current === 5) {
      return;
    }
    if (isReady()) {
      getRef()?.goBack();
    } else {
      const handler = setTimeout(() => {
        (navigateCounter as any).current = (navigateCounter as any).current + 1;
        RootNavigation?.goBack();
        clearTimeout(handler);
      }, 500);
    }
  },
  getRootState: () => getRef()?.getRootState(),
  canGoBack: () => getRef()?.canGoBack(),
  resetRoot: (state?: PartialState<NavigationState> | NavigationState) => getRef()?.resetRoot(state),
};

export default RootNavigation;
