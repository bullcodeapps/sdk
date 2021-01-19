import React, { memo, useState, useMemo, Ref, useRef } from 'react';
import { StyleSheet, Animated, StyleProp, ImageStyle } from 'react-native';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import { useCombinedRefs } from '@bullcode/core/hooks';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export type ImageProps<T = any> = {
  ref?: Ref<T & Animated.AnimatedComponent<typeof FastImage>>;
  outerRef?: Ref<T & Animated.AnimatedComponent<typeof FastImage>>;
  fastImageStyle?: StyleProp<ImageStyle>;
  renderPlaceholder?: () => {};
  renderErrorImage?: () => {};
  onError?: () => {};
  onLoad?: () => {};
} & FastImageProps;

export type ImageComponent = React.FC<ImageProps>;

const Component: ImageComponent = ({
  outerRef,
  fastImageStyle,
  style,
  renderPlaceholder,
  renderErrorImage,
  onError,
  onLoad,
  ...otherProps
}: ImageProps) => {
  // Refs
  const inputRef = useRef<typeof FastImage>(null);
  const combinedRef = useCombinedRefs<typeof FastImage>(outerRef, inputRef);

  // States
  const [isLoading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const CachedImageMemoized = useMemo(
    () => (
      <AnimatedFastImage
        ref={combinedRef}
        style={[styles.fastImage, fastImageStyle]}
        {...otherProps}
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
    [combinedRef, onError, onLoad, otherProps],
  );

  return (
    <Animated.View style={[styles.container, style]}>
      {!hasError && CachedImageMemoized}
      {isLoading && renderPlaceholder && renderPlaceholder()}
      {hasError && renderErrorImage && renderErrorImage()}
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
