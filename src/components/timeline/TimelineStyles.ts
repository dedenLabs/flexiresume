import styled from 'styled-components';

export const CategoryTitle = styled.h3`
  cursor: pointer;
  margin: 0;
  padding: 0;
  color: #333;
  font-size: 0.8rem;
`;

export const CategoryBody = styled.span`
  margin: 0;   
`;

// Timeline 节点
export const Node = styled.div`
  display: flex;
  flex-direction: row;
  position: relative; 
  width: 100%; /* 或者 max-width: 100%; */
  overflow-x: auto; 

  &::before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 0;
    width: 1px;
    height: 100%;
    background: #ccc;
  }
`;


// 节点内容
export const Content = styled.div`
  padding-left: 1.5rem;
  width: 100%; 
  overflow-x: auto; 
`;