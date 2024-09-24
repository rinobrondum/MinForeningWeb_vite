import React from 'react'
import styled from 'styled-components';

const StyledLink = styled.a`
  text-decoration: none;
  color: #1d86ff;
`
const ValidURL = (string) => {
  const regex = /\bhttps?:\/\/[^\s\n]+\b/g;
  
  if (string && string.string) {
    const parts = string.string.split(/(https?:\/\/[^\s\n]+)/);
    
    return parts.map((part, index) => (
      part.match(regex) ? <StyledLink key={index} href={part} target="_blank">{part}</StyledLink> : <React.Fragment key={index}>{part}</React.Fragment>
    ));
  } else {
    return <></>;
  }
};

export default ValidURL