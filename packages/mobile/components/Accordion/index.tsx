import React, { useState, useCallback, useRef, useEffect, memo, PropsWithChildren } from 'react';

import {
  Container,
  AccordionHeader,
  AccordionHeaderContent,
  AccordionChevronCircle,
  IconWrapper,
  ChevronDownIcon,
  AccordionContent,
  BodyContainer,
} from './styles';
import { Animated, Easing } from 'react-native';

type AccordionProps = PropsWithChildren<{
  headerContent?: React.ReactNode;
  onChange?: (state: boolean) => void;
  expanded?: boolean;
  autoExpand?: boolean;
}>;

const Accordion: React.FC<AccordionProps> = ({ headerContent, children, onChange, expanded: propExpanded, autoExpand = false }) => {
  // Refs
  const animatedController = useRef(new Animated.Value(0)).current;

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

  return (
    <Container>
      <AccordionHeader activeOpacity={0.8} onPress={handleAccordionOnPress}>
        <AccordionHeaderContent>{headerContent}</AccordionHeaderContent>
        <AccordionChevronCircle size={25} color="#D9DADB">
          <IconWrapper style={{ transform: [{ rotateZ: arrowAngle }] }}>
            <ChevronDownIcon />
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
