import styled from 'styled-components';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
// import { FaChevronRight, FaChevronDown } from "react-icons/fa";
// import { TfiAngleRight, TfiAngleDown } from 'react-icons/tfi'; 
// https://react-icons.github.io/react-icons/search/#q=right 在线查找替换喜欢的图标

interface CollapseIconProps {
    collapsed: boolean;
}

const CollapseIcon: React.FC<CollapseIconProps> = ({ collapsed }) => {
    return <IconWrapper> 
        {collapsed ? <FiChevronRight /> : <FiChevronDown />}
        {/* {collapsed ? <FaChevronRight /> : <FaChevronDown />} */}
        {/* {collapsed ? <TfiAngleRight /> : <TfiAngleDown />} */}
    </IconWrapper>
}

export default CollapseIcon;


// 样式容器，可以设置一些基本的样式
const IconWrapper = styled.div` 
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  color: #888;

  &:hover {
    color: #333;
  }
`;