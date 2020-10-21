import React, { useEffect, useState, useRef, useCallback, memo } from 'react';

import { Container, ChipsBox, ChipButton, List } from './styles';
import { useField } from '@unform/core';
import { ChipsListComponent, ChipButtonData, ChipsListTypes, ChipListValue } from './types';

const ChipsList: ChipsListComponent = ({
  name,
  type = ChipsListTypes.HORIZONTAL_INLINE,
  options: originalOptions = [],
  initialData = [],
  multiple = false,
  buttonStyle,
  buttonTextStyle,
  onChange,
  fillWhenActive,
  ...rest
}) => {
  // States
  const [value, setValue] = useState<ChipListValue>(initialData);
  const { fieldName, registerField } = useField(name);
  const [options, setOptions] = useState([]);

  // Refs
  const componentRef = useRef(null);

  const reset = useCallback(() => {
    const opts = options.map((opt) => ({ ...opt, active: false }));
    setOptions(opts);
  }, [options]);

  useEffect(() => {
    registerField<ChipListValue>({
      name: fieldName,
      ref: componentRef.current,
      clearValue: reset,
      setValue: (ref, val: ChipListValue) => {
        const opts = originalOptions.map((opt: ChipButtonData) => {
          const active = Array.isArray(val) ? (val as any).indexOf(opt.value) > -1 : val === opt.value;
          return {
            ...opt,
            active,
          };
        });
        setOptions(opts);
        setValue(val);
      },
      getValue: () => value,
    });
  }, [fieldName, originalOptions, registerField, reset, value]);

  useEffect(() => {
    const opts = originalOptions.map((opt) => ({
      ...opt,
      active: typeof opt?.active === 'boolean' ? opt?.active : false,
    }));
    setOptions(opts);
  }, [originalOptions]);

  useEffect(() => {
    componentRef?.current?.validate && componentRef.current.validate(value);
  }, [value]);

  const toggleActive = useCallback(
    (item: ChipButtonData) => {
      let opts = options;
      const index = opts.findIndex((o) => o.value === item.value);
      if (!multiple && !opts[index].active) {
        opts = options.map((opt) => ({ ...opt, active: false }));
      }
      opts[index].active = !opts[index].active;

      const selecteds = opts?.filter((chipButtonData) => chipButtonData.active === true);
      let val: any = selecteds.map((sel) => sel.value);
      if (!multiple) {
        val = selecteds.length > 0 ? selecteds[0].value : null;
      }

      setOptions(opts);
      setValue(val);
      onChange && onChange(val);
    },
    [multiple, onChange, options],
  );

  return (
    <Container ref={componentRef}>
      {type !== ChipsListTypes.SCATTERED && (
        <List
          horizontal
          showsHorizontalScrollIndicator={false}
          data={options instanceof Array ? options : []}
          renderItem={({ item }) => (
            <ChipButton
              containerStyle={buttonStyle}
              textStyle={buttonTextStyle}
              active={item?.active}
              type={type}
              onPress={() => !item?.disabled && toggleActive(item)}
              fillWhenActive={fillWhenActive}
              disabled={item?.disabled}>
              {item.label}
            </ChipButton>
          )}
          keyExtractor={(item, index) => index.toString()}
          {...rest}
        />
      )}
      {/*
       * It is necessary to keep this type separate from FlatList,
       * because FlatList does not allow to use a flex-wrap in VirtualizedList (ContentContainerStyle)
       */}
      {type === ChipsListTypes.SCATTERED && (
        <ChipsBox {...rest}>
          {options?.map((item, index) => (
            <ChipButton
              key={index}
              active={item?.active}
              type={type}
              onPress={() => toggleActive(item)}
              containerStyle={buttonStyle}
              fillWhenActive={fillWhenActive}>
              {item.label}
            </ChipButton>
          ))}
        </ChipsBox>
      )}
    </Container>
  );
};

export default memo(ChipsList);
