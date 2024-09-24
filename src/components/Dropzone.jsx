import React from 'react'
import styled from 'styled-components'
import ReactDropzone from 'react-dropzone'

const Conatiner = styled.div`
  padding: 10px;
  border: 1px dashed ${(props) => props.theme.colors.secondary};
  border-radius: 5px;
  cursor: pointer;
`

const Dropzone = ({children, ...props}) => (
  <ReactDropzone {...props}>
    {({getRootProps, ...rest}) => (
      <Conatiner {...getRootProps()}>{children(rest)}</Conatiner>
    )}
  </ReactDropzone>
)

export default Dropzone
