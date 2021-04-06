import React, { Ref, useCallback } from 'react';
import { FlatList, FlatListProps, RefreshControl, ViewStyle } from 'react-native';

import { EmptyListContainer, EmptyListIconContainer, Loading, NoDataText, StyledFlatlist } from './styles';

export type ListPropsType<itemT = any> = {
  ref?: Ref<FlatList<itemT>>;
  outerRef?: Ref<FlatList<itemT>>;
  isRefreshing?: boolean;
  isLoadingMore?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
} & FlatListProps<itemT>;

export type ListComponentType<itemT = any> = React.FunctionComponent<ListPropsType<itemT>>;

export type DefaultEmptyListContainerProps = {
  emptyIcon?: React.ReactNode;
  noResultsText?: string;
  style?: ViewStyle;
};

export const DefaultEmptyListContainer: React.FC<DefaultEmptyListContainerProps> = ({
  emptyIcon,
  noResultsText,
  style,
}) => (
  <EmptyListContainer style={style}>
    <EmptyListIconContainer>{emptyIcon}</EmptyListIconContainer>
    <NoDataText>{noResultsText}</NoDataText>
  </EmptyListContainer>
);

const Component: ListComponentType = ({
  outerRef,
  data = [],
  isRefreshing,
  isLoadingMore,
  onRefresh,
  onLoadMore,
  ...rest
}) => {
  const handleRefreshList = useCallback(() => {
    onRefresh && onRefresh();
  }, [onRefresh]);

  const handleLoadMore = useCallback(() => {
    onLoadMore && onLoadMore();
  }, [onLoadMore]);

  return (
    <StyledFlatlist
      ref={outerRef}
      data={data instanceof Array ? data : []}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={isLoadingMore && <Loading />}
      refreshControl={
        <RefreshControl enabled={!!onRefresh} refreshing={isRefreshing} onRefresh={handleRefreshList} />
      }
      keyExtractor={(item, index) => index?.toString()}
      {...rest}
    />
  );
};

const List: ListComponentType = React.forwardRef((props: ListPropsType, ref: Ref<FlatList>) => (
  <Component outerRef={ref} {...props} />
));

export default List;
