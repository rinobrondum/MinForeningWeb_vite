// VideoModal for showing info about how to use the modules. change the iframe link...
import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 4000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
position: relative;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0rem;
  right: -3rem;
  background: none;
  border: none;
  color: #D89194;
  cursor: pointer;
  font-size: 2rem;
`;

const VideoModal = ({ videoUrl, onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent> show video here. If you are planning on using iframes: beware of the unsecurity of iframes...
        <CloseButton onClick={onClose}>X</CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default VideoModal;
