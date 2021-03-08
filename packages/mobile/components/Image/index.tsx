import React, { memo, useState, Ref, useRef, useCallback } from 'react';
import { StyleSheet, Animated, StyleProp, ImageStyle } from 'react-native';
import FastImage, { FastImageProps, Source } from 'react-native-fast-image';
import { useCombinedRefs } from '@bullcode/core/hooks';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export type ImageProps<T = any> = {
  ref?: Ref<T & Animated.AnimatedComponent<typeof FastImage>>;
  outerRef?: Ref<T & Animated.AnimatedComponent<typeof FastImage>>;
  fastImageStyle?: StyleProp<ImageStyle>;
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

  const CachedImageMemoized = useCallback(
    () => (
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
    ),
    [combinedRef, onError, onLoad, source, otherProps],
  );

  return (
    <Animated.View style={[styles.container, style]}>
      {!hasError && ![null, undefined].includes((source as Source)?.uri) && <CachedImageMemoized />}
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
    position: 'absolute'
  },
});

const Image: ImageComponent = React.forwardRef(
  (props: ImageProps, ref: Ref<any & Animated.AnimatedComponent<typeof FastImage>>) => (
    <Component outerRef={ref} {...props} />
  ),
);

export default memo(Image);
