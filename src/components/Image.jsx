import React, {PureComponent} from 'react'
import styled from 'styled-components'
import {space, display} from 'styled-system'

const Img = styled.img`
  ${space};
  ${display};
  border-radius: ${(props) => (props.round ? '50%' : 0)};
  opacity: ${(props) => (props.loaded ? 1 : 0)};
  will-change: opacity;
  transition: opacity 0.75s ease;
`

class Image extends PureComponent {
  state = {
    loaded: false,
  }

  onLoad = () =>
    this.setState({
      loaded: true,
    })

  render() {
    return (
      <Img {...this.props} onLoad={this.onLoad} loaded={this.state.loaded} />
    )
  }
}

export default Image
