import React, {
  useEffect, useState, useRef, useCallback,
} from 'react';
import {
  useDropzone, DropzoneProps, DropzoneRootProps,
} from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { useField } from '@unform/core';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { IconButton, LinearProgress, FormHelperText } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { FormControl } from './styles';

const getColor = (props: DropzoneRootProps) => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isDragActive) {
    return '#2196f3';
  }
  return '#eeeeee';
};

const DropzoneContainer = styled.div<DropzoneRootProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
  cursor: pointer;
`;

const ThumbsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const Thumb = styled.div`
  position: relative;
  display: inline-flex;
  border-radius: 2px;
  border: 1px solid #eaeaea;
  margin-bottom: 8px;
  margin-right: 8px;
  width: 150px;
  height: 150px;
  padding: 4px;
  box-sizing: border-box;
`;

const ThumbRemove = styled(IconButton)`
  position: absolute;
  top: 5px;
  right: 5px;
`;

const ThumbInner = styled.div`
  display: flex;
  min-width: 0;
  overflow: hidden;
`;

const ThumbImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Progress = styled(LinearProgress)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

interface Props {
  name: string;
  label?: string;
  helperText?: string;
  onAddFiles?: (file: any | any[]) => Promise<any[]>;
  onRemoveFile?: (file: any) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  selectImageText?: string;
  selectImagesText?: string;
  clickToSelectButtonText?: string;
  errorMessageOnUpload?: string;
}

interface ImageFile {
  id: number;
  name: string;
  url: string;
}

export default function ImageDrop({
  name,
  label,
  helperText,
  onAddFiles,
  onRemoveFile,
  multiple,
  acceptedTypes,
  maxSizeMB = 2,
  maxWidthOrHeight = 1000,
  selectImageText = 'Arraste e solte as imagem aqui.',
  selectImagesText = 'Arraste e solte a imagens aqui.',
  clickToSelectButtonText = 'Ou clique para selecionar.',
  errorMessageOnUpload = 'Não foi possível processar o arquivo, tente novamente!',
  ...other
}: Props & DropzoneProps) {
  const [files, setFiles] = useState<ImageFile[]>([]);
  // unform
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    fieldName, registerField, error,
  } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      setValue(ref: any, value: ImageFile | ImageFile[]) {
        if (value) {
          if (Array.isArray(value)) {
            setFiles(value);
          } else {
            setFiles([value]);
          }
        }
      },
      getValue() {
        return multiple ? files : files[0];
      },
    });
  }, [fieldName, files, multiple, registerField]);

  const compressFiles = useCallback(async (currentFiles: any[]) => Promise.all(currentFiles.map(async (file) => {
    const options = {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker: true,
    };

    const compressedBlob = await imageCompression(file, options);
    const compressedFile = new File([compressedBlob], file.name, {
      type: compressedBlob.type,
    });

    const compressedFileSize = Number(compressedFile.size / 1024 / 1024);

    if (compressedFileSize > 2) {
      toast.error(selectImageText);
      return;
    }

    return compressedFile;
  })), [maxSizeMB, maxWidthOrHeight, selectImageText]);

  // component
  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps,
  } = useDropzone({
    multiple,
    ...other,
    accept: acceptedTypes || 'image/*',
    onDrop: async (acceptedFiles: any[]) => {
      acceptedFiles = acceptedFiles.map((file: any) => Object.assign(file, {
        url: URL.createObjectURL(file),
      }));
      if (multiple) {
        setFiles((oldFiles) => [...oldFiles, ...acceptedFiles]);
      } else {
        files.map((file) => file.id && onRemoveFile && onRemoveFile(file));
        setFiles(acceptedFiles);
      }
      if (onAddFiles) {
        let compressedFiles = acceptedFiles;

        if (maxSizeMB || maxWidthOrHeight) {
          compressedFiles = await compressFiles(acceptedFiles);
        }

        if (compressedFiles[0] === undefined) {
          acceptedFiles.map((file) => removeFile(file));
        }

        const newFiles = await onAddFiles(compressedFiles);
        setFiles((oldFiles) => (multiple ? [...oldFiles.filter((f) => !acceptedFiles.map((a) => a.url).includes(f.url)), ...newFiles] : newFiles));
      }
    },
  });

  const removeFile = (file: ImageFile) => {
    setFiles((oldFiles) => oldFiles.filter((f) => f.url !== file.url));
    if (onRemoveFile) {
      onRemoveFile(file);
    }
  };

  const thumbs = files.map((file) => (
    <Thumb key={file.name}>
      <ThumbRemove size="small" color="secondary" onClick={() => removeFile(file)}>
        <Delete />
      </ThumbRemove>
      <ThumbInner>
        <ThumbImage
          alt={file.name}
          src={file.url}
        />
        {onAddFiles && !file.id && <Progress />}
      </ThumbInner>
    </Thumb>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => !file.id && URL.revokeObjectURL(file.url));
  }, [files]);

  return (
    <FormControl error={!!error}>
      {label && <label htmlFor={fieldName}>{label}</label>}

      <DropzoneContainer {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        {multiple ? selectImagesText : selectImageText}
        <p>{clickToSelectButtonText}</p>
      </DropzoneContainer>

      <ThumbsContainer>
        {thumbs}
      </ThumbsContainer>

      {(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
    </FormControl>
  );
}
