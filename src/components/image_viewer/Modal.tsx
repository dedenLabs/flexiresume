import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { ModalImageStyle, ModalStyle, CloseButton } from './ModalStyles';

const Modal = ({ imageUrl, onClose }) => {
  // 调试日志已移除: console.log('🖼️ [DEBUG] Modal组件渲染，图片URL:', imageUrl);

  return (
    <ModalStyle onClick={onClose}>
      <ModalImageStyle
        src={imageUrl}
        onClick={(e) => e.stopPropagation()}
        // 调试日志已移除: onLoad={() => console.log('🖼️ [DEBUG] 模态框图片加载成功')}
        // 调试日志已移除: onError={() => console.error('🖼️ [DEBUG] 模态框图片加载失败')}
      />
      <CloseButton onClick={onClose}>
        <MdClose size={30} color="white" />
      </CloseButton>
    </ModalStyle>
  );
};

export default Modal;
