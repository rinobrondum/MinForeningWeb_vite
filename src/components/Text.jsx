import styled, {css} from 'styled-components'
import typography from 'lib/style/typography'

const rightMixin = css`
  text-align: right;
`

const centerMixin = css`
  text-align: center;
`

const Text = styled.p`
  ${(props) => props.right && rightMixin};
  ${(props) => props.center && centerMixin};
  ${(props) =>
    props.bg &&
    css`
      display: block;
      background: ${(props) => props.theme.colors[props.bg]};
      border-radius: 3px;
      padding: 5px 20px;
    `};

  margin: 0;
  ${typography};
  line-height: 1.6em;
  ${typography};

  & small {
    font-size: 0.75rem;
  }

  & strong {
    font-weight: bold;
  }
`

export default Text
