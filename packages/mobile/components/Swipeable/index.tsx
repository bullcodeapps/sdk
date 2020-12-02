import React, { useState, useEffect, useRef, useMemo, memo, Ref, useCallback } from 'react';

import {
  Container,
  Row,
  Content,
  ActionsContainer,
  ActionWrapper,
  EditRightAction,
  EditIcon,
  DeleteRightAction,
  TrashCanIcon,
} from './styles';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

import { Animated, Easing } from 'react-native';
import { useCombinedRefs } from '../../../core/hooks';
import Touchable from '../Touchable';
import { windowWidth } from '../../global-styles';

type RowData = {
  item: any;
  index: number;
};

export type SwipeableRef = {
  closeActions: () => void;
};

type SwipeableProps = {
  outerRef?: Ref<SwipeableRef>;
  ref?: Ref<SwipeableRef>;
  waitFor?: ((instance: any) => void) | React.RefObject<any> | React.Ref<any>[];
  children: any;
  leftActions?: Array<React.ReactNode>;
  rightActions?: Array<React.ReactNode>;
  lockSwipeToRight: boolean;
  lockSwipeToLeft?: boolean;
  useActionsQuickDemo: boolean;
  onFastAction: (data: RowData) => void;
} & RowData;

export const EditAction = (props) => {
  return (
    <Touchable {...props}>
      <EditRightAction>
        <EditIcon />
      </EditRightAction>
    </Touchable>
  );
};

export const DeleteAction = (props) => (
  <Touchable {...props}>
    <DeleteRightAction>
      <TrashCanIcon />
    </DeleteRightAction>
  </Touchable>
);

type SwipeableComponent = React.FC<SwipeableProps>;

const Component: SwipeableComponent = ({
  outerRef,
  waitFor,
  children,
  leftActions,
  rightActions,
  item,
  index,
  lockSwipeToRight,
  lockSwipeToLeft,
  useActionsQuickDemo,
  onFastAction,
}) => {
  // Pre-processors
  const visibleActionsContainerWidthArray = rightActions?.map(() => {
    return new Animated.Value(0);
  });
  const animationIsRunningByIndexArray = rightActions?.map(() => {
    return false;
  });

  // States
  const [rightSwipeTransition] = useState(new Animated.Value(0));
  const [swipeOpened, setSwipeOpened] = useState<boolean>(false);
  const [beganPositionX, setBeganPositionX] = useState<number>(0);
  const [visibleActionsContainerWidth] = useState<Array<Animated.Value>>(visibleActionsContainerWidthArray);
  const [fastActionReached, setFastActionReached] = useState<boolean>(false);

  const closeActions = () => {
    setSwipeOpened(false);
    rightSwipeTransition.setValue(0);
    return;
  };

  // Refs
  const animationIsRunningByIndex = useRef<Array<boolean>>(animationIsRunningByIndexArray);
  const componentRef = useRef<SwipeableRef>();
  const combinedRefs = useCombinedRefs<SwipeableRef>(outerRef, componentRef);
  combinedRefs.current = {
    closeActions,
  };

  const actionsLength = useMemo(() => rightActions.length, [rightActions?.length]);
  const actionsWidth = useMemo(() => actionsLength * 70, [actionsLength]);

  const Actions = ({ actions }: { actions: Array<React.ReactNode> }) => (
    <ActionsContainer>
      {actions?.map((Action: any, actionIndex) => (
        <ActionWrapper
          key={actionIndex}
          style={{
            transform: [
              {
                translateX: visibleActionsContainerWidth[actionIndex],
              },
            ],
          }}>
          {Action && <Action item={item} index={index} />}
        </ActionWrapper>
      ))}
    </ActionsContainer>
  );

  const handleOnStateChange = useCallback(
    (e: PanGestureHandlerStateChangeEvent) => {
      const currentState = e.nativeEvent.state;
      if (currentState === State.BEGAN) {
        setBeganPositionX(e.nativeEvent.absoluteX);
      }
      if (
        currentState === State.END ||
        currentState === State.CANCELLED ||
        currentState === State.FAILED ||
        currentState === State.UNDETERMINED
      ) {
        const diff = e.nativeEvent.absoluteX - beganPositionX;
        if ((!leftActions || lockSwipeToRight) && !swipeOpened && diff >= 0) {
          return;
        }

        if ((!rightActions || lockSwipeToRight) && lockSwipeToLeft && !swipeOpened && diff <= 0) {
          return;
        }

        const excess = diff - actionsWidth;
        const containerWidth = Math.abs(swipeOpened ? excess : diff);
        if (containerWidth > windowWidth * 0.8) {
          rightActions.forEach((action, index) => {
            visibleActionsContainerWidth[index].setValue(0);
          });
          rightSwipeTransition.setValue(0);
          setSwipeOpened(false);
          onFastAction && onFastAction({ item, index });
          return;
        }
        const isDecreasing = diff < 0;
        if (diff < -50) {
          rightActions.forEach((action, index) => {
            if (index === 0) {
              return;
            }
            animationIsRunningByIndex.current[index] = true;
            Animated.timing(visibleActionsContainerWidth[index], {
              toValue: (actionsWidth / actionsLength) * index,
              duration: 75,
              easing: Easing.ease,
              useNativeDriver: true,
            }).start(() => {
              animationIsRunningByIndex.current[index] = false;
            });
          });
          Animated.timing(rightSwipeTransition, {
            toValue: -actionsWidth,
            duration: 100,
            useNativeDriver: true,
          }).start();
          setSwipeOpened(true);
          return;
        } else if (isDecreasing) {
          rightActions.forEach((action, index) => {
            if (index === 0) {
              return;
            }
            animationIsRunningByIndex.current[index] = true;
            Animated.timing(visibleActionsContainerWidth[index], {
              toValue: 0,
              duration: 75,
              easing: Easing.ease,
              useNativeDriver: true,
            }).start(() => {
              animationIsRunningByIndex.current[index] = false;
            });
          });
          Animated.timing(rightSwipeTransition, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }).start();
          setSwipeOpened(false);
          return;
        }
        if (diff > 20) {
          rightActions.forEach((action, index) => {
            if (index === 0) {
              return;
            }
            animationIsRunningByIndex.current[index] = true;
            Animated.timing(visibleActionsContainerWidth[index], {
              toValue: 0,
              duration: 75,
              easing: Easing.ease,
              useNativeDriver: true,
            }).start(() => {
              animationIsRunningByIndex.current[index] = false;
            });
            return;
          });
          Animated.timing(rightSwipeTransition, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }).start();
          setSwipeOpened(false);
        }
      }
    },
    [
      actionsLength,
      actionsWidth,
      beganPositionX,
      index,
      item,
      leftActions,
      lockSwipeToLeft,
      lockSwipeToRight,
      onFastAction,
      rightActions,
      rightSwipeTransition,
      swipeOpened,
      visibleActionsContainerWidth,
    ],
  );

  const firstTime = useRef(true);
  useEffect(() => {
    if (firstTime.current) {
      firstTime.current = false;
      return;
    }
    ReactNativeHapticFeedback.trigger('impactMedium', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  }, [fastActionReached]);

  useEffect(() => {
    if (useActionsQuickDemo) {
      setTimeout(() => {
        rightActions.forEach((action, index) => {
          if (index === 0) {
            return;
          }
          Animated.timing(visibleActionsContainerWidth[index], {
            toValue: (actionsWidth / actionsLength) * index,
            duration: 225,
            easing: Easing.ease,
            useNativeDriver: true,
          }).start();
        });
        Animated.timing(rightSwipeTransition, {
          toValue: -actionsWidth,
          duration: 300,
          useNativeDriver: true,
        }).start();
        setSwipeOpened(true);
        setTimeout(() => {
          rightActions.forEach((action, index) => {
            if (index === 0) {
              return;
            }
            Animated.timing(visibleActionsContainerWidth[index], {
              toValue: 0,
              duration: 150,
              easing: Easing.ease,
              useNativeDriver: true,
            }).start();
          });
          Animated.timing(rightSwipeTransition, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
          setSwipeOpened(false);
        }, 1000);
      }, 300);
    }
  }, [useActionsQuickDemo]); // eslint-disable-line

  const createAnimations = useCallback(
    (diff, excess) => {
      const containerWidth = Math.abs(swipeOpened ? excess : diff);
      if (containerWidth >= windowWidth * 0.999) {
        rightSwipeTransition.setValue(-windowWidth);
        return;
      }
      if (containerWidth >= windowWidth * 0.8) {
        if (!animationIsRunningByIndex.current[actionsLength - 1] && !fastActionReached) {
          setFastActionReached(true);
          animationIsRunningByIndex.current[actionsLength - 1] = true;
          Animated.timing(visibleActionsContainerWidth[actionsLength - 1], {
            toValue: 0,
            duration: 300,
            easing: Easing.bezier(0.11, 0.47, 0.4, 0.86),
            useNativeDriver: true,
          }).start(() => {
            animationIsRunningByIndex.current[actionsLength - 1] = false;
          });
        }
      } else {
        if (fastActionReached && !animationIsRunningByIndex.current[actionsLength - 1]) {
          setFastActionReached(false);
          animationIsRunningByIndex.current[actionsLength - 1] = true;
          Animated.timing(visibleActionsContainerWidth[actionsLength - 1], {
            toValue: (containerWidth / actionsLength) * (actionsLength - 1),
            duration: 300,
            easing: Easing.bezier(0.11, 0.47, 0.4, 0.86),
            useNativeDriver: true,
          }).start(() => {
            animationIsRunningByIndex.current[actionsLength - 1] = false;
          });
        }
        if (!fastActionReached && !animationIsRunningByIndex.current[actionsLength - 1]) {
          visibleActionsContainerWidth[actionsLength - 1]?.setValue(
            (containerWidth / actionsLength) * (actionsLength - 1),
          );
        }
        rightActions.forEach((action, index) => {
          const isLastIndex = index === actionsLength - 1;
          if (!isLastIndex) {
            visibleActionsContainerWidth[index].setValue((containerWidth / actionsLength) * index);
          }
        });
      }
      rightSwipeTransition.setValue(swipeOpened ? excess : diff);
    },
    [
      actionsLength,
      fastActionReached,
      rightActions,
      rightSwipeTransition,
      swipeOpened,
      visibleActionsContainerWidth,
    ],
  );

  const handleLineSwipeEvent = useCallback(
    (e: PanGestureHandlerGestureEvent) => {
      if (e.nativeEvent.state === State.ACTIVE) {
        const diff = e.nativeEvent.absoluteX - beganPositionX;
        if ((!leftActions || lockSwipeToRight) && !swipeOpened && diff >= 0) {
          return;
        }

        if ((!rightActions || lockSwipeToLeft) && !swipeOpened && diff <= 0) {
          return;
        }

        const excess = diff - actionsWidth;
        createAnimations(diff, excess);
      }
    },
    [
      actionsWidth,
      beganPositionX,
      createAnimations,
      leftActions,
      lockSwipeToLeft,
      lockSwipeToRight,
      rightActions,
      swipeOpened,
    ],
  );

  return (
    <Container>
      <PanGestureHandler
        minDist={10}
        failOffsetY={[-10, 10]}
        waitFor={waitFor}
        hitSlop={{ width: windowWidth, height: 70, top: 0, left: 0 }}
        onHandlerStateChange={handleOnStateChange}
        onGestureEvent={handleLineSwipeEvent}>
        <Row>
          <Content
            style={{
              transform: [{ translateX: rightSwipeTransition }],
            }}>
            {children}
            {leftActions && <Actions actions={leftActions} />}
            {rightActions && <Actions actions={rightActions} />}
          </Content>
        </Row>
      </PanGestureHandler>
    </Container>
  );
};

const Swipeable: SwipeableComponent = React.forwardRef(
  (props: SwipeableProps, ref: Ref<SwipeableRef>) => <Component outerRef={ref} {...props} />,
);

export default memo(Swipeable);
