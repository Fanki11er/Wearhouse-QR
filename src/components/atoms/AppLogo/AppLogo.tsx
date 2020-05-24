import React from 'react';
import styled from 'styled-components';
import Logo from '../../../assets/image/Logo.svg';

const StyledWrapper = styled.div`
  display: flex;
  width: 220px;
  height: 120px;

  border-radius: 15px;
  justify-content: center;
`;

const StyledImage = styled.img`
  width: 75%;
`;

const AppLogo = () => {
  return (
    <StyledWrapper>
      <StyledImage src={Logo} alt={'Logo'} />
    </StyledWrapper>
  );
};

export default AppLogo;