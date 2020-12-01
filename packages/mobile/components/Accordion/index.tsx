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
}>;

const Accordion: React.FC<AccordionProps> = ({ headerContent, children, onChange }) => {
  // Refs
  const animatedController = useRef(new Animated.Value(0)).current;

  // States
  const [expanded, setExpanded] = useState<boolean>(false);
  const [bodySectionHeight, setBodySectionHeight] = useState(0);

  const toggleExpand = useCallback(() => {
    const newExpandedValue = !expanded;
    Animated.timing(animatedController, {
      duration: 150,
      toValue: +newExpandedValue,
      useNativeDriver: false,
    }).start();
    // this change of state cannot remain within the callback of the animation (when animation ends),
    // as this ensures that, when you touch the Accordion several times,
    // this animation continues where it left off, even before the previous animation ended.
    setExpanded(newExpandedValue);
  }, [animatedController, expanded]);

  const handleAccordionOnPress = useCallback(() => {
    toggleExpand();
  }, [toggleExpand]);

  const bodyHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bodySectionHeight],
    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
  });

  const arrowAngle = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0rad', `${Math.PI}rad`],
  });

  // It should not be triggered when re-rendering the component, so we ignore onChange as a dependency!
  useEffect(() => {
    onChange && onChange(expanded);
  }, [expanded]); // eslint-disable-line react-hooks/exhaustive-deps

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
