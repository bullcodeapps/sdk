import React, {
  useRef, useEffect, useCallback, forwardRef,
} from 'react';
import { SubmitHandler, FormProps } from '@unform/core';
import { CircularProgress } from '@material-ui/core';
import * as Yup from 'yup';

import { Container, Form as StyledForm, LoadingOverlay } from './styles';
import { useCombinedRefs } from '../../../core/hooks';

interface Props {
  loading?: boolean;
  onSubmit: (data: any) => void;
  onSubmitError: (error: any) => void;
  schema: Yup.ObjectSchema<any>;
  data?: any;
  ref?: any;
}


function Form({
  loading,
  onSubmit,
  onSubmitError,
  schema,
  data,
  ...other
}: Props & FormProps, outerRef: any) {
  const formRef = useRef<any>(null);
  const combinedRef: any = useCombinedRefs(outerRef, formRef);

  const setDataToFields = useCallback((d: any, append = '') => {
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
    } catch (e) { } // eslint-disable-line
  }, [combinedRef]);

  useEffect(() => {
    if (!data) {
      return;
    }
    // timeout is a hackish way to fix fields population when fields are dynamically created
    setTimeout(() => setDataToFields(data), 200);
    combinedRef.current.setData(data);
  }, [data, combinedRef, setDataToFields]);

  const handleSubmit: SubmitHandler<any> = async (formData: any) => {
    try {
      // Remove all previous errors;
      combinedRef.current.setErrors({});
      await schema.validate(formData, {
        abortEarly: false,
      });

      onSubmit(schema.cast(formData));
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
      } else {
        throw err;
      }
      onSubmitError(validationErrors || err);
    }
  };

  return (
    <Container>
      {loading && <LoadingOverlay><CircularProgress /></LoadingOverlay>}
      <StyledForm ref={combinedRef} onSubmit={handleSubmit} initialData={data} {...other} />
    </Container>
  );
}

export default forwardRef(Form);
