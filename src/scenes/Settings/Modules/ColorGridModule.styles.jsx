import styled from 'styled-components';

export const Headline = styled.h2`
  color: #8395AB;
  font-size: 2rem;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); 
  gap: 1rem; 
  margin-top: 1rem;
`;

//The colored square in the grid
export const Square = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${props => props.color};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #8395AB;
    cursor: pointer;
  }
`;

export const IconWrapper = styled.div`
  margin-top: 4rem;
  text-align: center;
  font-size: 5rem;
`;

export const Title = styled.p`
  margin-top: 0.5rem;
  font-weight: bold;
  text-align: center;
  font-size: 1.5rem;
  color: #fff;
  text-transform: uppercase;
`;


// Style for ikon
export const Icon = styled.img`
  fill: #fff; // Farve på ikonet
`;

//Installed-info
export const InstalledBar = styled.div`
background-color: #D9D9D9;
position: absolute;
top: 0;
right: 0;
width: 100%;
height: 4rem;
  & > p {
    font-size: 19px;
    color: #8395AB;
  }
`
//Installed-info
export const PausedBar = styled.div`
  background-color: rgba(217, 217, 217, 0.5); /* Use rgba for transparency */
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;

  & > p {
    font-size: 19px;
    color: #8395AB;
  }
`;
