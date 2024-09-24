import styled from 'styled-components'

const Participant = styled.div`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  background-color: ${props => props.theme.colors[props.color || 'primary']};
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 50%;
`

export default Participant
