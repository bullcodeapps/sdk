import { FormHandles, FormProps as DefaultFormProps, SubmitHandler } from '@unform/core';
import dot from 'dot-object';
import React, { forwardRef, Ref, useCallback, useEffect, useMemo, useRef } from 'react';
import { Keyboard } from 'react-native';
import * as Yup from 'yup';

import { useCombinedRefs } from '../../../core/hooks';
import { Container, Form as StyledForm } from './styles';

export type FormType = DefaultFormProps & FormHandles;
export type FormFieldType<T> = T & { validate: (val: any) => void; markAsDirty: () => void };

export type FormProps = {
  ref?: Ref<any>;
  outerRef?: Ref<FormType>;
  schema: Yup.ObjectSchema<any>;
  data?: any;
  onSubmit: (data: any) => void;
  onSubmitError: (error?: any, formData?: any) => void;
  onProgressChange?: (value: number) => void | React.Dispatch<React.SetStateAction<{}>>;
};

export type FormComponent = React.FC<FormProps>;

const Component: FormComponent = ({
  ref,
  outerRef,
  schema,
  data,
  children,
  onSubmit,
  onSubmitError,
  onProgressChange,
  ...other
}) => {
  const formRef = useRef<FormType>(null);
  const combinedRef = useCombinedRefs<FormType>(outerRef, formRef);
  const debounceHandlerRef = useRef<NodeJS.Timeout>();

  const requiredFields = useMemo(() => {
    const fields = [];
    Object.keys(schema.fields).forEach((fieldName: string) => {
      const value: any = schema.fields[fieldName];
      if (value?._exclusive?.required) {
        fields.push(fieldName);
      }
    });
    return fields;
  }, [schema?.fields]);

  const setDataToFields = useCallback(
    (d: any, append = '') => {
      try {
        Object.keys(d).forEach((key) => {
          let newKey = key;
          if (append && Number.isNaN(parseInt(key))) {
            newKey = `${append}.${key}`;
          } else if (append) {
            newKey = `${append}[${key}]`;
          }
          combinedRef.current.setFieldValue(newKey, d[key]);
          if (typeof d[key] === 'object') {
            setDataToFields(d[key], newKey);
          }
        });
      } catch (e) {}
    },
    [combinedRef],
  );

  useEffect(() => {
    if (!data) {
      return;
    }
    // timeout is a hackish way to fix fields population when fields are dynamically created
    setTimeout(() => setDataToFields(data), 200);
    combinedRef.current.setData(data);
  }, [data, combinedRef, setDataToFields]);

  const validate = useCallback(
    (formData: any) => {
      try {
        // Remove all previous errors
        combinedRef.current.setErrors({});
        schema.validateSync(formData, {
          abortEarly: false,
        });

        onProgressChange && onProgressChange(100);
        return schema.cast(formData);
      } catch (err) {
        const validationErrors: any = {};
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach((error) => {
            let lastPath = '';
            error?.path?.split('.').forEach((_path) => {
              const currentPath = lastPath?.length ? lastPath + `.${_path}` : _path;
              if (!!combinedRef.current.getFieldRef(currentPath)) {
                dot?.set(currentPath, error?.message, validationErrors);
                lastPath = currentPath;
              }
            });
          });
          combinedRef.current.setErrors(validationErrors);

          if (onProgressChange) {
            const matchFields = [];
            Object.keys(validationErrors).forEach((fieldName) => {
              if (requiredFields.includes(fieldName)) {
                matchFields.push(fieldName);
              }
            });

            const errorPercentage = (matchFields?.length / requiredFields.length) * 100;
            onProgressChange(100 - errorPercentage);
          }
          throw validationErrors;
        } else {
          throw err;
        }
      }
    },
    [combinedRef, onProgressChange, requiredFields, schema],
  );

  const applyRuleToAllFields = useCallback(
    (fieldAction?: (fieldRef?: any, fieldName?: any) => void, _fields?: object, _lastName = '') => {
      if (!schema?.fields && !_fields) {
        return;
      }

      const formData = combinedRef?.current?.getData();

      // if there are no fields coming from the recursion then we use the fields
      // from the first level of the schema.
      const fields = _fields || schema?.fields;
      const formDataKeys = Object.keys(fields);
      formDataKeys?.forEach((fieldName) => {
        // to get the correct name in dot notation to get the field reference,
        // we will use the previous name of the recursion
        const newFieldName = _lastName?.length ? _lastName + `.${fieldName}` : fieldName;
        const field = fields[fieldName];
        const fieldRef = combinedRef?.current?.getFieldRef(newFieldName);
        const fieldChildren = [null, undefined].includes(field?.fields) ? field?._subType?.fields : field?.fields;

        const fieldValue: Array<unknown> = dot?.pick(newFieldName, formData);
        // if there are fields at a lower level then let's go into recursion
        if (
          typeof fieldChildren === 'object' &&
          fieldValue?.length &&
          fieldChildren !== null &&
          Object.keys(fieldChildren)?.length
        ) {
          if (field?.type === 'array') {
            fieldValue?.forEach((item, _index) => {
              applyRuleToAllFields(fieldAction, fieldChildren, `${newFieldName}[${_index}]`);
            });
          } else if (fieldChildren?.type === 'children') {
            applyRuleToAllFields(fieldAction, fieldChildren, newFieldName);
          }
          return;
        }

        // if the field reference does not exist, then that field does not exist.
        // However, as you got here because of recursion, so let's just ignore it!
        if (!fieldRef) {
          return;
        }

        fieldAction && fieldAction(fieldRef, newFieldName);
      });
    },
    [combinedRef, schema?.fields],
  );

  const addAutoValidationToFields = useCallback(
    () =>
      applyRuleToAllFields((fieldRef, fieldName) => {
        fieldRef.validate = (value: any, ignoreDebounce?: boolean) => {
          if (debounceHandlerRef?.current) {
            clearTimeout(debounceHandlerRef.current);
          }
          // Avoid multiple and unnecessary validations
          debounceHandlerRef.current = setTimeout(
            () => {
              const formData = combinedRef?.current?.getData();
              // replaces in the formData object the value of this field with what comes by parameter
              if (
                ![null, undefined].includes(value) &&
                ![null, undefined].includes(fieldName) &&
                ![null, undefined].includes(formData) &&
                typeof formData === 'object'
              ) {
                if (!Object.isFrozen(dot?.pick(fieldName, formData))) {
                  dot?.set(fieldName, value, formData, true);
                }
              }

              try {
                validate(formData);
              } catch (e) {
                /*
                 * Errors are not dealt with here because they are the responsibility of inputs
                 */
              }
              if (debounceHandlerRef?.current) {
                clearTimeout(debounceHandlerRef.current);
              }
            },
            ignoreDebounce ? 0 : 350,
          );
        };
      }),
    [applyRuleToAllFields, combinedRef, validate],
  );

  useEffect(addAutoValidationToFields, [addAutoValidationToFields]);

  const setChildrenAsDirty = useCallback(
    () =>
      applyRuleToAllFields((fieldRef) => {
        fieldRef?.markAsDirty && fieldRef.markAsDirty();
      }),
    [applyRuleToAllFields],
  );

  const handleSubmit: SubmitHandler<any> = useCallback(
    async (formData: any) => {
      try {
        Keyboard.dismiss();
        setChildrenAsDirty();
        const res = validate(formData);
        onSubmit(res);
      } catch (err) {
        onSubmitError(err, formData);
      }
    },
    [onSubmit, onSubmitError, setChildrenAsDirty, validate],
  );

  return (
    <Container>
      <StyledForm ref={combinedRef} onSubmit={handleSubmit} initialData={data} children={children} {...other} />
    </Container>
  );
};

const Form: FormComponent = forwardRef((props: FormProps, ref: Ref<FormType>) => (
  <Component outerRef={ref} {...props} />
));

export default Form;
