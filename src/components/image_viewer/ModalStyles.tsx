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
    max-width: 90%;
    max-height: 90%;
    transition: transform 0.3s ease;
    cursor: pointer;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`

export const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px; 
  padding: 10px;
  cursor: pointer;
  z-index: 1100;  
`;