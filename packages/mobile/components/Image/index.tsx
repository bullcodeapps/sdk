import React, { memo, useState, useMemo, Ref, useRef } from 'react';
import { ViewStyle, StyleSheet, Animated } from 'react-native';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import { useCombinedRefs } from '../../../core/hooks';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export type ImageProps<T = any> = {
  ref?: Ref<T & Animated.AnimatedComponent<typeof FastImage>>;
  outerRef?: Ref<T & Animated.AnimatedComponent<typeof FastImage>>;
  contentContainerStyle?: ViewStyle;
  renderPlaceholder?: () => {};
  renderErrorImage?: () => {};
  onError?: () => {};
  onLoad?: () => {};
} & FastImageProps;

export type ImageComponent = React.FC<ImageProps>;

const Component: ImageComponent = ({
  outerRef,
  contentContainerStyle,
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
        style={[styles.fastImage, otherProps.style]}
        {...otherProps}
        onError={() => {
          setLoading(false);
          setHasError(true);
          onError && onError();
        }}
        onLoad={(e) => {
          setLoading(false);
          onLoad && onLoad(e);
        }}
      />
    ),
    [combinedRef, onError, onLoad, otherProps],
  );

  return (
    <Animated.View style={[styles.container, contentContainerStyle]}>
      {CachedImageMemoized}
      {isLoading && renderPlaceholder && renderPlaceholder()}
      {hasError && renderErrorImage && renderErrorImage()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  fastImage: {
    flexGrow: 1,
  },
});

const Image: ImageComponent = React.forwardRef(
  (props: ImageProps, ref: Ref<any & Animated.AnimatedComponent<typeof FastImage>>) => (
    <Component outerRef={ref} {...props} />
  ),
);

export default memo(Image);
