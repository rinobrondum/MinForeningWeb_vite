import React, {useCallback} from 'react'
import styled from 'styled-components'
import {useDropzone} from 'react-dropzone'
import {darken} from 'polished'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Text, Box, Flex} from 'components'
import {Camera} from 'components/icons'

const DropArea = styled(Flex).attrs({
  flexDirection: 'column',
})`
  height: 120px;
  background: ${(props) =>
    props.active
      ? darken(0.1, props.theme.colors[props.color])
      : props.theme.colors[props.color]};
  border-bottom: 2px solid ${(props) => props.theme.colors[props.color]};
  cursor: pointer;

  will-change: background;
  transition: background 0.125s ease;
`

const Preview = styled.div`
  width: 100%;
  height: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;

  will-change: opacity;
  transition: opacity 0.125s ease;

  &:hover {
    opacity: 0.5;
  }
`

const iconForType = ({icon: Icon}) => (
  <Icon fill="white" size={64} opacity="0.5" />
)

const CoverImageInput = ({handleChange, value, type}) => {
  const handleDropAccepted = useCallback(
    (files) =>
      handleChange(
        files.map((file) =>
          Object.assign(file, {preview: URL.createObjectURL(file)})
        )[0]
      ),
    [handleChange]
  )

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    multiple: false,
    accept: 'image/*',
    onDropAccepted: handleDropAccepted,
  })

  const t = useCustomTranslation()

  return (
    <DropArea
      {...getRootProps()}
      active={isDragActive}
      justifyContent="center"
      color={type.color}
    >
      <>
        <input {...getInputProps()} />
        {value ? (
          <Preview
            style={{
              backgroundImage: `url('${
                value instanceof File ? value.preview : value
              }')`,
            }}
          />
        ) : (
          <Flex flexDirection="column" p={2} alignItems="center">
            <Box mb={2}>{iconForType(type)}</Box>
            <Flex alignItems="center">
              <Camera fill="white" size={20} />
              <Box ml={2}>
                <Text light>{t('Tilføj coverbillede')}</Text>
              </Box>
            </Flex>
          </Flex>
        )}
      </>
    </DropArea>
  )
}

export default CoverImageInput
