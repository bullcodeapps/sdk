import React, { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import { Container, ActivationCodeContainer, ConfirmationInput, Display, Text } from './styles';

const CODE_LENGTH = new Array(6).fill(0);

interface ActivationCodeInputProps {
  value: string;
  onValueChange: Dispatch<SetStateAction<string>>;
}

const ActivationCodeInput: React.FC<ActivationCodeInputProps> = ({ value, onValueChange }) => {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const handleClick = useCallback(() => {
    inputRef?.current?.focus();
  }, []);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.nativeEvent.key === 'Backspace') {
        onValueChange((state) => value.slice(0, state.length - 1));
      }
    },
    [onValueChange, value],
  );

  const handleChange = useCallback(
    (text: string) => {
      if (value.length >= CODE_LENGTH.length) {
        return null;
      }
      const newValue = (value + text).slice(0, CODE_LENGTH.length);

      onValueChange(newValue);
    },
    [onValueChange, value],
  );

  const values = value.split('');

  const selectedIndex = values.length < CODE_LENGTH.length ? values.length : CODE_LENGTH.length - 1;

  const hideInput = !(values.length < CODE_LENGTH.length);

  return (
    <Container>
      <TouchableWithoutFeedback onPress={handleClick} hitSlop={{ top: 25, left: 25, bottom: 25, right: 25 }}>
        <ActivationCodeContainer>
          <ConfirmationInput
            value=""
            ref={inputRef}
            onChangeText={handleChange}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            keyboardType="numeric"
            textContentType="oneTimeCode" // iOS Only
            importantForAutofill="auto"
            selectedIndex={selectedIndex}
            opacity={hideInput ? 0 : 1}
          />
          {CODE_LENGTH.map((v, index) => {
            const selected = values.length === index;
            const filled = values.length === CODE_LENGTH.length && index === CODE_LENGTH.length - 1;
            const removeBorder = index === CODE_LENGTH.length - 1;

            let previousIsFilled = values && values[index] !== undefined;

            return (
              <Display
                noBorderRight={removeBorder}
                isFilled={previousIsFilled}
                isFocused={(selected || filled) && focused}
                key={index}>
                <Text>{value[index] || ''}</Text>
              </Display>
            );
          })}
        </ActivationCodeContainer>
      </TouchableWithoutFeedback>
    </Container>
  );
};

export default ActivationCodeInput;
