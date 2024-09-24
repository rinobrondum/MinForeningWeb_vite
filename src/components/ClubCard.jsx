import styled from 'styled-components'
import {Flex} from '@rebass/grid'
import createBackgroundMixin from 'lib/style/createBackgroundMixin'

const ClubCard = styled(Flex).attrs({
  flexDirection: 'column',
  p: 3,
})`
  
  overflow: hidden;
  border-radius: ${(props) => (props.square ? 0 : '15px')};
  ${(props) =>
    props.primary && createBackgroundMixin(props.theme.colors.primary)};
  ${(props) => props.white && createBackgroundMixin(props.theme.colors.white)};
  ${(props) =>
    props.secondary && createBackgroundMixin(props.theme.colors.secondary)};
  ${(props) =>
    props.secondaryLight &&
    createBackgroundMixin(props.theme.colors.secondaryLight)};

  box-shadow: ${(props) =>
    props.shadow ? '0 2px 12px -3px rgba(0, 0, 0, 0.5)' : 'none'};
    
`

export default ClubCard

