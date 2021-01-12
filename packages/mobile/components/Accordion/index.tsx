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

import {
  Container,
  AccordionHeader,
  AccordionHeaderContent,
  AccordionChevronCircle,
  IconWrapper,
  ChevronDownIcon,
  AccordionContent,
  BodyContainer,
  AccordionStyles,
  DefaultColors,
} from './styles';
import { Animated, Easing } from 'react-native';

export type AccordionContextType = { colors: AccordionStyles };
export const AccordionContext = React.createContext<AccordionContextType>({ colors: null });

export const setAccordionColors = (colors: AccordionStyles) => {
  const ctx = useContext<AccordionContextType>(AccordionContext);
  ctx.colors = colors;
};

type AccordionProps = PropsWithChildren<{
  headerContent?: React.ReactNode;
  onChange?: (state: boolean) => void;
  expanded?: boolean;
  autoExpand?: boolean;
  color?: string;
}>;

const Accordion: React.FC<AccordionProps> = ({
  headerContent,
  onChange,
  expanded: propExpanded,
  autoExpand = false,
  color = 'primary',
  children,
}) => {
  // Refs
  const animatedController = useRef(new Animated.Value(0)).current;
  const ctx = useContext<AccordionContextType>(AccordionContext);

  // States
  const [expanded, setExpanded] = useState<boolean>(false);
  const [bodySectionHeight, setBodySectionHeight] = useState(0);

  const [isFirstRender, setIsFirstRender] = useState(true);

  const toggleExpand = useCallback((toValue: number) => {
    Animated.timing(animatedController, {
      duration: 150,
      toValue,
      useNativeDriver: false,
    }).start();
  }, [animatedController]);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    }
  }, [isFirstRender]);

  useEffect(() => {
    if (isFirstRender && propExpanded) {
      return;
    }

    setExpanded(propExpanded);
  }, [propExpanded, isFirstRender]);

  useEffect(() => {
    if (isFirstRender && autoExpand) {
      setTimeout(() => {
        toggleExpand(1);
        setExpanded(true);
      }, 150);
    }
  }, [autoExpand, isFirstRender]);

  const handleAccordionOnPress = useCallback(() => {
    const newExpandedValue = !expanded;

    // this change of state cannot remain within the callback of the animation (when animation ends),
    // as this ensures that, when you touch the Accordion several times,
    // this animation continues where it left off, even before the previous animation ended.
    setExpanded(newExpandedValue);
    onChange && onChange(newExpandedValue);
  }, [toggleExpand, expanded]);

  const bodyHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bodySectionHeight],
    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
  });

  const arrowAngle = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0rad', `${Math.PI}rad`],
  });

  useEffect(() => {
    toggleExpand(+expanded);
  }, [expanded]);

  const selectedColor = useMemo(() => {
    const colors = ctx?.colors || DefaultColors;
    const foundColor = colors.find((_color) => _color.name === color);
    if (!foundColor) {
      console.warn(
        `The "${color}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DefaultColors[0];
    }
    return foundColor;
  }, [color, ctx?.colors]);

  return (
    <Container borderWidth={selectedColor?.default?.borderWidth} borderColor={selectedColor?.default?.borderColor}>
      <AccordionHeader activeOpacity={0.8} onPress={handleAccordionOnPress}>
        <AccordionHeaderContent>{headerContent}</AccordionHeaderContent>
        <AccordionChevronCircle size={25} color={selectedColor?.default?.expandedIcon?.backgroundColor}>
          <IconWrapper style={{ transform: [{ rotateZ: arrowAngle }] }}>
            <ChevronDownIcon color={selectedColor?.default?.expandedIcon?.iconColor} />
          </IconWrapper>
        </AccordionChevronCircle>
      </AccordionHeader>
      <AccordionContent style={{ height: bodyHeight }}>
        <BodyContainer onLayout={(event) => setBodySectionHeight(event.nativeEvent.layout.height)}>
          {children}
        </BodyContainer>
      </AccordionContent>
    </Container>
  );
};

export default memo(Accordion);
