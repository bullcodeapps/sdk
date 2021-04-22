import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useContext,
  memo,
  PropsWithChildren,
  useMemo,
} from 'react';
import { Animated, Easing, ViewStyle, StyleSheet } from 'react-native';

import {
  Container,
  Header,
  AccordionHeaderContent,
  IndicatorIconContainer,
  IconWrapper,
  ChevronDownIcon,
  Content,
  BodyContainer,
  AccordionStyles,
  DefaultColors,
} from './styles';

export type AccordionContextType = { colors: AccordionStyles };
export const AccordionContext = React.createContext<AccordionContextType>({ colors: null });

export const setAccordionColors = (colors: AccordionStyles) => {
  const ctx = useContext<AccordionContextType>(AccordionContext);
  ctx.colors = colors;
};

type CustomExpansionOptions = Omit<Animated.TimingAnimationConfig, 'toValue' | 'useNativeDriver'>;

type AccordionProps = PropsWithChildren<{
  headerContent?: React.ReactNode;
  customHeader?: React.ReactNode;
  arrowDownIcon?: React.SVGProps<SVGSVGElement>;
  autoExpand?: boolean;
  expansionAnimationOptions?: CustomExpansionOptions;
  color?: string;
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  arrowContainerStyle?: ViewStyle;
  arrowStyle?: ViewStyle;
  contentContainerStyle?: Omit<ViewStyle, 'height'>;
  expanded?: boolean;
  onChange?: (state: boolean) => void;
}>;

const Accordion: React.FC<AccordionProps> = ({
  headerContent,
  customHeader,
  arrowDownIcon,
  autoExpand = false,
  expansionAnimationOptions = {},
  color = 'primary',
  children,
  style,
  headerStyle,
  arrowContainerStyle,
  arrowStyle,
  contentContainerStyle,
  expanded: propExpanded,
  onChange,
}) => {
  // Refs
  const animatedController = useRef(new Animated.Value(0)).current;
  const ctx = useContext<AccordionContextType>(AccordionContext);

  // States
  const [lastPropExpanded, setLastPropExpanded] = useState<boolean>();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [bodySectionHeight, setBodySectionHeight] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const handleExpansion = useCallback(
    (newState?: boolean, options?: CustomExpansionOptions) => {
      Animated.timing(animatedController, {
        duration: 150,
        ...options,
        toValue: +newState,
        useNativeDriver: false,
      }).start();
      // this change of state cannot remain within the callback of the animation (when animation ends),
      // as this ensures that, when you touch the Accordion several times,
      // this animation continues where it left off, even before the previous animation ended.
      setExpanded(newState);
    },
    [animatedController],
  );

  const toggleExpand = useCallback(() => {
    const newExpandedValue = !expanded;
    handleExpansion(newExpandedValue);
  }, [expanded, handleExpansion]);

  useEffect(() => {
    if (isFirstRender && autoExpand) {
      setIsFirstRender(false);
      handleExpansion(true, {
        duration: 350,
        delay: 250,
        ...expansionAnimationOptions,
      });
    }
  }, [isFirstRender, autoExpand]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isFirstRender && autoExpand) {
      return;
    }
    if (![null, undefined]?.includes(propExpanded) && propExpanded !== lastPropExpanded) {
      setLastPropExpanded(propExpanded);
      handleExpansion(propExpanded, expansionAnimationOptions);
    }
  }, [autoExpand, expansionAnimationOptions, handleExpansion, isFirstRender, lastPropExpanded, propExpanded]);

  // It should not be triggered when re-rendering the component, so we ignore onChange as a dependency!
  useEffect(() => {
    onChange && onChange(expanded);
  }, [expanded]); // eslint-disable-line react-hooks/exhaustive-deps

  const bodyHeight = useMemo(
    () =>
      animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Math.floor(bodySectionHeight)],
        extrapolate: 'clamp',
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      }),
    [animatedController, bodySectionHeight],
  );

  const arrowAngle = useMemo(
    () =>
      animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: ['0rad', `${Math.PI}rad`],
      }),
    [animatedController],
  );

  const selectedColor = useMemo(() => {
    const colors = ctx?.colors || DefaultColors;
    const foundColor = colors.find((_color) => _color.name === color);
    if (!foundColor) {
      console.warn(
        `[Accordion] The "${color}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultColors[0];
    }

    // Overwrite default colors with global-styles
    return {
      ...foundColor,
      default: StyleSheet.flatten([DefaultColors[0].default, foundColor?.default]),
    };
  }, [color, ctx?.colors]);

  return (
    <Container
      style={[
        {
          borderBottomWidth: selectedColor?.default?.borderBottomWidth,
          borderBottomColor: selectedColor?.default?.borderBottomColor,
        },
        style,
      ]}>
      {customHeader || (
        <Header activeOpacity={0.8} onPress={toggleExpand} style={headerStyle}>
          <AccordionHeaderContent>{headerContent}</AccordionHeaderContent>
          <IndicatorIconContainer
            size={25}
            color={selectedColor?.default?.expandedIcon?.backgroundColor || '#d9dadb'}
            style={arrowContainerStyle}>
            <IconWrapper style={{ transform: [{ rotateZ: arrowAngle }] }}>
              {arrowDownIcon || (
                <ChevronDownIcon
                  color={selectedColor?.default?.expandedIcon?.iconColor || '#7a7a7b'}
                  style={arrowStyle}
                />
              )}
            </IconWrapper>
          </IndicatorIconContainer>
        </Header>
      )}
      <Content style={[contentContainerStyle, { height: bodyHeight }]}>
        <BodyContainer onLayout={(event) => setBodySectionHeight(event?.nativeEvent?.layout?.height)}>
          {children}
        </BodyContainer>
      </Content>
    </Container>
  );
};

export default memo(Accordion);
