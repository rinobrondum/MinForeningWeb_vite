import styled from 'styled-components';
import { Button } from 'components';


export const PanelContainer = styled.div`
  justify-content: flex-end;
  background-color: #8395AB;
  height: 210px;
  border-radius: 5px;
  padding: 20px;
  padding-bottom: 1rem; 
  position: relative;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); 
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Title = styled.h2`
  font-weight: bold;
  font-size: 1.3rem;
  color: #fff;
  margin-left: 10px;
`;

export const TextInput = styled.input`
  padding: 2rem;
  margin-top: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: none;
  width: 100%;
  height: 12vh;
`;

export const AskButton = styled(Button)`
  background-color: #DFB388;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin-top: 7rem;
  border-radius: 5px;
  position: absolute;
  right: 4vw;
  top: 4px;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ABD395; 
  }
`;

export const OplevButton = styled(Button)`
  background-color: #DFB388;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin-top: 1rem;
  border-radius: 5px;
  right: 4vw;
  top: 4px;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ABD395; 
  }
`;

export const FaqButton = styled(Button)`
  background-color: #DFB388;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin-top: 1rem;
  border-radius: 5px;
  margin-right: 1rem;
  right: 4vw;
  top: 4px;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ABD395; 
  }
`;
