import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import icon_phone from '../assets/phone.svg';
import icon_wx from '../assets/wx.svg';
import icon_email from '../assets/email.svg';
import icon_experience from '../assets/experience.svg';
import icon_education from '../assets/education.svg';
import icon_male from '../assets/male.svg';
import icon_woman from '../assets/woman.svg';
import icon_location from '../assets/location.svg';
// import { AiOutlineMan, AiOutlineWoman } from "react-icons/ai";
// import { MdPhoneAndroid } from "react-icons/md";
// import { SiWechat } from "react-icons/si";
import { IoHome } from "react-icons/io5";
// 主流通讯方式图标 - 国际化支持
import {
  FaTelegram,
  FaWhatsapp,
  FaSkype,
  FaLinkedin,
  FaDiscord,
  FaSlack
} from "react-icons/fa";
import { SiLine, SiKakao } from "react-icons/si";
import { QRCodeSVG } from 'qrcode.react';
import { replaceCDNBaseURL } from '../utils/Tools';
import { useTheme } from '../theme';
interface HeaderProps {
  name: string;
  gender: string;
  email: string;
  avatar: string;
  position: string;
  location: string;
  phone: string;
  wechat: string;
  status: string;
  age: string;
  is_male: number;
  education: string;
  work_experience_num: string;
  work_experience: string;
  home_page: string;
  qrcode: boolean | string;
  qrcode_msg: string;
  // 主流通讯方式 - 国际化支持（可选字段）
  telegram?: string;
  whatsapp?: string;
  skype?: string;
  linkedin?: string;
  discord?: string;
  slack?: string;
  line?: string;
  kakao?: string;
}
const HeaderWrapper = styled.header`
  // display: flex;
  // align-items: center;
  // padding: 1rem 2rem;
  // background: #333;
  // color: white;
  // border-radius: 8px;
`;

const InfoWrapper = styled.div`
  flex: 1; 
`;

const Name = styled.h1`
  font-size: 1.5rem;  
  letter-spacing: 0.5rem;
`;
const Position = styled.h2`
  font-size: 1rem;  
  font-weight: 400;
  // letter-spacing: 0rem;
`;

const Details = styled.p`
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  font-size: 0.75rem; 
`;

const Avatar = styled.img`
  width: 6.5rem;
  height: 6.5rem; 
  border-radius: 20%;
  object-fit: cover;   
  ${(props) => props.qrcode ? `
    margin-right: 1rem;
    float: left
    `: `
    float: right
  `}
`;
const QRCodeContener = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark?: boolean }>`
    // margin: 0 0.4rem;
    width: 6.5rem;
    height: 6.5rem;
    float: right;
    text-align: center;
    font-size: 0.75rem;

    /* 深色模式下的二维码容器优化 */
    ${props => props.isDark && `
      background: rgba(226, 232, 240, 0.1);
      border-radius: 8px;
      padding: 4px;

      /* 二维码反色处理 */
      svg {
        filter: invert(1) hue-rotate(180deg);
        background: white;
        border-radius: 4px;
      }
    `}
`;
const QRCode = styled.img` 
    width: 100%;
    height: 100%; 
`;
const Vline = styled.em`
    margin: 0 0.4rem;
    width: 1.5px;
    height: 0.8rem;
    vertical-align: middle;
    background: #aaa;
`;
const Icon = styled.img.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark?: boolean }>`
    margin: 0 0.4rem;
    width: 1rem;
    height: 1rem;
    /* 使用filter来改变SVG颜色 */
    filter: ${props => props.isDark
        ? 'brightness(0) saturate(100%) invert(65%) sepia(11%) saturate(297%) hue-rotate(181deg) brightness(93%) contrast(87%)' // 浅灰色 #a0aec0
        : 'brightness(0) saturate(100%) invert(53%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(85%)'   // 深灰色 #888
    };
    transition: filter 0.3s ease;

    /* 悬停效果 */
    &:hover {
        filter: ${props => props.isDark
            ? 'brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(187deg) brightness(119%) contrast(86%)' // 蓝色 #4a9eff
            : 'brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(187deg) brightness(119%) contrast(86%)'  // 蓝色 #3498db
        };
    }
`;

const GenderIcon = styled.img.withConfig({
  shouldForwardProp: (prop) => prop !== 'isMale',
}) <{ isMale?: number }>`
  margin: -0.2rem -0.0rem;
  width: 1.4rem;
  height: 1.4rem; 
  /* 将颜色应用于 SVG 图标 */
  ${(props) => props.isMale !== undefined && `
  filter: ${props.isMale == 1
      ? 'brightness(0) saturate(100%) invert(64%) sepia(32%) saturate(1907%) hue-rotate(168deg) brightness(90%) contrast(88%)'
      : 'brightness(0) saturate(100%) invert(83%) sepia(46%) saturate(1514%) hue-rotate(299deg) brightness(89%) contrast(90%)'
    };
 `}
`;
const IconStyle = { fontSize: "1rem", margin: '0 0.4rem' };
 

/**
 * 渲染通讯方式组件
 */
const CommunicationMethods: React.FC<{
  telegram?: string;
  whatsapp?: string;
  skype?: string;
  linkedin?: string;
  discord?: string;
  slack?: string;
  line?: string;
  kakao?: string;
}> = ({ telegram, whatsapp, skype, linkedin, discord, slack, line, kakao }) => {
  const methods = [
    { value: telegram, icon: FaTelegram, label: 'Telegram', color: '#0088cc' },
    { value: whatsapp, icon: FaWhatsapp, label: 'WhatsApp', color: '#25d366' },
    { value: skype, icon: FaSkype, label: 'Skype', color: '#00aff0' },
    { value: linkedin, icon: FaLinkedin, label: 'LinkedIn', color: '#0077b5' },
    { value: discord, icon: FaDiscord, label: 'Discord', color: '#7289da' },
    { value: slack, icon: FaSlack, label: 'Slack', color: '#4a154b' },
    { value: line, icon: SiLine, label: 'Line', color: '#00c300' },
    { value: kakao, icon: SiKakao, label: 'KakaoTalk', color: '#ffcd00' },
  ];

  const activeMethods = methods.filter(method => method.value);

  if (activeMethods.length === 0) return null;

  return (
    <>
      {activeMethods.map((method, index) => (
        <React.Fragment key={method.label}>
          <Vline />
          <method.icon
            style={{
              ...IconStyle,
              color: method.color,
              cursor: 'pointer'
            }}
            title={`${method.label}: ${method.value}`}
          />
          <span style={{ fontSize: '0.75rem' }}>{method.value}</span>
        </React.Fragment>
      ))}
    </>
  );
};

const Header: React.FC<HeaderProps> = ({
  name, qrcode, qrcode_msg, home_page, avatar, gender, position, expected_salary,
  location, is_male, email, phone, wechat, status, age, education,
  work_experience_num, work_experience,
  // 主流通讯方式
  telegram, whatsapp, skype, linkedin, discord, slack, line, kakao
}) => {
  const { isDark } = useTheme();

  return (
    <HeaderWrapper>
      <InfoWrapper>
        <motion.div key={location.pathname} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {qrcode && window.innerWidth > 680/* 尺寸较小 或 已经在移动设备上隐藏二维码 */ ? <QRCodeContener isDark={isDark}>
            <QRCodeSVG
              value={typeof (qrcode) == "string" ? qrcode : window.location.href}
              size={150}
              width="100%"
              height="100%"
              fgColor={isDark ? "#1a202c" : "#000000"}
              bgColor={isDark ? "#e2e8f0" : "#ffffff"}
            />
            {qrcode_msg}
          </QRCodeContener> : null}
          <Avatar qrcode={qrcode ? 1 : 0} src={replaceCDNBaseURL(avatar)} />
          <Name>{name}
            {/* {is_male == 1 ? <AiOutlineMan style={{ color: '#3ea8da' }} /> : <AiOutlineWoman style={{ color: 'pink' }} />} */}
            <GenderIcon src={/*这个图标比react-icons的厚实好看*/is_male == 1 ? icon_male : icon_woman} isMale={is_male} />
            {home_page ? (
              <>
                {/* <Details> */}
                <IoHome style={IconStyle} /><a className="no-link-icon" href={home_page} style={{
                  // all: "initial", //清空所有样式
                  fontSize: "1rem",
                  letterSpacing: "0rem" // 重新设置字母间距
                }}>{home_page}</a>
                {/* <Vline /> */}
                {/* </Details> */}
              </>
            ) : null}
          </Name>
          <Position>{position}-{location} {expected_salary}</Position>

          <Details>
            <Icon src={icon_experience} isDark={isDark} />{work_experience_num}<Vline />
            {age}<Vline /> {gender}<Vline />
            {education} <Vline />
            {status}
          </Details>


          <Details>
            {/* 基础联系方式 */}
            <Icon src={icon_email} isDark={isDark} /><a href={"mailto:" + email} className="no-link-icon">{email}</a>
            <Vline />
            <Icon src={icon_phone} isDark={isDark} />{phone}<Vline />
            <Icon src={icon_wx} isDark={isDark} />{wechat}

            {/* 主流通讯方式 - 国际化支持 */}
            <CommunicationMethods
              telegram={telegram}
              whatsapp={whatsapp}
              skype={skype}
              linkedin={linkedin}
              discord={discord}
              slack={slack}
              line={line}
              kakao={kakao}
            />
          </Details>
        </motion.div>
      </InfoWrapper>
    </HeaderWrapper >
  );
}
export default Header;
