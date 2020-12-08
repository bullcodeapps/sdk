import React, { useRef, useEffect, useCallback, forwardRef, useMemo, Ref } from 'react';
import { SubmitHandler, FormProps as DefaultFormProps, FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { Container, Form as StyledForm } from './styles';
import { useCombinedRefs } from '../../../core/hooks';
import { Keyboard } from 'react-native';

export type FormType = DefaultFormProps & FormHandles;
export type FormFieldType<T> = T & { validate: (val: any) => void };

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
  onSubmit,
  onSubmitError,
  schema,
  data,
  onProgressChange,
  children,
  ...other
}) => {
  const formRef = useRef<FormType>(null);
  const combinedRef = useCombinedRefs<FormType>(outerRef, formRef);

  const requiredFields = useMemo(() => {
    let fields = [];
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
            validationErrors[error.path] = error.message;
            const dotIndex = error.path.lastIndexOf('.');
            if (dotIndex > -1) {
              validationErrors[error.path.substr(0, dotIndex)] = error.message;
            }
          });
          combinedRef.current.setErrors(validationErrors);

          if (onProgressChange) {
            let matchFields = [];
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

  const addAutoValidationToFields = useCallback(
    (objectSchema: Yup.ObjectSchema<any>) => {
      if (!objectSchema?.fields) {
        return;
      }
      Object.keys(objectSchema.fields)?.forEach((fieldName) => {
        const schemaField: any = objectSchema.fields[fieldName];
        const field = combinedRef?.current?.getFieldRef(fieldName);
        if (!field) {
          return;
        }
        field.validate = (value: any) => {
          const formData = combinedRef?.current?.getData();
          formData[fieldName] = value;

          try {
            validate(formData);
          } catch (e) {
            /*
             * Errors are not dealt with here because they are the responsibility of inputs
             */
          }
        };
        if (schemaField?.fields && Object.keys(schemaField?.fields)?.length > 0) {
          return addAutoValidationToFields(schemaField as Yup.ObjectSchema<any>);
        }
        return;
      });
    },
    [combinedRef, validate],
  );

  useEffect(() => {
    addAutoValidationToFields(schema);
  }, [addAutoValidationToFields, schema]);

  const handleSubmit: SubmitHandler<any> = async (formData: any) => {
    try {
      Keyboard.dismiss();
      const res = validate(formData);
      onSubmit(res);
    } catch (err) {
      const validationErrors = {};

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        combinedRef.current.setErrors(validationErrors);
      }

      onSubmitError(Object.keys(validationErrors).length > 0 ? validationErrors : err, formData);
    }
  };

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
