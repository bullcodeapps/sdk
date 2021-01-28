import React, { Ref, FunctionComponent, memo, useContext, useMemo } from 'react';

import { Container, SectionTitle, Content } from './styles';
import { TextStyle, ViewProps, ViewStyle, View } from 'react-native';
import { DEFAULT_SECTION_STYLES, SectionContext, SectionContextType, SectionStyle } from './context';

type CustomProps = {
  theme?: string;
  outerRef?: Ref<View>;
  contentContainerStyle?: ViewStyle;
  title: string;
  children: any;
  titleStyle?: TextStyle;
  titleType?: string;
};

export type SectionProps<T = any> = CustomProps & ViewProps;

export type SectionComponent<T = any> = FunctionComponent<SectionProps<T>>;

const Component: SectionComponent = ({
  theme = 'default',
  outerRef,
  contentContainerStyle,
  title,
  children,
  titleStyle,
  titleType,
  ...rest
}) => {
  const ctx = useContext<SectionContextType>(SectionContext);

  const selectedStyle: SectionStyle = useMemo(() => {
    const styles = ctx?.styles || DEFAULT_SECTION_STYLES;
    const foundColor = styles?.find((_style) => _style.name === theme);
    if (!foundColor) {
      console.log(
        `The "${theme}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return DEFAULT_SECTION_STYLES[0];
    }
    return foundColor;
  }, [theme, ctx?.styles]);

  return (
    <Container {...rest} style={[selectedStyle?.default?.container, rest?.style]}>
      {selectedStyle?.sectionTitleComponent ? (
        selectedStyle?.sectionTitleComponent
      ) : typeof title === 'string' ? (
        <SectionTitle type={titleType || selectedStyle?.default?.titleType} style={[selectedStyle?.default?.titleStyle, titleStyle]}>{title}</SectionTitle>
      ) : (
        { title }
      )}
      <Content style={[selectedStyle?.default?.contentContainerStyle, contentContainerStyle]}>{children}</Content>
    </Container>
  );
};

const Section: SectionComponent = React.forwardRef((props: SectionProps, ref: Ref<View>) => (
  <Component outerRef={ref} {...props} />
));

export default memo(Section);
