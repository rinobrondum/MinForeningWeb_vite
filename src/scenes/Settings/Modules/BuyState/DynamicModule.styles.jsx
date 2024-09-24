import styled from 'styled-components';

export const Container = styled.div`
display: flex;

`;
// tilbageknap
export const Button = styled.button`
  background-color: #DFB388;
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 5px;
  position: absolute;
  right: 2rem;
  top: 15rem;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  cursor: pointer;
  text-transform: uppercase;

  span {
    cursor: pointer;
  }

  &:hover {
    background-color: #ABD395; 
  }
`;

// Container til titel og ikon
export const HeaderContainer = styled.div`
  display: block;
  position: relative; /* Add this line to create a new stacking context for HeaderContainer */
  z-index: 1; /* Increase z-index to make sure HeaderContainer is above MainContentContainer */
`;

// blå Firkant omkring titel og ikon
export const IconTitleBox = styled.div`
  display: flex;
  z-index: 12;
  justify-content: center;
  padding:1rem;
  background-color: #86C7E3;
  width: 310px;
  position: relative;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  text-transform: uppercase;
`;

// Titel på det valgte modul
export const Title = styled.h2`
  font-size: 32px;
  font-weight: 100;
  color: #8395AB;
  position: relative;
`;
// Ikonet til det valgte modul
export const Icon = styled.h2`
  color: #8395AB; // Farve på ikonet
  font-size: 4rem;
  margin:0;
  margin-right: 1rem;

`;
//tilbage til modul
export const BackToText = styled.p`
position: absolute;
top: -2rem;
left: 0;
color: #fff;
font-weight: 700;
letter-spacing: 1px;
font-size: 12px;
`;

// Container til hovedindholdet
export const MainContentContainer = styled.div`
  margin-top: -3rem;
  margin-left: 10%;
  width: 60%;
  height: 481px;
  background-color: #d9d9d9;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative; /* Add this line to create a new stacking context for MainContentContainer */
  z-index: 0; /* Decrease z-index to make sure it's behind HeaderContainer */
  padding:4rem;
`;
export const Tagline = styled.p`
  color: #fff; 
  font-size: 32px; 
  font-weight: 700; 
`;
export const Price = styled.p`
  color: #86C7E3; 
  font-size: 40px; 
  font-weight: 400; 
  margin: 0;
`;
export const Rabat = styled.p`
margin-top: 2rem;
  color: #8395AB;
  font-size: 20px; 
  font-weight: 100; 
`;

export const Her = styled.span`
  color: #DFB388;
  font-size: 20px; 
  font-weight: 700; 
  cursor: pointer; 
`;

// købsknap
export const BuyButtonContainer = styled.div`
  display: flex;
  position: absolute;
  bottom: 2rem;
  right: 8rem;
  z-index: 1; 
  &:hover {
    color: #DFB388;
  }
`;

export const BuyButton = styled.p`
  width: 10px;
  color: #8395AB;
  border: none;
  font-weight: bold;
  font-size: 1.5rem;
  cursor: pointer;
  text-transform: uppercase;

  &:hover {
    color: #DFB388;
  }
`;
export const DynamicButtonContainer = styled.div`
 display: flex;
 justify-content: flex-end;
 margin-right: 0;
`;

// Styled component for the "Paused" tab
export const PausedTab = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #F2F29D;
  color: #8395AB;
  padding: 0.5rem 1rem;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 5px;
  font-size: 16px;
`;

// Styled-components til menuen
export const MenuContainer = styled.div`
  /* position: absolute;
  top: 7rem;
  right: -13rem; */
  display: flex;
  flex-direction: column;
  gap: 8px; /* Afstand mellem menuelementer */
  padding: 16px;
`;

export const MenuItem = styled.p`
  font-weight: bold;
  font-size: 20px;
  color: #8395AB;
  cursor: pointer; 

  &:hover {
    color: #DFB388; 
  }
`;

export const Divider = styled.hr`
  margin: 8px 0;
  border: none;
  border-top: 1px solid #8395AB; /* Tynd streg som adskiller menuelementer */
`;