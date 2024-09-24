import React, {Component} from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import Box from './Box'
import memberDefault from 'images/member-default.png'

const File = styled.input.attrs({
  type: 'file',
  accept: 'image/*',
})`
  opacity: 0;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

const Preview = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto;
  border-radius: 50%;
  background-size: cover;
  background-image: url('${(props) => props.src}');
  background-position: center center;
`

class ImageInput extends Component {
  static defaultProps = {
    renderButton: () => null,
  }

  state = {
    preview: this.props.placeholder || memberDefault,
    loading: false,
  }

  constructor(props) {
    super(props)

    this.convertImageToBase64(props.field.value)
  }

  handleImageChange = ({currentTarget: {files}}) => {
    const {
      field: {name},
      form: {setFieldValue},
    } = this.props

    setFieldValue(name, files[0])
  }

  componentDidUpdate(prevProps) {
    const {
      field: {value},
    } = this.props

    if (get(value, 'name') !== get(prevProps, 'field.value.name')) {
      this.convertImageToBase64(value)
    }
  }

  convertImageToBase64(file) {
    if (!file) {
      return
    }

    this.setState(
      {
        loading: true,
      },
      () => {
        const reader = new FileReader()

        reader.addEventListener('load', () => {
          this.setState({
            preview: reader.result,
            loading: false,
          })
        })
        reader.readAsDataURL(file)
      }
    )
  }

  render() {
    const {
      field: {value, ...field},
      renderButton,
    } = this.props
    const {preview} = this.state

    return (
      <Box>
        <Box mb={2}>
          <Preview src={preview} />
        </Box>

        <Box position="relative">
          <File {...field} onChange={this.handleImageChange} />
          {renderButton({value})}
        </Box>
      </Box>
    )
  }
}

export default ImageInput
