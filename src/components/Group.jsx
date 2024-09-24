import styled from 'styled-components'

const Group = styled.div`
  flex: 1;
  display: flex;
  flex-direction: ${(props) => (props.col ? 'column' : 'row')};
  border-radius: 5px;
  overflow: hidden;
`

export default Group
