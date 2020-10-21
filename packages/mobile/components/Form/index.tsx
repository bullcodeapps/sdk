import React, { useRef, useEffect, useCallback, forwardRef, useMemo } from 'react';
import { SubmitHandler, FormProps, FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { Container, Form as StyledForm } from './styles';
import { useCombinedRefs } from '../../../core/hooks';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ToastActionsCreators } from '../Toast';
import { Keyboard } from 'react-native';

interface Props {
  onSubmit: (data: any) => void;
  onSubmitError: (error?: any) => void;
  schema: Yup.ObjectSchema<any>;
  data?: any;
  ref?: any;
  onProgressChange?: (value: number) => void | React.Dispatch<React.SetStateAction<{}>>;
}

export type FormType = FormProps & FormHandles;
export type FormFieldType<T> = T & { validate: (val: any) => void };

function Form({ onSubmit, onSubmitError, schema, data, onProgressChange, ...other }: Props & FormProps, outerRef: any) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

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

      onSubmitError(validationErrors || err);
    }
  };

  return (
    <Container>
      <StyledForm ref={combinedRef} onSubmit={handleSubmit} initialData={data} {...other} />
    </Container>
  );
}

export default forwardRef(Form);
