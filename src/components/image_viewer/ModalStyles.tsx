import styled from 'styled-components';
export const ModalStyle = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`

export const ModalImageStyle = styled.img`
    max-width: 100%;
    max-height: 100%;
    transition: transform 0.3s ease;
    cursor: pointer; 
`

export const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px; 
  padding: 10px;
  cursor: pointer;
  z-index: 1100;  
`;