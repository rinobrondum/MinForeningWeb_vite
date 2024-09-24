import styled from 'styled-components'
import {lighten} from 'polished'

const Hr = styled.hr`
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid
    ${(props) => lighten(0.25, props.theme.colors.secondary)};
  margin: 0;
  padding: 0;
`

export default Hr
