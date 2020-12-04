import imageCompression from 'browser-image-compression';
import React, {
  ChangeEvent, useRef, useEffect, useCallback, useState,
} from 'react';
import { useField } from '@unform/core';
import { toast } from 'react-toastify';
import { FormControl } from './styles';

interface Props {
  name: string;
  label?: string;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  onUploadImage?: (formData: FormData) => void;
}
type InputProps = JSX.IntrinsicElements['input'] & Props;

export default function ImageInput({
  name,
  label,
  maxSizeMB = 2,
  maxWidthOrHeight = 1000,
  onUploadImage,
  ...rest
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    fieldName, registerField, defaultValue, error,
  } = useField(name);
  const [preview, setPreview] = useState(defaultValue);

  const handlePreview = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }

    const formData = new FormData();

    const options = {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker: true,
    };

    const compressedBlob = await imageCompression(file, options);
    const compressedFile = new File([compressedBlob], file.name, {
      type: compressedBlob.type,
    });

    const fileSize = Number(file.size / 1024 / 1024);
    const compressedFileSize = Number(compressedFile.size / 1024 / 1024);

    if (compressedFileSize > 2) {
      toast.error('Não foi possível processar o arquivo, tente novamente!');
      setPreview(null);
      return;
    }

    if (compressedFileSize > fileSize) {
      formData.append('file', file);
    } else {
      formData.append('file', compressedFile);
    }

    // await api.post('/v1/media-files', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });
    onUploadImage && onUploadImage(formData);

    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);
  }, [maxSizeMB, maxWidthOrHeight]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'files[0]',
      clearValue(ref: HTMLInputElement) {
        ref.value = '';
        setPreview(null);
      },
      setValue(_: HTMLInputElement, value: string) {
        setPreview(value);
      },
    });
  }, [fieldName, registerField]);

  return (
    <FormControl error={!!error}>
      {label && <label htmlFor={fieldName}>{label}</label>}

      { preview && <img src={preview} alt="Preview" width="100" /> }

      <input
        type="file"
        ref={inputRef}
        onChange={handlePreview}
        {...rest}
      />
    </FormControl>
  );
}
