import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { rgba } from 'polished';
import useCustomTranslation from 'lib/customT';
import { Text, Flex, Box } from 'components';
import { Camera } from 'components/icons';
import { removeImage } from 'activities/actions';
import AttachmentModal from './PaymentAttachmentModal'; // Importer Modal komponenten
import { useDropzone } from 'react-dropzone'; // Importer useDropzone hooket

const PreviewContainer = styled(Flex).attrs({
  flexWrap: 'wrap',
})`
  margin: -8px;
`;

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

  &:hover {
    opacity: 0.75;
  }
`;

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
`;

function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

const ImagesInput = ({
  setFieldValue,
  value,
  removeImage,
  id,
  isRecurring,
  paymentImages,
  deleteFn,
}) => {
  const [modalImage, setModalImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDrop = useCallback(
    (files) => {
      setFieldValue('images', [
        ...files.map((file) =>
          Object.assign(file, {preview: URL.createObjectURL(file)})
      ),
      ...paymentImages,
      ])
    },
    [value, setFieldValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDropAccepted: handleDrop,
  });

  const openModal = (image) => {
    if(!image.path){
      setModalImage(image);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };



  const t = useCustomTranslation();

  useEffect(() => {
    if (isIterable(paymentImages)) {
      setFieldValue('images', [
        ...paymentImages,
      ])
    }
  }, [])

  const deleteImage = (image) =>
    
      
        new Promise((resolve, reject) => {
          deleteFn({
            fileId: image.fileId, 
            entityType: 17, 
            entityId: id,
            resolve, reject})
        }).then(() => {
          
          setFieldValue('images', value.filter((file) => file !== image))
          
        });
      
    
  
  return (
    <Flex mb={3} flexDirection="column">
      {value && value.length > 0 && (
        <PreviewContainer>
          {value.map((image, i) => {
            const isFile = image instanceof File;
            const imageUrl = isFile ? image.preview : image.url;

            return (
              <Box width={1 / 4} p={2} key={i}>
                <Preview
                  style={{
                    backgroundImage: `url('${imageUrl}')`,
                  }}
                  onClick={() => openModal(image)}
                />
              </Box>
            );
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
            <Text primary>{t('Tilføj billede')}</Text>
          </Flex>

          {isRecurring && (
            <Text center small primary>
              Gælder kun ved oprettelsen af en enkelt aktivitet
            </Text>
          )}
        </DropArea>
      </Box>

      {modalOpen && (
        <AttachmentModal
          image={modalImage}
          hide={closeModal}
          deleteImage={deleteImage}
          t={t}
        />
      )}
    </Flex>
  );
};

const enhancer = connect(null, { removeImage: removeImage.requested });

export default enhancer(ImagesInput);
