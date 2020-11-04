import React, { useEffect, useRef } from 'react';

import {
  Container,
  ListItemIndicatorList,
  ListItemIndicatorContent,
  IndicatorSliderBar,
  IndicatorDot,
  DEFAULT_INDICATOR_DOT_SIZE,
  DEFAULT_INDICATOR_DOT_MARGIN_RIGHT,
} from './styles';
import { Animated, Easing, ViewStyle } from 'react-native';
import { ListPropsType } from '@bullcode/mobile/components/List';

export type ListPageIndicatorProps = {
  contentContainerStyle?: ViewStyle;
  sliderBarStyle?: ViewStyle;
  dotStyle?: ViewStyle;
  currentListItemIndex: number;
  previousListItemIndex: number;
  listDataLength: number;
  indicatorDotSize?: number;
  indicatorDotMarginRight?: number;
} & Partial<ListPropsType>;

const ListPageIndicator: React.FC<ListPageIndicatorProps> = ({
  contentContainerStyle,
  sliderBarStyle,
  dotStyle,
  currentListItemIndex,
  previousListItemIndex,
  listDataLength,
  indicatorDotSize = DEFAULT_INDICATOR_DOT_SIZE,
  indicatorDotMarginRight = DEFAULT_INDICATOR_DOT_MARGIN_RIGHT,
  ...rest
}) => {
  // Refs
  const listItemBarAnim = useRef(new Animated.Value(0)).current;
  const listItemBarWidthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const indicatorAndMarginSize = indicatorDotSize + indicatorDotMarginRight;
    const listItemBarPosition = currentListItemIndex * indicatorAndMarginSize || 0;
    const time = 300;
    const itemsDiff = Math.abs(previousListItemIndex - currentListItemIndex);

    if (previousListItemIndex < currentListItemIndex) {
      // step back animation
      Animated.sequence([
        Animated.timing(listItemBarWidthAnim, {
          toValue: indicatorDotSize + (indicatorDotMarginRight + indicatorDotSize) * itemsDiff,
          duration: time / 2,
          useNativeDriver: false,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        }),
        Animated.parallel([
          Animated.timing(listItemBarAnim, {
            toValue: listItemBarPosition,
            duration: time / 2,
            useNativeDriver: false,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          }),
          Animated.timing(listItemBarWidthAnim, {
            toValue: indicatorDotSize,
            duration: time / 2,
            useNativeDriver: false,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          }),
        ]),
      ]).start();
    } else {
      // step forward animation
      Animated.sequence([
        Animated.parallel([
          Animated.timing(listItemBarWidthAnim, {
            toValue: indicatorDotSize + (indicatorDotMarginRight + indicatorDotSize) * itemsDiff,
            duration: time / 2,
            useNativeDriver: false,
          }),
          Animated.timing(listItemBarAnim, {
            toValue: listItemBarPosition,
            duration: time / 2,
            useNativeDriver: false,
          }),
        ]),
        Animated.timing(listItemBarWidthAnim, {
          toValue: indicatorDotSize,
          duration: time / 2,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [
    previousListItemIndex,
    listItemBarAnim,
    listItemBarWidthAnim,
    indicatorDotSize,
    indicatorDotMarginRight,
    currentListItemIndex,
  ]);

  return (
    <Container style={contentContainerStyle}>
      <ListItemIndicatorList
        horizontal
        bounces={false}
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        data={[...new Array(listDataLength)]}
        renderItem={({ index }) => (
          <ListItemIndicatorContent>
            {index === 0 && (
              <IndicatorSliderBar
                style={[
                  {
                    height: indicatorDotSize,
                    width: listItemBarWidthAnim || indicatorDotSize,
                    transform: [
                      {
                        translateX: listItemBarAnim,
                      },
                    ],
                  },
                  sliderBarStyle,
                ]}
              />
            )}
            <IndicatorDot
              style={[
                {
                  width: indicatorDotSize,
                  height: indicatorDotSize,
                  marginRight: indicatorDotMarginRight,
                },
                dotStyle,
              ]}
            />
          </ListItemIndicatorContent>
        )}
        {...rest}
      />
    </Container>
  );
};

export default ListPageIndicator;
