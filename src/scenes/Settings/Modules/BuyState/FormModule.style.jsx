import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 4000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  position: relative;
  background-color: #fff;
  border-radius: 5px;
  padding: 8rem 8rem 11rem 8rem;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 0rem;
  right: -3rem;
  background: none;
  border: none;
  color: #D89194;
  cursor: pointer;
  font-size: 2rem;
`;

export const H2 = styled.h2`
  background: none;
  border: none;
  color: #8395AB;
  cursor: pointer;
  font-size: 2rem;
  text-transform: uppercase;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

export const Button = styled.button`
background-color: #DFB388;
color: #fff;
border: none;
padding: 1rem 2rem;
border-radius: 5px;
font-weight: bold;
font-size: 1rem;
transition: background-color 0.3s ease;
cursor: pointer;

&:hover {
  background-color: #ABD395; 
}
`;

export const ErrorMessage = styled.span`
  color: red;
`;

