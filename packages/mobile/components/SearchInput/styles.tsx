import styled from 'styled-components/native';
import { Animated, TextInput, Platform } from 'react-native';
import SearchSvg from '../../../core/assets/icons/search.svg';
import CloseSearchSvg from '../../../core/assets/icons/search-close.svg';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const Container = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  overflow: visible;
`;

export const InputField = styled(AnimatedTextInput).attrs({
  placeholderTextColor: '#a3a3a3',
  selectionColor: '#3a9def',
})`
  flex: 1;
  color: #2d2d30;
  height: ${Platform.OS === 'ios' ? '40' : '45'}px;
  padding-left: 20px;
  padding-right: 40px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 20px;
  background-color: #f2f2f2;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  font-family: 'Gotham Rounded';
`;

export const SearchIconTouchable = styled.TouchableOpacity.attrs({
  hitSlop: { top: 25, right: 30, bottom: 25, left: 30 },
})``;

export const SearchIconsBox = styled.View`
  position: absolute;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-right: 15px;
  top: 0;
  right: 0;
  bottom: 0;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
`;

export const SearchIcon = styled(SearchSvg)`
  width: 20px;
  height: 20px;
  margin-left: 15px;
`;

export const CloseSearchIcon = styled(CloseSearchSvg)`
  width: 16px;
  height: 16px;
  margin-left: 15px;
`;
