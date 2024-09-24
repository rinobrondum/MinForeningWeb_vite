import React, {useCallback} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {useDropzone} from 'react-dropzone'
import {rgba} from 'polished'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Text, Flex, Box} from 'components'
import {Camera} from 'components/icons'
import {removeImage} from 'activities/actions'

const PreviewContainer = styled(Flex).attrs({
  flexWrap: 'wrap',
})`
  margin: -8px;
`

const Preview = styled(Box)`
  position: relative;
  height: 75px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid ${(props) => props.theme.colors.primary};
  box-shadow: 0 0 5px -2px rgba(0, 0, 0, 0.5);

  will-change: opacity;
  transition: opacity 0.125s ease;

  &::after {
    content: ' \\00d7';
    color: ${(props) => props.theme.colors.black};
    font-size: 2rem;
    position: absolute;
    top: 20px;
    left: 30px;
    opacity: 0;
    will-change: opacity;
    transition: opacity 0.125s ease;
  }

  &:hover {
    opacity: 0.75;

    &::after {
      opacity: 1;
    }
  }
`

const DropArea = styled(Box).attrs({
  p: 1,
})`
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 5px;
  cursor: pointer;
  background: ${(props) =>
    props.active ? rgba(props.theme.colors.primary, 0.25) : 'transparent'};
  will-change: background;
  transition: background 0.125s ease;
`

const ImagesInput = ({
  setFieldValue,
  value = [],
  removeImage,
  id,
  isRecurring,
}) => {
  const handleDrop = useCallback(
    (files) => {
      setFieldValue('images', [
        ...value,
        ...files.map((file) =>
          Object.assign(file, {preview: URL.createObjectURL(file)})
        ),
      ])
    },
    [value, setFieldValue]
  )

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: 'image/*',
    onDropAccepted: handleDrop,
  })

  const t = useCustomTranslation()

  return (
    <Flex mb={3} flexDirection="column">
      {value && value.length > 0 && (
        <PreviewContainer>
          {value.map((image, i) => {
            const isFile = image instanceof File
            return (
              <Box width={0.25} p={2} key={i}>
                <Preview
                  style={{
                    backgroundImage: `url('${isFile ? image.preview : image}')`,
                  }}
                  onClick={() => {
                    if (!isFile) {
                      removeImage({id, url: image})
                    }
            
                    setFieldValue(
                      'images',
                      value.filter((file) => file !== image)
                    )
                  }}
                />
              </Box>
            )
          })}
        </PreviewContainer>
      )}
      <Box mt={value && value.length > 0 && 3}>
        <DropArea {...getRootProps()} active={isDragActive}>
          <input {...getInputProps()} />
          <Flex flex="1" justifyContent="center">
            <Box mr={2}>
              <Camera fill="primary" size={20} />
            </Box>
            <Text primary>{t('Tilføj billeder')}</Text>
          </Flex>
        </DropArea>
      </Box>
    </Flex>
  )
}

const enhancer = connect(null, {removeImage: removeImage.requested})

export default enhancer(ImagesInput)
