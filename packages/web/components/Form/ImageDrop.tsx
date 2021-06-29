import React from 'react';

import FileDrop, { FileDropProps } from "./FileDrop";

/**
 * This is a wrapper to FileDrop.
 * Just to keep retrocompatibility with older versions which uses ImageDrop.
 * 
 * @param param0 
 * @returns 
 */
export default function ImageDrop({
  acceptedTypes = ['image/*'],
  selectImagesText = 'Arraste e solte as imagens aqui.',
  selectImageText = 'Arraste e solte a imagem aqui.',
  ...other
}: FileDropProps) {
  return <FileDrop {...other} />
}
