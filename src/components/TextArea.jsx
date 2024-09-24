import styled from 'styled-components'
import {flattenProp} from 'recompose'
import {Input} from 'components'

const TextArea = styled(Input.withComponent('textarea'))`
  height: ${(props) => props.height || 'auto'};
  resize: none;
  line-height: 1.5;
`

const enhancer = flattenProp('field')

export default enhancer(TextArea)
