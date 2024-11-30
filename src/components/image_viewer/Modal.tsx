import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { ModalImageStyle, ModalStyle, CloseButton } from './ModalStyles';

const Modal = ({ imageUrl, onClose }) => {
  return (
    <ModalStyle onClick={onClose}>
      <ModalImageStyle src={imageUrl} onClick={(e) => e.stopPropagation()} />
      <CloseButton onClick={onClose}>
        <MdClose size={30} color="white" />
      </CloseButton>
    </ModalStyle>
  );
};

export default Modal;
