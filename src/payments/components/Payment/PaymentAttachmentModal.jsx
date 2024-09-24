import React from 'react';
import styled from 'styled-components';
import { Modal, Button, ButtonWithProtectedAction, Image} from 'components';


const AttachmentModal = ({ image, hide, deleteImage, t }) => {

  const handleDelete = () => {
      deleteImage(image)
      hide()
  }

  return (
    <Modal hide={hide}>
      
        <Image src={image.url} alt="Billede" m={3} />
        
          <ButtonWithProtectedAction danger m={3} mt={1} accept={handleDelete}>
            {t("Slet bilag")}
          </ButtonWithProtectedAction>

    </Modal>
  );
}

export default AttachmentModal;
