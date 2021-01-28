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
import { Animated, Easing, ViewStyle } from 'react-native';

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

type AccordionProps = PropsWithChildren<{
  headerContent?: React.ReactNode;
  onChange?: (state: boolean) => void;
  expanded?: boolean | null;
  autoExpand?: boolean;
  color?: string;
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  arrowContainerStyle?: ViewStyle;
  arrowStyle?: ViewStyle;
  // This was done in this way to avoid the definition of height,
  // since the height is the Accordion that defines, because your body is of unlimited size
  contentContainerStyle?: Omit<ViewStyle, 'height'>;
  customHeader?: React.ReactNode;
  arrowDownIcon?: React.SVGProps<SVGSVGElement>;
}>;

const Accordion: React.FC<AccordionProps> = ({
  headerContent,
  onChange,
  expanded: propExpanded = null,
  autoExpand = false,
  color = 'primary',
  children,
  style,
  headerStyle,
  arrowContainerStyle,
  arrowStyle,
  contentContainerStyle,
  customHeader: CustomHeader = null,
  arrowDownIcon: ArrowDownIcon = null
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
    if ([null, undefined].includes(propExpanded)) {
      return;
    }

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
    <Container
      borderWidth={selectedColor?.default?.borderWidth}
      borderColor={selectedColor?.default?.borderColor}
      style={style}>
      {![null, undefined].includes(CustomHeader) ? CustomHeader : (
        <Header activeOpacity={0.8} onPress={handleAccordionOnPress} style={headerStyle}>
          <AccordionHeaderContent>{headerContent}</AccordionHeaderContent>
          <IndicatorIconContainer size={25} color={selectedColor?.default?.expandedIcon?.backgroundColor} style={arrowContainerStyle}>
            <IconWrapper style={{ transform: [{ rotateZ: arrowAngle }] }}>
              {![null, undefined].includes(ArrowDownIcon)
                ? ArrowDownIcon
                : <ChevronDownIcon color={selectedColor?.default?.expandedIcon?.iconColor} style={arrowStyle} />}
            </IconWrapper>
          </IndicatorIconContainer>
        </Header>
      )}
      <Content style={[{ height: bodyHeight }, contentContainerStyle]}>
        <BodyContainer onLayout={(event) => setBodySectionHeight(event.nativeEvent.layout.height)}>
          {children}
        </BodyContainer>
      </Content>
    </Container>
  );
};

export default memo(Accordion);
