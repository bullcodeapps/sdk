import React, { useState, Ref, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, Animated, StyleProp, ImageStyle, ViewStyle } from 'react-native';
import FastImage, { FastImageProps, Source } from 'react-native-fast-image';
import { useCombinedRefs } from '@bullcode/core/hooks';

import { Content } from './styles';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export type ImageProps<T = any> = {
  ref?: Ref<T & Animated.AnimatedComponent<typeof FastImage>>;
  outerRef?: Ref<T & Animated.AnimatedComponent<typeof FastImage>>;
  fastImageStyle?: StyleProp<ImageStyle>;
  contentContainerStyle?: ViewStyle;
  renderPlaceholder?: React.FunctionComponent | React.NamedExoticComponent;
  renderErrorImage?: React.FunctionComponent | React.NamedExoticComponent;
  onError?: () => {};
  onLoad?: () => {};
} & FastImageProps;

export type ImageComponent = React.FC<ImageProps>;

const Component: ImageComponent = ({
  outerRef,
  fastImageStyle,
  style,
  contentContainerStyle,
  renderPlaceholder: PlaceholderComponent,
  renderErrorImage: ErrorImageComponent,
  onError,
  onLoad,
  source,
  ...otherProps
}: ImageProps) => {
  // Refs
  const inputRef = useRef<typeof FastImage>(null);
  const combinedRef = useCombinedRefs<typeof FastImage>(outerRef, inputRef);

  // States
  const [isLoading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if ([null, undefined].includes((source as Source)?.uri)) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [source])

  const CachedImageMemoized = useCallback(
    () => (
      <Content style={contentContainerStyle}>
        <AnimatedFastImage
          ref={combinedRef}
          style={[styles.fastImage, fastImageStyle]}
          {...otherProps}
          source={source}
          onError={() => {
            setLoading(false);
            setHasError(true);
            onError && onError();
          }}
          onLoad={(e) => {
            setLoading(false);
            setHasError(false);
            onLoad && onLoad(e);
          }}
        />
      </Content>
    ),
    [contentContainerStyle, combinedRef, fastImageStyle, otherProps, source, onError, onLoad],
  );

  return (
    <Animated.View style={[styles.container, style]}>
      {!hasError && <CachedImageMemoized />}
      {isLoading && PlaceholderComponent && <PlaceholderComponent />}
      {hasError && ErrorImageComponent && <ErrorImageComponent />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  fastImage: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});

const Image: ImageComponent = React.forwardRef(
  (props: ImageProps, ref: Ref<any & Animated.AnimatedComponent<typeof FastImage>>) => (
    <Component outerRef={ref} {...props} />
  ),
);

export default Image;
