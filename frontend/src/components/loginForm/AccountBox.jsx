import { React } from "react";
import styled from "styled-components";
import { LoginForm } from "./loginForm";
import { motion } from "framer-motion";

const BoxContainer = styled.div`
  width: 500px;
  min-height: 650px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 19px;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(15, 15, 15, 0.28);
  position: relative;
  overflow: hidden;
`;

const TopContainer = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BackDrop = styled(motion.div)`
  position: absolute;
  width: 130%;
  height: 54.54545455%;
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  top: -100px;
  left: -80px;
  transform: rotate(-10deg);
  background: linear-gradient(
    58deg,
    rgba(243, 172, 18, 1) 20%,
    rgba(241, 196, 15, 1) 100%
  );
`;

const HeaderText = styled.div`
  position: absolute;
  font-size: 50px;
  color: #fff;
`;

const InnerContainer = styled.div`
  width: 100%;
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;



export default function AccountBox(props) {
  return (
    <BoxContainer>
      <TopContainer>
        <BackDrop />
        <HeaderText>התחברות</HeaderText>
      </TopContainer>
      <InnerContainer>
        <LoginForm />
      </InnerContainer>
    </BoxContainer>
  );
}
